FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# npm install (not ci): lockfile on some npm 10 builds disagrees about nested ajv.
RUN npm install --no-audit --no-fund
COPY . .
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
