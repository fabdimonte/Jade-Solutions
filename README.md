# 🚀 Projet Jade Solutions (CRM M&A)

CRM en cours de développement pour les cabinets de M&A.
**Stack technique :** Django (Backend) & React (Frontend).

---

## 🏁 Démarrage de l'Environnement de Développement

Pour travailler sur le projet, vous devez lancer **deux serveurs** simultanément, chacun dans son propre terminal.

### 1. Démarrer le Backend (Django / API)

Le backend gère la base de données et l'API.

1.  Ouvrir un premier terminal à la racine du projet (`Jade Solutions`).
2.  Activer l'environnement virtuel Python :
    ```bash
    .\venv\Scripts\activate
    ```
    *(Vous devez voir `(venv)` s'afficher dans votre terminal.)*

3.  Lancer le serveur Django :
    ```bash
    python manage.py runserver
    ```

➡️ **Le backend est maintenant accessible sur** `http://127.0.0.1:8000/` (et l'admin sur `http://127.0.0.1:8000/admin/`)
*(Laissez ce terminal ouvert.)*

---

### 2. Démarrer le Frontend (React / Vite)

Le frontend gère l'interface utilisateur que vous voyez dans le navigateur.

1.  Ouvrir un **deuxième** terminal.
2.  Naviguer dans le dossier `frontend` :
    ```bash
    cd frontend
    ```

3.  Lancer le serveur de développement Vite :
    ```bash
    npm run dev
    ```

➡️ **Le frontend est maintenant accessible sur** `http://localhost:5173/` (ou un port similaire).
*(Laissez également ce terminal ouvert.)*

---

## ✅ Résumé des Serveurs

Vous devez avoir **DEUX terminaux** ouverts pour que tout fonctionne :
* **Terminal 1 :** `python manage.py runserver` (pour l'API)
* **Terminal 2 :** `npm run dev` (pour l'interface)

---

## 🏗️ Mise à Jour de la Base de Données (Migrations)

Lorsque vous **modifiez les modèles** dans `api/models.py` (ajout/modification/suppression de champs), vous devez synchroniser ces changements avec la base de données PostgreSQL.

**Important : Arrêtez le serveur Django (`Ctrl+C`) avant de lancer ces commandes.**

1.  **Préparer les fichiers de migration :**
    Django analyse vos changements et crée un fichier d'instructions.
    ```bash
    python manage.py makemigrations
    ```

2.  **Appliquer les changements à la base de données :**
    Django exécute les instructions sur la base PostgreSQL.
    ```bash
    python manage.py migrate
    ```

Une fois terminé, vous pouvez relancer le serveur (`python manage.py runserver`).