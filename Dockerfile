# -----------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# -----------------------------
# Build Arguments
# -----------------------------
# Production এ Ingress এর মাধ্যমে Backend এ যাবে
ARG VITE_API_URL=/api
ARG VITE_APP_NAME="User Management System"
ARG VITE_APP_VERSION=1.0.0

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}

# Copy source code
COPY . .

# Build Vite application
RUN npm run build

# -----------------------------------------------
# Stage 2: Production (Nginx)
# -----------------------------------------------
FROM nginx:1.27-alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# SPA support (React Router)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
