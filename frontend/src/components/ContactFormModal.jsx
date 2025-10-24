// src/components/ContactFormModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchGetData, fetchMutateData } from '../apiClient';

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

// Styles
const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '500px', maxWidth: '90%', position: 'relative', color: 'black' },
  closeButton: { position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1.8rem', color: '#666' }
};

function ContactFormModal({ isOpen, onClose, societeId, onSaveSuccess, contactToEdit, authToken }) {

  const [allGroupes, setAllGroupes] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '', nom: '', email: '', telephone_portable: '', fonction: '',
    groupes_ids: [],
  });
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Charger les groupes disponibles
  useEffect(() => {
    if (isOpen) {
      setLoadingGroups(true);
      setError('');
      fetchGetData('/groupes/', authToken)
        .then(data => setAllGroupes(data))
        .catch(err => {
            console.error("Erreur chargement groupes:", err);
            setError("Impossible de charger la liste des groupes.");
        })
        .finally(() => setLoadingGroups(false));
    }
  }, [isOpen, authToken]);

  // Pré-remplir le formulaire si contactToEdit est fourni
  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        prenom: contactToEdit.prenom || '',
        nom: contactToEdit.nom || '',
        email: contactToEdit.email || '',
        telephone_portable: contactToEdit.telephone_portable || '',
        fonction: contactToEdit.fonction || '',
        groupes_ids: contactToEdit.groupes ? contactToEdit.groupes.map(g => g.id) : [],
      });
    } else {
      setFormData({
        prenom: '', nom: '', email: '', telephone_portable: '', fonction: '',
        groupes_ids: [],
      });
    }
  }, [contactToEdit, isOpen]);

  // --- Fonctions définies UNE SEULE FOIS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (groupeId) => {
    setFormData(prevData => {
      const currentGroupes = prevData.groupes_ids;
      if (currentGroupes.includes(groupeId)) {
        return { ...prevData, groupes_ids: currentGroupes.filter(id => id !== groupeId) };
      } else {
        return { ...prevData, groupes_ids: [...currentGroupes, groupeId] };
      }
    });
  };
  // --- Fin des définitions ---

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    const isEditing = contactToEdit && contactToEdit.id;
    const dataToSend = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email || null,
      telephone_portable: formData.telephone_portable || null,
      fonction: formData.fonction || null,
      societe: societeId,
      groupes_ids: formData.groupes_ids,
    };
    const url = isEditing ? `/contacts/${contactToEdit.id}/` : '/contacts/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await fetchMutateData(method, url, dataToSend, authToken);
      onSaveSuccess();
    } catch (err) {
      console.error("Erreur sauvegarde contact:", err);
      let errorMessage = "Une erreur est survenue.";
      if (err.errors) {
         errorMessage = `Erreur(s):\n${JSON.stringify(err.errors)}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  // Rendu de la modale (JSX reste identique)
  return (
    <Dialog
      open={isOpen} // Contrôle l'ouverture
      onClose={onClose} // Fonction appelée à la fermeture (clic extérieur, Echap)
      maxWidth="sm" // Largeur standard
      fullWidth     // Prend toute la largeur disponible (dans la limite de maxWidth)
      disableEscapeKeyDown={loadingSubmit} // Empêche Echap pendant la sauvegarde
      // Gère la fermeture au clic extérieur, sauf si loadingSubmit est vrai
      // onClose={(event, reason) => { if (reason !== 'backdropClick' || !loadingSubmit) { onClose(); } }}
    >
      {/* Utiliser Box pour pouvoir mettre le form à l'intérieur du Dialog */}
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}> {/* pb = padding bottom */}
          {contactToEdit ? 'Modifier le contact' : 'Ajouter un nouveau contact'}
          {/* Bouton de fermeture optionnel dans le titre */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={loadingSubmit}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Affichage d'erreur globale */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Utiliser Grid pour mettre en page les champs */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required fullWidth disabled={loadingSubmit}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nom" name="nom" value={formData.nom} onChange={handleChange} required fullWidth disabled={loadingSubmit}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} fullWidth disabled={loadingSubmit}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Téléphone Portable" name="telephone_portable" value={formData.telephone_portable || ''} onChange={handleChange} fullWidth disabled={loadingSubmit}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Fonction" name="fonction" value={formData.fonction || ''} onChange={handleChange} fullWidth disabled={loadingSubmit}/>
            </Grid>
          </Grid>

          {/* Section Groupes */}
          <Box sx={{ mt: 3, borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <FormLabel component="legend">Groupes</FormLabel>
            <Box sx={{ maxHeight: 150, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mt: 1 }}>
              {loadingGroups ? <CircularProgress size={20} /> :
               allGroupes.length > 0 ? (
                <FormGroup>
                  {allGroupes.map(groupe => (
                    <FormControlLabel
                      key={groupe.id}
                      control={
                        <Checkbox
                          checked={formData.groupes_ids.includes(groupe.id)}
                          onChange={() => handleCheckboxChange(groupe.id)}
                          disabled={loadingSubmit}
                          size="small"
                        />
                      }
                      label={groupe.nom}
                    />
                  ))}
                </FormGroup>
              ) : (
                <Typography variant="body2" color="text.secondary">Aucun groupe disponible.</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loadingSubmit} color="inherit">
            Annuler
          </Button>
          <Button
            type="submit" // Le Box parent est le form
            variant="contained"
            color="primary"
            disabled={loadingSubmit || loadingGroups} // Désactiver si chargement des groupes ou soumission
            startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loadingSubmit ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Box> {/* Fin du Box form */}
    </Dialog>
  );
}

export default ContactFormModal;