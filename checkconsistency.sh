#!/usr/bin//python

import sys
import re
import json
import os
import urllib2, base64
from subprocess import call, check_output
import dateutil.parser
import datetime
from datetime import timedelta, datetime, tzinfo
import operator


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

ages={}
dictvar={}
faulty={} 
warnings={}

# list of repositories that we should scan for age

repositories=["utils", "crosscompilers", "sgx-exporter", "sconecli", "apps", "muslgcc", "services", "checksgx", "sconedocu", "helloworld"]

# exampl        es contains repository names that are used as examples in the documentation
# i.e., they do not exist

examples={}
examples["nginx"]=0
examples["crosscompilers:python27-authenticated"]=0
examples[""]=0
examples["helloworld:"]=0

# check for image names in markdown files

def parse_file(file):
    f = open(file, 'r')
    cnt=0
    for line in f:
        for word in line.split():
            m = re.search("(?<=sconecuratedimages/)[a-zA-Z0-9_\-\.]*[:]*[a-zA-Z0-9_\-\.]*", word)
            if m != None:
                cnt+=1
                dictvar[m.group(0)] = file
    print bcolors.OKBLUE + "processed file %s: found %d image names" % (file, cnt) + bcolors.ENDC

# determine age of image which was previously pulled

def image_age(image):
    s=check_output(["docker", "image", "inspect", image])
    json1_data = json.loads(s)[0]
    cdate = dateutil.parser.parse(json1_data["Created"])
    age= datetime.now(tz=cdate.tzinfo) - cdate
    if age.days > 30:
        print bcolors.WARNING + "WARNING: Image s%s is too old: age in days =%d" % (image, age.days) + bcolors.ENDC
        ages[image] = age.days
    return age.days

# check age of all images in a repository (i.e., all tags)

def check_age(repository):
    print "- Checking age of images in repository %s" % repository
    tags=check_output(["docker", "image", "ls", "--format", "{{.Tag}}", repository])
    for tag in tags.split():
        if not tag == "<none>":
            image= "%s:%s" % (repository, tag)
            print " - Checking age of image %s" % image
            age=image_age(image)
            print " - Age= %s days" % age

# check age of all repositories in repository list

def check_repositories():
    for rep in repositories:
        repository= "sconecuratedimages/%s" % rep
        print "Processing repository %s" % repository
        r=call(["docker", "pull", "--all-tags", repository])
        check_age(repository)

# check markdown file of documentation and age of all repositories

def main(argv):
    check_repositories()
    for x in argv[1:]:
        parse_file(x)
    for key in dictvar:
        print "Processing image %s" % key
        with open(os.devnull, 'w') as devnull:
            r=call(["docker", "pull", "sconecuratedimages/"+key], stdout=devnull)
        if r != 0:
            print bcolors.FAIL + "Cannot pull image sconecuratedimages/"+key + bcolors.ENDC
            faulty[key]=dictvar[key]
        else:
            s=check_output(["docker", "image", "inspect", "sconecuratedimages/"+key])
            json1_data = json.loads(s)[0]
            cdate = dateutil.parser.parse(json1_data["Created"])
            age= datetime.now(tz=cdate.tzinfo) - cdate
            if age.days > 30:
                warnings[key] = bcolors.WARNING + "WARNING: Image sconecuratedimages/%s is too old: age in days =%d" % (key, age.days) + bcolors.ENDC

    print "Warnings related to images mentioned in documentation:"
    for key in warnings:
        print warnings[key]

    print "Errors related to images that have not recently been updated:"
    sorted_age=sorted(ages.items(), key=operator.itemgetter(1))
    for key in sorted_age:
        print bcolors.OKBLUE + "ERROR: image %s too old (%d days)" % (key[0], key[1]) + bcolors.ENDC

    print "Errors related of images mentioned in documentation but not available on docker hub:"
    for key in faulty:
        if not key in examples:
            print bcolors.FAIL + "ERROR: did not find image sconecuratedimages/"+key+" in File: "+faulty[key] + bcolors.ENDC


if __name__ == "__main__":
    main(sys.argv)