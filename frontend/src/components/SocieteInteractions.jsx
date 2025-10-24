// src/components/SocieteInteractions.jsx
import React, { useState, useEffect, useCallback } from 'react';
// 1. Importer fetchGetData
import { fetchGetData } from '../apiClient';
// InteractionFormModal n'est plus importé ici

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


// Fonction utilitaire pour formater la date (inchangée)
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  } catch (e) {
    console.error("Erreur formatage date:", dateString, e);
    return dateString; // Retourne la chaîne brute si erreur
  }
};

// Fonction pour obtenir le label lisible du type d'interaction
// (Idéalement, l'API devrait renvoyer cela, mais on le fait ici pour l'instant)
const getTypeInteractionLabel = (typeCode) => {
  const types = {
    APPEL: 'Appel téléphonique',
    EMAIL: 'Email',
    RDV: 'Rendez-vous',
    AUTRE: 'Autre',
  };
  return types[typeCode] || typeCode;
};

// 2. Accepter authToken en prop
function SocieteInteractions({ societeId, listVersion, onAddInteractionClick, authToken }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Pour les erreurs

  // Fonction pour charger les interactions (corrigée)
  const fetchInteractions = useCallback(async () => { // Ajouter async
    setLoading(true);
    setError('');
    try {
      // 3. Utiliser fetchGetData avec authToken et le filtre societe_id
      const data = await fetchGetData(`/interactions/?societe_id=${societeId}`, authToken);
      setInteractions(data);
    } catch (error) {
      console.error("Erreur fetch interactions:", error);
      setError(`Impossible de charger l'historique: ${error.message}`);
    } finally {
      setLoading(false);
    }
  // 4. Dépendre de societeId et authToken
  }, [societeId, authToken]);

  // Charger les interactions au montage et si listVersion ou fetchInteractions change
  useEffect(() => {
    fetchInteractions();
  // 5. Inclure listVersion dans les dépendances
  }, [fetchInteractions, listVersion]);

  // --- Affichage ---
  if (loading && interactions.length === 0) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}> <CircularProgress size={24} sx={{mr: 1}}/> Chargement... </Box> );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>;
  }

  return (
    <Box>
      {/* Bouton Ajouter */}
      <Box sx={{ mb: 2, textAlign: 'right' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddInteractionClick}
          size="small"
        >
          Ajouter une interaction
        </Button>
      </Box>

      {/* Titre (optionnel) */}
      {/* <Typography variant="h6" gutterBottom>Historique ({interactions.length})</Typography> */}

      {interactions.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 3 }}>
          Aucune interaction enregistrée.
        </Typography>
      ) : (
        // Liste MUI (ou simplement mapper des Paper)
        <Box> {/* Remplacer List par Box pour plus de flexibilité de style */}
          {interactions.map(interaction => (
            // Utiliser Paper pour l'effet "carte"
            <Paper
              key={interaction.id}
              elevation={1} // Légère ombre
              sx={{ p: 2, mb: 2 }} // Padding et marge
            >
              {/* En-tête : Type et Date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {getTypeInteractionLabel(interaction.type_interaction)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption">{formatDate(interaction.date_interaction)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 1.5 }}/> {/* Séparateur */}

              {/* Contact et Utilisateur */}
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1.5 }}>
                 <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                 <Typography variant="caption">
                   Contact : <strong>{interaction.contact_nom || 'N/A'}</strong>
                   {interaction.utilisateur_nom && ` | Par: ${interaction.utilisateur_nom}`}
                 </Typography>
              </Box>

              {/* Notes */}
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {interaction.notes}
              </Typography>

              {/* Zone pour futurs boutons Modifier/Supprimer */}
              {/* <Box sx={{ textAlign: 'right', mt: 1 }}>...</Box> */}

            </Paper>
          ))}
        </Box>
      )}
      {/* La modale InteractionFormModal est appelée par le parent SocieteDetailPage */}
    </Box>
  );
}

export default SocieteInteractions;