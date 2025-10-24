// src/pages/GroupeListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// --- Imports MUI ---
import { Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField,  Button,  Select,  MenuItem,  FormControl,  InputLabel,
  Grid,  Box,  CircularProgress,  Alert,  IconButton, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,  Paper, Link,
  Container, Chip, Divider, AppBar, Toolbar, Tabs, Tab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
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


// 1. Importer les DEUX fonctions d'apiClient
import { fetchGetData, fetchMutateData } from '../apiClient';

function GroupeListPage({ authToken }) { // On reçoit bien authToken
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: null, nom: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // Fonction pour charger les groupes (corrigée)
  const fetchGroupes = useCallback(() => {
    setLoading(true);
    // 2. Utiliser fetchGetData avec authToken
    fetchGetData('/groupes/', authToken)
      .then(data => {
        setGroupes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur chargement groupes:", error);
        setLoading(false);
        // On pourrait afficher un message d'erreur ici
      });
  }, [authToken]); // Dépend de authToken

  // Charger les groupes au démarrage
  useEffect(() => {
    fetchGroupes();
  }, [fetchGroupes]); // fetchGroupes inclut déjà authToken dans ses dépendances

  // Gérer la soumission du formulaire (corrigée)
  const handleSubmit = async (e) => { // Ajouter async pour await
    e.preventDefault();

    const isEditing = formData.id !== null;
    const url = isEditing ? `/groupes/${formData.id}/` : '/groupes/';
    const method = isEditing ? 'PUT' : 'POST';
    const body = { nom: formData.nom, description: formData.description };

    try {
      // 3. Utiliser fetchMutateData
      await fetchMutateData(method, url, body, authToken);
      fetchGroupes(); // Rafraîchir
      setFormData({ id: null, nom: '', description: '' }); // Vider
    } catch (error) {
      console.error("Erreur sauvegarde groupe:", error);
      // Afficher les erreurs de validation si elles existent
      if (error.errors) {
         alert(`Erreur de sauvegarde :\n${JSON.stringify(error.errors)}`);
      } else {
         alert("Une erreur est survenue lors de la sauvegarde.");
      }
    }
  };

  // Gérer la suppression (corrigée)
  const handleDelete = async (groupeId) => { // Ajouter async pour await
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      try {
        // 4. Utiliser fetchMutateData pour DELETE (pas de body)
        await fetchMutateData('DELETE', `/groupes/${groupeId}/`, null, authToken);
        fetchGroupes(); // Rafraîchir
      } catch (error) {
        console.error("Erreur suppression groupe:", error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  // Pré-remplir le formulaire pour l'édition (inchangé)
  const handleEditClick = (groupe) => {
    setFormData({ id: groupe.id, nom: groupe.nom, description: groupe.description || '' });
  };

  // Vider le formulaire (inchangé)
  const cancelEdit = () => {
    setFormData({ id: null, nom: '', description: '' });
  };

  // --- Affichage ---
  if (loading) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}> <CircularProgress /> <Typography sx={{ml:2}}>Chargement...</Typography> </Box> );
  }

  // Erreur de chargement principale
  if (error && groupes.length === 0) {
      return <Container><Alert severity="error" sx={{mt: 2}}>{error}</Alert></Container>;
  }

  {/* Affichage d'erreur de soumission/suppression */}
  {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

  // --- Le JSX reste identique ---
  // --- Rendu avec MUI ---
  return (
    // Container pour centrer et limiter la largeur
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2, textDecoration: 'none' }}>
        <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small"/> Retour
      </Link>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gestion des Groupes
      </Typography>

      {/* Affichage d'erreur de soumission/suppression */}
       {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}


      {/* --- Formulaire d'ajout / modification --- */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {formData.id ? 'Modifier le groupe' : 'Ajouter un nouveau groupe'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Grid container (parent reste inchangé) */}
          <Grid container spacing={2} alignItems="flex-start">
            {/* Grid enfants corrigés (sans 'item', avec 'size') */}
            <Grid size={{ xs: 12, sm: 5 }}> {/* <--- CORRIGÉ */}
              <TextField
                label="Nom du groupe"
                name="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
                fullWidth
                size="small"
                disabled={submitLoading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}> {/* <--- CORRIGÉ */}
              <TextField
                label="Description (optionnel)"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                size="small"
                disabled={submitLoading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}> {/* <--- CORRIGÉ */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : (formData.id ? <SaveIcon /> : <AddIcon />)}
                disabled={submitLoading || !formData.nom.trim()}
              >
                 {/* Texte caché */}
              </Button>
              {formData.id && (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={cancelEdit}
                  disabled={submitLoading}
                  startIcon={<CancelIcon />}
                  color="inherit"
                >
                   {/* Texte caché */}
                </Button>
              )}
            </Grid>
          </Grid> {/* Fin Grid container */}
        </Box> {/* Fin Box form */}
      </Paper> {/* Fin Paper formulaire */}

      {/* --- Liste des groupes --- */}
      {/* (Le reste du code pour la liste n'utilise pas Grid, donc inchangé) */}
      <Typography variant="h6" gutterBottom>Groupes existants ({groupes.length})</Typography>
      {groupes.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          Aucun groupe créé.
        </Typography>
      ) : (
        <List>
          {groupes.map(groupe => (
            <ListItem
              key={groupe.id}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1, bgcolor: 'background.paper' }}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="modifier" onClick={() => handleEditClick(groupe)} sx={{ mr: 0.5 }} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="supprimer" onClick={() => handleDelete(groupe.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              disablePadding
            >
              <ListItemText
                primary={groupe.nom}
                secondary={groupe.description || 'Pas de description'}
                sx={{ pl: 2, pr: 12 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container> // Fin Container principal
  );
}

export default GroupeListPage;