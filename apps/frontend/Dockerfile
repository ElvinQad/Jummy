FROM node:20-alpine

WORKDIR /app

# Add npm configurations to handle network issues
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 100000 \
    && npm config set fetch-retries 5 \
    && npm install -g npm@latest

COPY package*.json ./

# Install dependencies with additional flags for better reliability
RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]