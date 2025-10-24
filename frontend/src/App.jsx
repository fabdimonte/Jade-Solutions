// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

// Importer toutes les pages
import SocieteListPage from './pages/SocieteListPage';
import SocieteCreatePage from './pages/SocieteCreatePage';
import SocieteDetailPage from './pages/SocieteDetailPage';
import MandatDetailPage from './pages/MandatDetailPage';
import GroupeListPage from './pages/GroupeListPage';
import MandatPipelinePage from './pages/MandatPipelinePage';
import LoginPage from './pages/LoginPage'; // <--- Importer LoginPage

function App() {
  // 1. État pour stocker le token d'authentification
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Essayer de charger depuis le localStorage

  // Effet pour sauvegarder le token dans localStorage quand il change
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  // 2. Fonction appelée par LoginPage après une connexion réussie
  const handleLoginSuccess = (token) => {
    setAuthToken(token);
  };

  // 3. Fonction pour la déconnexion
  const handleLogout = () => {
    setAuthToken(null);
    // On pourrait aussi appeler l'API /auth/logout/ ici pour invalider le token côté serveur
  };

  // 4. Composant "gardien" pour protéger les routes
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      // Si pas connecté, rediriger vers la page de login
      return <Navigate to="/login" replace />;
    }
    // Sinon, afficher la page demandée
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        {authToken && ( // Afficher l'en-tête seulement si connecté
          <header className="App-header">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <h1>Mon CRM M&A</h1>
              <nav>
                <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Sociétés</Link>
                <Link to="/groupes" style={{ color: 'white', marginRight: '20px' }}>Groupes</Link>
                <Link to="/pipeline" style={{ color: 'white', marginRight: '20px' }}>Pipeline</Link>
                {/* 5. Bouton de déconnexion */}
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1em' }}>
                  Déconnexion
                </button>
              </nav>
            </div>
          </header>
        )}
        <main>
          <Routes>
            {/* 6. Route pour la page de connexion */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

            {/* 7. Protéger toutes les autres routes */}
            <Route path="/" element={<ProtectedRoute><SocieteListPage authToken={authToken} /></ProtectedRoute>} />
            <Route path="/societes/nouveau" element={<ProtectedRoute><SocieteCreatePage authToken={authToken} /></ProtectedRoute>} />
            <Route path="/societes/:id" element={<ProtectedRoute><SocieteDetailPage authToken={authToken} /></ProtectedRoute>} />
            <Route path="/mandats/:id" element={<ProtectedRoute><MandatDetailPage authToken={authToken} /></ProtectedRoute>} />
            <Route path="/groupes" element={<ProtectedRoute><GroupeListPage authToken={authToken} /></ProtectedRoute>} />
            <Route path="/pipeline" element={<ProtectedRoute><MandatPipelinePage authToken={authToken} /></ProtectedRoute>} />

            {/* Redirection par défaut si l'URL est inconnue */}
            <Route path="*" element={<Navigate to={authToken ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;