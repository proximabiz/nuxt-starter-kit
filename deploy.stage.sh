#!/bin/bash

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 678161666670.dkr.ecr.ap-south-1.amazonaws.com

docker stack deploy -c docker-compose.stage.yml flowmapperai --with-registry-auth

docker system prune -af

echo "Done."