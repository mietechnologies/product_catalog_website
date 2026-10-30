# ── Stage 1: Install dependencies ─────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build the application ───────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Feature flags are inlined at build time (NEXT_PUBLIC_*), so pass them as
# build args, e.g. `docker build --build-arg NEXT_PUBLIC_FEATURE_RETAIL=true .`
ARG NEXT_PUBLIC_FEATURE_RETAIL=false
ENV NEXT_PUBLIC_FEATURE_RETAIL=$NEXT_PUBLIC_FEATURE_RETAIL

# The shared MieTech backend and main site. Also inlined at build time, e.g.
# `--build-arg NEXT_PUBLIC_API_URL=https://api.mietechnologies.com`.
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAIN_SITE_URL=https://mietechnologies.com
ENV NEXT_PUBLIC_MAIN_SITE_URL=$NEXT_PUBLIC_MAIN_SITE_URL

RUN npm run build

# ── Stage 3: Production image ────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
