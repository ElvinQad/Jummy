FROM node:20-alpine

WORKDIR /usr/src/app

# Add npm configurations to handle network issues
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm config set fetch-retries 5 \
    && npm install -g npm@latest

# Copy package files
COPY package*.json ./

# Install dependencies with additional flags for better reliability
RUN npm ci --no-audit --no-fund

# Install Prisma CLI globally
RUN npm install -g prisma

COPY . .

EXPOSE 3000 5555

CMD ["npm", "run", "start:dev"]
