# STAGE 1: Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Serve dengan Nginx
FROM nginx:alpine
# Ganti /app/build dengan /app/dist jika menggunakan Vite
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]