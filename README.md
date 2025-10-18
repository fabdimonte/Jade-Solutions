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

➡️ **Le backend est maintenant accessible sur** `http://127.0.0.1:8000/`
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

## ✅ Résumé

Vous devez avoir **DEUX terminaux** ouverts pour que tout fonctionne :
* **Terminal 1 :** `python manage.py runserver` (pour l'API)
* **Terminal 2 :** `npm run dev` (pour l'interface)