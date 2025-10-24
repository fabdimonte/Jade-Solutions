// src/pages/SocieteListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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

// 1. Importer la fonction apiClient pour les GET
import { fetchGetData } from '../apiClient';

// 2. Recevoir authToken en prop depuis App.jsx
function SocieteListPage({ authToken }) {
  // États locaux pour la liste des sociétés et l'indicateur de chargement
  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // État pour afficher les erreurs

  // Effet pour charger les données au montage du composant ou si authToken change
  useEffect(() => {
    setLoading(true); // Active le chargement
    setError('');     // Réinitialise les erreurs

    // 3. Utiliser fetchGetData pour récupérer la liste des sociétés
    fetchGetData('/societes/', authToken)
      .then(data => {
        setSocietes(data); // Met à jour l'état avec les données reçues
      })
      .catch(error => {
        // Gère les erreurs (réseau ou API)
        console.error('Erreur lors de la récupération des sociétés:', error);
        setError(`Impossible de charger les sociétés: ${error.message}`); // Affiche un message d'erreur
      })
      .finally(() => {
        setLoading(false); // Désactive le chargement, que la requête réussisse ou échoue
      });
  // 4. L'effet dépend de authToken (si le token change, on recharge)
  }, [authToken]);

  // --- Affichage ---
  if (loading && societes.length === 0) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}> <CircularProgress size={24} sx={{mr: 1}}/> Chargement... </Box> );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>;
  }

  // Rendu du composant : bouton d'ajout et liste des sociétés
  return (
    // Box remplace la div principale, mt = marginTop
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}> {/* mb = marginBottom */}
        {/* Typography pour le titre */}
        <Typography variant="h4" component="h1">
          Liste des Sociétés
        </Typography>
        {/* Button MUI avec une icône */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink} // Utilise react-router-dom pour la navigation
          to="/societes/nouveau"
        >
          Ajouter une société
        </Button>
      </Box>

      {societes.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          Aucune société trouvée. Cliquez sur "+ Ajouter une société" pour commencer.
        </Typography>
      ) : (
        // List MUI remplace ul
        <List>
          {societes.map(societe => (
            // ListItem MUI remplace li, avec des styles et un comportement de bouton
            <ListItem
              key={societe.id}
              // Utilise le composant Link de MUI qui sait utiliser react-router-dom
              component={RouterLink}
              to={`/societes/${societe.id}`}
              sx={{
                border: '1px solid',
                borderColor: 'divider', // Couleur du thème pour les séparateurs
                borderRadius: 1,
                mb: 1.5, // Marge en bas
                backgroundColor: 'background.paper', // Couleur de fond du thème
                '&:hover': { // Style au survol
                  backgroundColor: 'action.hover',
                  borderColor: 'grey.400'
                },
                textDecoration: 'none', // Enlève le soulignement du lien
                color: 'inherit' // Garde la couleur du texte par défaut
              }}
              // button // Ajoute l'effet visuel de clic (optionnel)
            >
              {/* ListItemText pour organiser le contenu principal et secondaire */}
              <ListItemText
                primary={
                  <Typography variant="h6">{societe.nom}</Typography>
                }
                secondary={
                  `SIREN: ${societe.siren} | Secteur: ${societe.secteur || 'N/A'}`
                }
              />
              {/* On pourrait ajouter une icône ou un bouton ici si besoin */}
              {/* <ChevronRightIcon /> */}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default SocieteListPage;