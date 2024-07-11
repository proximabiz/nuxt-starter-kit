# Define the Node.js version and port for the build and runtime
ARG NODE_VERSION=20.11.1
ARG PORT=3000
ARG MAINTAINER=jeetp@proximabiz.com

# Use a slim version of the Node.js image for the build stage
FROM node:${NODE_VERSION}-slim as builder

# Label the image with maintainer information
LABEL maintainer=${MAINTAINER}

# Create and set the working directory in the container
WORKDIR /app

# Install required packages for building the application
RUN apt-get update && apt-get install -y

# Copy package.json and related files to the container
COPY package*.json /app/
COPY .npmrc /app/
COPY pnpm-lock.yaml /app/

# Install pnpm globally within the container
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install --frozen-lockfile && pnpm store prune

# Copy all project files into the working directory
ADD . /app

# Build the project using pnpm
RUN pnpm build

# Start a new stage for the final runtime image to optimize size
FROM node:${NODE_VERSION}-slim

# Set the working directory in the runtime container
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/.output /app/.output

# Set environment variables and expose the application port
ENV HOST 0.0.0.0
EXPOSE ${PORT}

# Define the command to run the application
ENTRYPOINT ["node", ".output/server/index.mjs"]
