FROM node:16-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json  /app/
# Copy the Node.js server file to the container
COPY app.js /app/
# Install packages
RUN npm install
# Expose ports for RTMP (1935) and HTTP (8000)
# ENV PORT
EXPOSE 1935
EXPOSE 8000
# Start server
CMD ["node", "app.js"]
