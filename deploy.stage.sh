#!/bin/bash
STACK="flowmapperai"

# Login to AWS ECR
echo "Logging into AWS ECR..."
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 678161666670.dkr.ecr.ap-south-1.amazonaws.com
if [ $? -ne 0 ]; then
    echo "Failed to login to Docker registry."
    exit 1
fi

echo "Login successful. Please wait..."
sleep 1

# Source environment variables
if [ -f "./deploy.aws.env" ]; then
    echo "Sourcing environment variables from deploy.aws.env..."
    source ./deploy.aws.env
    if [ $? -ne 0 ]; then
        echo "Failed to source environment variables."
        exit 1
    fi
else
    echo "Error: deploy.aws.env file does not exist."
    exit 1
fi

# Deploy using Docker
echo "Deploying Docker stack..."
docker stack deploy --with-registry-auth -c ./docker-compose.stage.yml $STACK
if [ $? -ne 0 ]; then
    echo "Failed to deploy stack."
    exit 1
fi

sleep 3

# Clean up Docker system
echo "Cleaning up Docker system..."
docker system prune -af
if [ $? -ne 0 ]; then
    echo "Failed to prune Docker system."
    exit 1
fi

echo "Deployment completed successfully. Done."
