// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGetData } from '../apiClient';


function LoginPage({ onLoginSuccess }) { // onLoginSuccess est une fonction qu'on passera depuis App.jsx
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Connexion réussie, token:", data.key); // data.key contient le token
        onLoginSuccess(data.key); // On passe le token à App.jsx
        navigate('/'); // Rediriger vers la page d'accueil (liste des sociétés)
      } else {
        // Essayer de lire le message d'erreur du backend
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors ? errorData.non_field_errors[0] : 'Échec de la connexion.';
        setError(errorMessage);
        console.error("Erreur de connexion:", errorData);
      }
    } catch (err) {
      setError('Une erreur réseau est survenue.');
      console.error("Erreur fetch login:", err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nom d'utilisateur ou Email :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginPage;