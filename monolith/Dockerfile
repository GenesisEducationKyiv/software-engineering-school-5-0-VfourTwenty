# Use Node LTS base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY .. .

# Expose the port your app uses
EXPOSE 3000
