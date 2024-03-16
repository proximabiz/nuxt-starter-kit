#!/bin/bash
STACK="flowmapperai"

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 678161666670.dkr.ecr.ap-south-1.amazonaws.com

sleep 1

echo "please wait..."
sleep 1

source ./deploy.aws.env && docker stack deploy --with-registry-auth -c ./docker-compose.stage.yml $STACK && sleep 3

sleep 1

docker system prune -af

sleep 1

echo "Done."