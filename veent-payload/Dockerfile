# ... same base stage as before ...

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Add this line to ensure correct PNPM version
RUN corepack enable && corepack prepare pnpm@8.15.9 --activate

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app

# Add this line here as well for safety
RUN corepack enable && corepack prepare pnpm@8.15.9 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi
