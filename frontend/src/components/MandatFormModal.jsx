// src/components/MandatFormModal.jsx
import React, { useState, useEffect } from 'react';
// 1. Importer fetchMutateData
import { fetchMutateData } from '../apiClient';

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

// Styles (assurez-vous qu'ils sont définis ou copiés)
const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '90%', position: 'relative', color: 'black' },
  closeButton: { position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1.8rem', color: '#666' }
};

// 2. Recevoir authToken en prop
function MandatFormModal({ isOpen, onClose, societeId, onSaveSuccess, mandatToEdit, authToken }) {

  // État initial du formulaire
  const initialFormData = {
    nom_mandat: '',
    type_mandat: 'SELL', // Valeur par défaut
    statut: 'PROSP',     // Valeur par défaut
    phase: '',
    valorisation_estimee: '',
    honoraires_estimes: '',
    client: societeId, // Pré-remplir avec l'ID de la société parente
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Pour le bouton submit

  // Gérer le pré-remplissage pour la modification
  useEffect(() => {
    if (isOpen) { // Reset/Populate only when opening
      setError(''); // Clear previous errors
      if (mandatToEdit) {
        setFormData({
          nom_mandat: mandatToEdit.nom_mandat || '',
          type_mandat: mandatToEdit.type_mandat || 'SELL',
          statut: mandatToEdit.statut || 'PROSP',
          phase: mandatToEdit.phase || '',
          // Utiliser nullish coalescing (??) pour gérer 0 vs null/undefined
          valorisation_estimee: mandatToEdit.valorisation_estimee ?? '',
          honoraires_estimes: mandatToEdit.honoraires_estimes ?? '',
          client: mandatToEdit.client || societeId, // Garder le client existant si modification
        });
      } else {
        // Reset pour la création, en s'assurant que client est bien societeId
        setFormData({...initialFormData, client: societeId });
      }
    }
  }, [mandatToEdit, isOpen, societeId]); // Ajouter societeId aux dépendances

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    }
    setFormData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  // Gérer la soumission du formulaire (corrigée)
  const handleSubmit = async (e) => { // Ajouter async
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    const isEditing = mandatToEdit && mandatToEdit.id;

    // S'assurer que les champs numériques vides sont envoyés comme null
    const dataToSend = {
        ...formData,
        valorisation_estimee: formData.valorisation_estimee === '' ? null : formData.valorisation_estimee,
        honoraires_estimes: formData.honoraires_estimes === '' ? null : formData.honoraires_estimes,
        client: formData.client // Client ID should be set
    };
    // Ne pas inclure client_nom ou les listes ManyToMany
    delete dataToSend.client_nom;
    delete dataToSend.acheteurs_potentiels;
    delete dataToSend.cedants_potentiels;


    const url = isEditing ? `/mandats/${mandatToEdit.id}/` : '/mandats/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      // 3. Utiliser fetchMutateData avec authToken
      await fetchMutateData(method, url, dataToSend, authToken);
      onSaveSuccess(); // Appelle le parent pour rafraîchir et fermer
    } catch (err) {
      console.error("Erreur sauvegarde mandat:", err);
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

  // Ne rien rendre si la modale n'est pas ouverte
  if (!isOpen) return null;

  // Rendu de la modale
  // --- Rendu avec MUI Dialog ---
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth disableEscapeKeyDown={loadingSubmit}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          {mandatToEdit ? 'Modifier le mandat' : 'Ajouter un nouveau mandat'}
          <IconButton aria-label="close" onClick={onClose} disabled={loadingSubmit}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Affichage d'erreur globale */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Grid container (parent reste inchangé) */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Grid enfants corrigés (sans 'item', avec 'size') */}
            <Grid size={12}> {/* <-- CORRIGÉ */}
              <TextField label="Nom du mandat" name="nom_mandat" value={formData.nom_mandat} onChange={handleChange} required fullWidth disabled={loadingSubmit}/>
            </Grid>

            {/* Champ Client (non modifiable, informatif) */}
            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
               <TextField label="Client (Société ID)" name="client" type="number" value={formData.client || ''} disabled fullWidth sx={{bgcolor: 'grey.100'}}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}></Grid> {/* Placeholder */} {/* <-- CORRIGÉ */}


            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
              <FormControl fullWidth required disabled={loadingSubmit}>
                <InputLabel id="type-mandat-label">Type de mandat</InputLabel>
                <Select
                  labelId="type-mandat-label"
                  id="type_mandat"
                  name="type_mandat"
                  value={formData.type_mandat}
                  label="Type de mandat"
                  onChange={handleChange}
                >
                  <MenuItem value="SELL">Sell-Side (Cession)</MenuItem>
                  <MenuItem value="BUY">Buy-Side (Acquisition)</MenuItem>
                  <MenuItem value="FUND">Levée de fonds</MenuItem>
                  <MenuItem value="AUTRE">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
              <FormControl fullWidth required disabled={loadingSubmit}>
                <InputLabel id="statut-mandat-label">Statut</InputLabel>
                <Select
                  labelId="statut-mandat-label"
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  label="Statut"
                  onChange={handleChange}
                >
                  <MenuItem value="PROSP">Prospection</MenuItem>
                  <MenuItem value="EN_COURS">En cours</MenuItem>
                  <MenuItem value="CLOSING">En closing</MenuItem>
                  <MenuItem value="TERMINE">Terminé</MenuItem>
                  <MenuItem value="ABANDONNE">Abandonné</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
               <FormControl fullWidth disabled={loadingSubmit}>
                <InputLabel id="phase-mandat-label">Phase</InputLabel>
                <Select
                  labelId="phase-mandat-label"
                  id="phase"
                  name="phase"
                  value={formData.phase || ''}
                  label="Phase"
                  onChange={handleChange}
                  // displayEmpty // displayEmpty peut causer des problèmes de label, on l'enlève
                >
                  <MenuItem value=""><em>(Aucune)</em></MenuItem>
                  <MenuItem value="PREPA">Préparation (Teaser, IM)</MenuItem>
                  <MenuItem value="MARKET">Phase de marketing</MenuItem>
                  <MenuItem value="NEGO">Négociation (LOI)</MenuItem>
                  <MenuItem value="DUE_DIL">Due Diligence</MenuItem>
                  <MenuItem value="SIGN">Signature (SPA)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}></Grid> {/* Placeholder */} {/* <-- CORRIGÉ */}


            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
              <TextField label="Valorisation estimée (€)" name="valorisation_estimee" type="number" step="0.01" value={formData.valorisation_estimee || ''} onChange={handleChange} fullWidth disabled={loadingSubmit}/>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
              <TextField label="Honoraires estimés (€)" name="honoraires_estimes" type="number" step="0.01" value={formData.honoraires_estimes || ''} onChange={handleChange} fullWidth disabled={loadingSubmit}/>
            </Grid>

          </Grid> {/* Fin Grid container */}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loadingSubmit} color="inherit">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loadingSubmit}
            startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loadingSubmit ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Box> {/* Fin du Box form */}
    </Dialog>
  );
}

export default MandatFormModal;