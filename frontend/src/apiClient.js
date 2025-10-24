// src/apiClient.js

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Base de votre API Django

// Fonction pour faire des requêtes GET authentifiées
export const fetchGetData = async (endpoint, authToken) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${authToken}`, // <-- ENVOYER LE TOKEN ICI
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    if (response.status === 401) { // Non autorisé (token invalide ?)
       // On pourrait déconnecter l'utilisateur ici
       localStorage.removeItem('authToken');
       window.location.href = '/login'; // Rediriger vers login
    }
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

// Fonction pour faire des requêtes POST/PUT/DELETE authentifiées
export const fetchMutateData = async (method, endpoint, body, authToken) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: method, // 'POST', 'PUT', 'DELETE'
    headers: {
      'Authorization': `Token ${authToken}`, // <-- ENVOYER LE TOKEN ICI
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // Gestion basique des erreurs (peut être améliorée)
  if (!response.ok) {
     if (response.status === 401) {
       localStorage.removeItem('authToken');
       window.location.href = '/login';
     }
     // Essayer de lire les erreurs JSON du backend pour POST/PUT
     if (method === 'POST' || method === 'PUT') {
        const errors = await response.json();
        console.error("Backend Validation Error:", errors);
        throw { status: response.status, errors }; // Lancer une erreur avec détails
     } else {
        throw new Error(`API Error: ${response.status}`);
     }
  }

  // DELETE renvoie souvent 204 No Content (pas de JSON)
  if (response.status === 204) {
      return null;
  }
  return response.json();
};