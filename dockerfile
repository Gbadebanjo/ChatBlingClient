# Use a specific version of node
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Install serve
RUN yarn global add serve

# Expose the port the app runs on
EXPOSE 5173

# Start the application with serve
CMD ["serve", "-s", "dist", "-l", "5173"]

# Docker will build app with yarn build and start it with serve
# -s implies serve as a single page application && -l specifies the port 