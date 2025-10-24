// src/apiClient.js

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Base de votre API Django

// Fonction pour faire des requêtes GET authentifiées
export const fetchGetData = async (endpoint, authToken) => {
  if (!authToken) {
    console.error("Auth token manquant pour fetchGetData");
    // Rediriger vers login si pas de token
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error("Authentification requise.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${authToken}`, // <-- ENVOYER LE TOKEN ICI
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) { // Non autorisé (token invalide ?)
       console.error("Token invalide ou expiré.");
       localStorage.removeItem('authToken');
       window.location.href = '/login'; // Rediriger vers login
       throw new Error("Session expirée ou invalide. Veuillez vous reconnecter.");
    }
    // Gérer d'autres erreurs serveur
    const errorBody = await response.text(); // Lire le corps pour plus de détails
    console.error(`Erreur API GET ${endpoint}: ${response.status}`, errorBody);
    throw new Error(`Erreur serveur (${response.status}) lors de la récupération des données.`);
  }

  // Gérer le cas 204 No Content (rare pour GET mais possible)
  if (response.status === 204) {
      return null;
  }

  try {
      return await response.json(); // Tenter de parser le JSON
  } catch (e) {
      console.error("Erreur parsing JSON:", e);
      throw new Error("Réponse invalide du serveur.");
  }
};

// Fonction pour faire des requêtes POST/PUT/DELETE authentifiées
export const fetchMutateData = async (method, endpoint, body, authToken) => {
  if (!authToken) {
    console.error("Auth token manquant pour fetchMutateData");
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    throw new Error("Authentification requise.");
  }

  const config = {
    method: method, // 'POST', 'PUT', 'DELETE'
    headers: {
      'Authorization': `Token ${authToken}`, // <-- ENVOYER LE TOKEN ICI
      'Content-Type': 'application/json',
    },
    // Le body n'est pas nécessaire pour DELETE
    body: body ? JSON.stringify(body) : null,
  };

  // S'assurer de ne pas envoyer de Content-Type si le body est null (pour DELETE)
  if (!body) {
    delete config.headers['Content-Type'];
  }


  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Gestion des erreurs
  if (!response.ok) {
     if (response.status === 401) {
       console.error("Token invalide ou expiré pour mutation.");
       localStorage.removeItem('authToken');
       window.location.href = '/login';
       throw new Error("Session expirée ou invalide. Veuillez vous reconnecter.");
     }

     // Essayer de lire les erreurs JSON du backend (souvent pour 400 Bad Request)
     try {
        const errors = await response.json();
        console.error(`Backend Validation/Permission Error (${response.status}):`, errors);
        // Renvoyer une erreur structurée pour l'affichage
        throw { status: response.status, errors: errors || { detail: `Erreur serveur ${response.status}` } };
     } catch (e) {
        // Si la réponse n'est pas JSON (ex: 500 Internal Server Error avec HTML)
        const errorText = await response.text();
        console.error(`Erreur API non-JSON ${method} ${endpoint}: ${response.status}`, errorText);
        throw { status: response.status, errors: { detail: `Erreur serveur ${response.status}. Réponse non JSON.` } };
     }
  }

  // DELETE renvoie souvent 204 No Content (pas de JSON)
  if (response.status === 204) {
      return null;
  }

  // Tenter de parser le JSON pour les réponses réussies (POST, PUT)
  try {
      return await response.json();
  } catch(e) {
      console.error("Erreur parsing JSON après succès:", e);
      // Retourner null ou une indication de succès sans données si attendu
      return { success: true };
  }
};