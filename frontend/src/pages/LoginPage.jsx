// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Imports MUI ---
import { Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField,  Button,  Select,  MenuItem,  FormControl,  InputLabel,
  Grid,  Box,  CircularProgress,  Alert,  IconButton, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,  Paper, Link,
  Container, Chip, Divider, AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

// Le composant reçoit la fonction onLoginSuccess en prop depuis App.jsx
function LoginPage({ onLoginSuccess }) {
  // États locaux pour les champs du formulaire et les messages d'erreur
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // État pour indiquer le chargement
  const navigate = useNavigate(); // Hook pour la redirection après succès

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError('');       // Réinitialise les erreurs précédentes
    setLoading(true);   // Active l'indicateur de chargement

    try {
      // Appel direct à l'API de connexion (pas besoin de apiClient ici car on n'a pas encore de token)
      const response = await fetch('http://127.0.0.1:8000/auth/login/', { // URL de dj-rest-auth
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indique qu'on envoie du JSON
        },
        // Corps de la requête avec les identifiants
        body: JSON.stringify({ username, password }),
      });

      // Vérifie si la réponse du serveur est OK (status 2xx)
      if (response.ok) {
        const data = await response.json(); // Extrait les données JSON (qui contiennent le token)
        console.log("Connexion réussie, token:", data.key);
        onLoginSuccess(data.key); // Appelle la fonction du parent (App.jsx) avec le token reçu
        navigate('/');            // Redirige l'utilisateur vers la page d'accueil ('/')
      } else {
        // Si la réponse n'est pas OK (ex: 400 Bad Request pour mauvais identifiants)
        let errorMessage = 'Échec de la connexion.'; // Message par défaut
        try {
          // Essaye de lire le message d'erreur spécifique renvoyé par Django/dj-rest-auth
          const errorData = await response.json();
          // Le message est souvent dans 'non_field_errors' pour les erreurs globales de login
          if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
            errorMessage = errorData.non_field_errors[0];
          } else if (errorData.detail) {
             errorMessage = errorData.detail; // Parfois l'erreur est dans 'detail'
          } else {
             // Si le format est inconnu, on affiche le JSON brut (pour le debug)
             errorMessage = `Erreur ${response.status}: ${JSON.stringify(errorData)}`;
          }
        } catch (jsonError) {
          // Si la réponse d'erreur n'est pas du JSON valide
          errorMessage = `Erreur ${response.status}: Impossible de lire la réponse du serveur.`;
        }
        setError(errorMessage); // Met à jour l'état d'erreur pour l'afficher à l'utilisateur
        console.error("Erreur de connexion:", errorMessage);
      }
    } catch (err) {
      // Gère les erreurs réseau (ex: serveur Django éteint)
      setError('Une erreur réseau est survenue. Vérifiez votre connexion ou contactez l\'administrateur.');
      console.error("Erreur fetch login:", err);
    } finally {
      // Quoi qu'il arrive (succès ou échec), on désactive l'indicateur de chargement
      setLoading(false);
    }
  };

  // Rendu du composant (le formulaire JSX)
  return (
    // Box est un conteneur flexible (comme une div)
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto', // Centre horizontalement (margin left/right auto)
        mt: 8,      // Marge en haut (1 unité = 8px par défaut)
        p: 3,       // Padding intérieur
        border: '1px solid',
        borderColor: 'grey.300', // Couleur du thème
        borderRadius: 2,         // Arrondi
        boxShadow: 3,            // Ombre légère
        textAlign: 'center',
      }}
      component="form" // Se comporte comme une balise form
      onSubmit={handleSubmit}
    >
      {/* Typography pour le texte */}
      <Typography variant="h5" component="h1" gutterBottom>
        Connexion
      </Typography>

      {/* TextField remplace input */}
      <TextField
        label="Nom d'utilisateur ou Email"
        variant="outlined" // Style de bordure
        margin="normal" // Espacement standard
        required
        fullWidth // Prend toute la largeur
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <TextField
        label="Mot de passe"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      {/* Alert pour afficher les erreurs */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
          {error}
        </Alert>
      )}

      {/* Button remplace button */}
      <Button
        type="submit"
        variant="contained" // Style plein
        color="primary" // Couleur principale du thème
        fullWidth
        disabled={loading}
        sx={{ mt: 3, mb: 2, py: 1.5 }} // Marges et padding verticaux
      >
        {/* Afficher un spinner pendant le chargement */}
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
      </Button>
    </Box>
  );
}

export default LoginPage;