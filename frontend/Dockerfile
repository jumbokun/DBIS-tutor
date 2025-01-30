# frontend/Dockerfile

# --- Stage 1: build the app ---
    FROM node:16-alpine as build

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of the frontend code
    COPY . .
    
    # Build for production
    RUN npm run build
    
    # --- Stage 2: serve with Nginx ---
    FROM nginx:alpine
    
    # Copy compiled build from stage 1 to /usr/share/nginx/html
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expose port 80 inside container
    EXPOSE 80
    
    # By default, nginx runs on port 80
    CMD ["nginx", "-g", "daemon off;"]
    