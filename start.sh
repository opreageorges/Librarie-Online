# Search the name of the flask container
for elem in $(docker ps | grep 'flask' | sed 's/\ /\n/g')
do
	#echo $elem
	if grep -q "1" <<< "$elem"
	then
		flask_cont_name=$elem
	fi
done

# Start docker-compose
docker-compose up -d

echo "Configuring containers"

# Waiting for the containers to start, with time, kinda unsafe :)
sleep 10

# Executes the script that puts the right ip in the database URI
docker exec $flask_cont_name python3 /flask/Misc/MakeIp.py
docker restart $flask_cont_name

echo "Containers configured"
