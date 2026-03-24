
cat > stream.sh <<EOF
while IFS='\n' read -r line
do
  echo "\$line"
  sleep 20
done
EOF
chmod a+x stream.sh

cat > screencast1.txt  <<EOF
# Screencast for Exercise1
cd Exercise1

ls

# solution.sh extracts MRENCLAVE of CAS from sconedocs.github.io 
# and the attests scone-cas.cf

./solution.sh 

# let us extract the TLS certificate for scone-cas.cf

scone cas show-certificate > cas_cert.crt

# let us use this certificate to retrieve some public information from scone-cas.cf
# we have created a session named "example_session"

export session_name="example_session"

# this session exports a public value named "example_value"
export value_name="example_value"

# without adding the certificate retrieved during attestation, this will fail:

curl --connect-to cas:8081:scone-cas.cf:8081 https://cas:8081/v1/values/session=${session_name},secret=${value_name}

# since the CAS certificate is self-signed 

# using certificate cas_cert.crt, curl can establish a TLS connection and
# retrieve the public value 

curl --cacert  cas_cert.crt  --connect-to cas:8081:scone-cas.cf:8081 https://cas:8081/v1/values/session=${session_name},secret=${value_name}

exit
EOF

cat screencast1.txt | ./stream.sh |  asciinema rec -t "exercise 1" -i 1 -y

cat > screencast2.txt  <<EOF

# Screencast for Exercise 2
cd Exercise2

ls

# we see that we ran this beforehand
# there is a file `state.env` that contains the 
# name of the namespace and the hash of the policy

cat state.env

# We see that the name of the policy is "my_exercise-christoffetzer-31192".
# It seems in this case that we are missing the hash: environment variable
# NAMESPACE_SESSION_HASH is empty. We will fix this in the next exercise.

# the scripts should be idempotent, i.e., if there was an error or
# partial execution, we should be able to fix this. Let us run this now.

./solution.sh

# We see in the log that the script does not generate new namespace but
# keeps the old one. Let's look at the state again.

cat state.env

# We see that the hash has not been updated. The underlying reason is that when reading
# a policy, we actually do not get the current hash of the policy. We need
# to explicitly compute this. Let us look at this in the next exercise.

exit
EOF

cat screencast2.txt | ./stream.sh |  asciinema rec -t "exercise 2" -i 1 -y


cat > screencast3.txt  <<EOF

# Screencast for Exercise 3
cd Exercise3

# let us look at the saved state of the last exercise

cat ../Exercise2/state.env 

# for some reason, we lost the session hash, i.e., environment
# variable NAMESPACE_SESSION_HASH is empty.

# This is a problem since we need the session hash to update the
# session. The session hash enables us to view the history of all
# sessions and it ensures a writer can only update a session if it
# knows the last session.


# Hence, we need to recalculate the session hash. We can do this by
# downloading the session and computing the session hash with command
# "scone session verify".

./solution.sh


# Let us look at the state of this exercise:

cat state.env 

# We see that the session hash has been updated.

exit
EOF

cat screencast3.txt | ./stream.sh |  asciinema rec -t "exercise 3" -i 1 -y


cat > screencast4.txt  <<EOF

# Screencast for Exercise 4
cd Exercise4

# let us look at the saved state of this exercise

cat state.env 

# We see that we have a defined namespace and a policy hash.
# Let's check if this policy is already updated to version "0.3" 
# and that the policy hash is correct. If not, we update the policy.
# Finally, we retrieve all predecessors of this policy

./solution.sh


# We see that the session has predecessors. 
# We could use this to check if all previous policies
# satisfy our protection goals.

exit
EOF

cat screencast4.txt | ./stream.sh |  asciinema rec -t "exercise 4" -i 1 -y



cat > screencast5.txt  <<EOF

# Screencast for Exercise 5
cd Exercise5

# let us look at the saved state of this exercise

cat state.env 

# We see that we already run this solution and 
# we already stored the policy name and hash

./solution.sh

# We see that the script tried to access the public and
# the private key of the session. The public key can be
# accessed without a client certificate. The private ley
# cannot be accessed - even if one specifies the client
# certificate of the policy creator.

exit
EOF

cat screencast5.txt | ./stream.sh |  asciinema rec -t "exercise 5" -i 1 -y
