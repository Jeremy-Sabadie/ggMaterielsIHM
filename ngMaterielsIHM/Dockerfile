# Étape 1 : Construction de l'application Angular
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copier les fichiers nécessaires et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le projet et construire Angular en mode production
COPY . .
RUN npm run build -- --configuration=production

# Étape 2 : Serveur Nginx pour héberger l'application
FROM nginx:alpine

# Copier la configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers Angular construits dans le bon dossier
COPY --from=build-stage /app/dist/ng-materiels-ihm /usr/share/nginx/html

# Exposer le port 80 pour l'accès HTTP
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
