# Use Node.js version 21 (Alpine-based image)
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

RUN node --version

# Expose the application port (assuming the app listens on port 3000)
EXPOSE 3000

# Define the command to run the application in development mode
CMD ["npm", "run", "start:dev"]
