# ── Étape 1 : Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Installer toutes les dépendances
RUN npm install

# Copier le code source
COPY src/ ./src/

# Compiler TypeScript → JavaScript
RUN npm run build

# ── Étape 2 : Production ─────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copier uniquement les dépendances de production
COPY package*.json ./
RUN npm install --only=production

# Copier le code compilé depuis l'étape build
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["node", "dist/main"]
