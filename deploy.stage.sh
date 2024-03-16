#!/bin/bash

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 678161666670.dkr.ecr.ap-south-1.amazonaws.com

sleep 1

docker stack deploy -c docker-compose.stage.yml flowmapperai --with-registry-auth

sleep 1

docker system prune -af

sleep 1

echo "Done."