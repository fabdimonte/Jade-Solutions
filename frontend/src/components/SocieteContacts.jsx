// src/components/SocieteContacts.jsx
import React, { useState, useEffect, useCallback } from 'react';
// 1. Importer fetchGetData (on n'a besoin que de lire ici)
import { fetchGetData } from '../apiClient';

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

// On n'importe plus ContactFormModal ici, car il est géré par le parent

// 2. Accepter authToken en prop
function SocieteContacts({ societeId, listVersion, onAddContactClick, onEditContactClick, onDeleteContactClick, authToken }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Fonction pour charger les contacts (corrigée)
  const fetchContacts = useCallback(async () => { // Ajouter async
    setLoading(true);
    setError('');
    try {
      // 3. Utiliser fetchGetData avec authToken
      const data = await fetchGetData(`/contacts/?societe_id=${societeId}`, authToken);
      setContacts(data);
    } catch (error) {
      console.error("Erreur fetch contacts:", error);
      setError(`Impossible de charger les contacts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  // 4. Dépendre de societeId et authToken
  }, [societeId, authToken]);

  // Charger les contacts au montage et si listVersion ou fetchContacts change
  useEffect(() => {
    fetchContacts();
  // 5. Inclure listVersion dans les dépendances
  }, [fetchContacts, listVersion]);

  // Style pour les badges de groupe (inchangé)
  const badgeStyle = {
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '0.8em',
    marginRight: '5px',
    display: 'inline-block', // Assure un bon affichage
    marginTop: '3px',
  };

  // --- Affichage ---
  if (loading && contacts.length === 0) {
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
          onClick={onAddContactClick}
          size="small" // Bouton plus petit pour les actions dans les onglets
        >
          Ajouter un contact
        </Button>
      </Box>

      {/* Titre (optionnel) */}
      {/* <Typography variant="h6" gutterBottom>Contacts liés ({contacts.length})</Typography> */}

      {contacts.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 3 }}>
          Aucun contact trouvé pour cette société.
        </Typography>
      ) : (
        // Liste MUI
        <List disablePadding> {/* disablePadding pour coller aux bords si besoin */}
          {contacts.map(contact => (
            <ListItem
              key={contact.id}
              // secondaryAction pour les boutons Modifier/Supprimer
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="modifier" onClick={() => onEditContactClick(contact)} size="small" sx={{ mr: 0.5 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="supprimer" onClick={() => onDeleteContactClick(contact.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
              sx={{
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: 1, mb: 1.5, bgcolor: 'background.paper',
                  // Empêche les boutons de déborder sur le texte principal
                  pr: 10 // padding right pour laisser place aux IconButton (ajuster si besoin)
              }}
              // divider // Ajoute une ligne de séparation (alternative à la bordure)
            >
              {/* Contenu principal */}
              <ListItemText
                primary={`${contact.prenom || ''} ${contact.nom || ''}`}
                secondary={
                  // Utiliser React.Fragment pour grouper plusieurs lignes secondaires
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                       {contact.fonction || 'Fonction non spécifiée'}
                    </Typography>
                    <Typography component="span" variant="caption" display="block" color="text.secondary">
                      {contact.email || 'Email non spécifié'}
                    </Typography>
                     <Typography component="span" variant="caption" display="block" color="text.secondary">
                       Tél: {contact.telephone_portable || contact.telephone_fixe || 'N/A'}
                    </Typography>
                    {/* Affichage des groupes avec Chip MUI */}
                    <Box sx={{ mt: 1 }}>
                       {contact.groupes && contact.groupes.length > 0 ? (
                         contact.groupes.map(groupe => (
                           <Chip key={groupe.id} label={groupe.nom} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                         ))
                       ) : (
                         <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Aucun groupe</Typography>
                       )}
                    </Box>
                  </>
                }
                secondaryTypographyProps={{ component: 'div' }} // Dit à MUI d'utiliser une <div> au lieu d'une <p>
              />
            </ListItem>
          ))}
        </List>
      )}
      {/* La modale ContactFormModal est appelée par le parent SocieteDetailPage */}
    </Box>
  );
}

export default SocieteContacts;