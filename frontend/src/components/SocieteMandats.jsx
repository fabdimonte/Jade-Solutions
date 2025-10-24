// src/components/SocieteMandats.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchGetData } from '../apiClient'; // Assurez-vous d'importer fetchGetData

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

// --- Définition des fonctions utilitaires UNE SEULE FOIS ---
const statuts = {
  PROSP: 'Prospection',
  EN_COURS: 'En cours',
  CLOSING: 'En closing',
  TERMINE: 'Terminé',
  ABANDONNE: 'Abandonné',
};
const getStatutLabel = (statut) => statuts[statut] || statut; // Retourne le label ou le code

const types = {
  SELL: 'Sell-Side (Cession)',
  BUY: 'Buy-Side (Acquisition)',
  FUND: 'Levée de fonds',
  AUTRE: 'Autre',
};
const getTypeLabel = (type) => types[type] || type; // Retourne le label ou le code
// --- Fin des définitions ---

// Le composant reçoit authToken et les fonctions de gestion
function SocieteMandats({ societeId, listVersion, onAddMandatClick, onEditMandatClick, onDeleteMandatClick, authToken }) {
  const [mandats, setMandats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fonction pour charger les mandats (utilise fetchGetData)
  const fetchMandats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchGetData(`/mandats/?societe_id=${societeId}`, authToken);
      setMandats(data);
    } catch (error) {
      console.error("Erreur fetch mandats:", error);
      setError(`Impossible de charger les mandats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [societeId, authToken]);

  // Charger les mandats au montage et si nécessaire
  useEffect(() => {
    fetchMandats();
  }, [fetchMandats, listVersion]);

  // --- Affichage ---
  if (loading && mandats.length === 0) {
    return ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}> <CircularProgress size={24} sx={{mr: 1}}/> Chargement... </Box> );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>;
  }

  // Rendu du composant JSX
  return (
    <Box>
      {/* Bouton Ajouter */}
      <Box sx={{ mb: 2, textAlign: 'right' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddMandatClick}
          size="small"
        >
          Ajouter un mandat
        </Button>
      </Box>

      {/* Titre (optionnel) */}
      {/* <Typography variant="h6" gutterBottom>Mandats liés ({mandats.length})</Typography> */}

      {mandats.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 3 }}>
          Aucun mandat trouvé pour cette société.
        </Typography>
      ) : (
        // Liste MUI
        <List disablePadding>
          {mandats.map(mandat => (
            <ListItem
              key={mandat.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="modifier" onClick={() => onEditMandatClick(mandat)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="supprimer" onClick={() => onDeleteMandatClick(mandat.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              sx={{
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: 1, mb: 1.5, bgcolor: 'background.paper',
                  pr: 10 // Laisser place aux boutons
              }}
            >
              {/* Contenu principal avec Link */}
              <ListItemText
                primary={
                  // Utiliser Link MUI + RouterLink pour la navigation
                  <Link component={RouterLink} to={`/mandats/${mandat.id}`} sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    {mandat.nom_mandat}
                  </Link>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">
                      Type: {getTypeLabel(mandat.type_mandat)} | Statut: {getStatutLabel(mandat.statut)}
                    </Typography>
                    <Typography component="span" variant="caption" display="block" color="text.secondary">
                      Valo: {mandat.valorisation_estimee ? `${mandat.valorisation_estimee} €` : 'N/A'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
      {/* La modale MandatFormModal est appelée par le parent SocieteDetailPage */}
    </Box>
  );
}

export default SocieteMandats;