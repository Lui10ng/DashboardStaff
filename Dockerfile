FROM node:18-alpine
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9

# Copy only package files first
COPY veent-payload/pnpm-lock.yaml ./
COPY veent-payload/package.json ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY veent-payload .  

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
