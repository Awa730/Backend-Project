# TODO - Problème Token JWT (401 sur /auth/admin)

## Objectif
Trouver pourquoi le token généré par `POST /auth/login` ne passe pas la garde `JwtAuthGuard` (ou la garde de rôles) sur `GET /auth/admin`.

## Constat actuel
- `GET /auth/profil` avec le token retourne **200** ✅
- Donc le **token JWT est valide** (signature + expiration + secret côté JwtStrategy) et `JwtAuthGuard` passe.
- Le problème est donc très probablement **dans `RolesGuard` / le rôle contenu dans le payload** (ou le mapping de `Role`).

## Vérifications à faire
- [x] Vérifier que `GET /auth/profil` passe avec le token (sinon problème token/secret).
- [ ] Vérifier le rôle exact dans le payload du token renvoyé par `POST /auth/login` (champ `role`).
  - Le code attend : `role === 'admin'` (voir `Role.ADMIN`).
- [ ] Vérifier la valeur exacte de `Role.ADMIN` / `Role.CLIENT` dans `src/users/users.entity.ts`.

## Analyse code (déjà vérifiée)
- `Role.ADMIN = 'admin'`, `Role.CLIENT = 'client'`.
- `AuthService` signe : `jwtService.sign({ id, email, role })`.
- `RolesGuard` compare `user.role` avec le rôle requis.

## Corrections possibles
- [ ] Si `role` dans le token n’est pas `admin` (ex: `Role.ADMIN` passé en objet, ou valeur différente) : corriger la source du payload.
- [ ] Si `role` est correct côté token mais `RolesGuard` échoue : vérifier que `req.user` contient bien `role` après `JwtStrategy.validate`.

## Patch conseillé (si besoin)
- Ajouter un endpoint debug (ou un log temporaire) pour afficher `req.user` sur `/auth/admin` afin de confirmer le rôle effectif.

