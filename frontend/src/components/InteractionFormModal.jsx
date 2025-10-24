// src/components/InteractionFormModal.jsx
import React, { useState, useEffect } from 'react';
// 1. Importer apiClient
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

// Styles (assurez-vous qu'ils sont définis ou copiés)
const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '500px', maxWidth: '90%', position: 'relative', color: 'black' },
  closeButton: { position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1.8rem', color: '#666' }
};

// 2. Recevoir authToken en prop
function InteractionFormModal({ isOpen, onClose, societeId, onSaveSuccess, authToken }) {

  // État initial du formulaire
  const initialFormData = {
    contact: '', // ID du contact sélectionné
    type_interaction: 'APPEL',
    // Mettre la date/heure actuelle au format 'YYYY-MM-DDTHH:mm'
    date_interaction: new Date().toISOString().slice(0, 16),
    notes: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  // États pour la liste des contacts et le chargement/erreur
  const [contactsSociete, setContactsSociete] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Pour le bouton submit

  // Charger les contacts de la société (corrigé)
  useEffect(() => {
    // Ne charger que si la modale s'ouvre ET qu'on a un societeId
    if (isOpen && societeId) {
      setLoadingContacts(true);
      setError(''); // Reset error on open
      // 3. Utiliser fetchGetData avec authToken
      fetchGetData(`/contacts/?societe_id=${societeId}`, authToken)
        .then(data => setContactsSociete(data))
        .catch(err => {
            console.error("Erreur chargement contacts société:", err);
            setError("Impossible de charger les contacts de la société.");
        })
        .finally(() => setLoadingContacts(false));

      // Réinitialiser le formulaire à chaque ouverture
      setFormData(initialFormData);

    } else if (!isOpen) {
       // Optionnel: Vider la liste des contacts quand la modale se ferme
       setContactsSociete([]);
    }
  // 4. Dépendre de isOpen, societeId et authToken
  }, [isOpen, societeId, authToken]);

  // Gérer les changements de champs (inchangé)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission du formulaire (corrigée)
  const handleSubmit = async (e) => { // Ajouter async
    e.preventDefault();
    setError('');
    setLoadingSubmit(true);

    // Préparer les données (le backend déduira 'societe' du 'contact')
    const dataToSend = {
        contact: formData.contact, // Doit être l'ID du contact
        type_interaction: formData.type_interaction,
        date_interaction: formData.date_interaction, // S'assurer que le format est correct (ISO est OK)
        notes: formData.notes,
        // On n'envoie PAS societeId ici, car le backend le gère via la ForeignKey 'contact'
    };

    // Vérification simple que le contact est sélectionné
    if (!dataToSend.contact) {
        setError("Veuillez sélectionner un contact.");
        setLoadingSubmit(false);
        return;
    }


    try {
      // 5. Utiliser fetchMutateData avec authToken pour POST
      await fetchMutateData('POST', '/interactions/', dataToSend, authToken);
      onSaveSuccess(); // Appelle le parent pour rafraîchir et fermer
    } catch (err) {
      console.error("Erreur sauvegarde interaction:", err);
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
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth disableEscapeKeyDown={loadingSubmit}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          Ajouter une Interaction
          <IconButton aria-label="close" onClick={onClose} disabled={loadingSubmit}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Affichage d'erreur globale */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Utiliser Grid pour les champs */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Sélecteur de Contact */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!formData.contact && error.includes("contact")} disabled={loadingSubmit || loadingContacts}>
                <InputLabel id="contact-interaction-label">Contact concerné</InputLabel>
                <Select
                  labelId="contact-interaction-label"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  label="Contact concerné" // Important
                  onChange={handleChange}
                >
                  {/* Option vide désactivée */}
                  <MenuItem value="" disabled>
                    <em>{loadingContacts ? 'Chargement...' : '-- Choisir --'}</em>
                  </MenuItem>
                  {contactsSociete.map(contact => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.prenom} {contact.nom} ({contact.fonction || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
                 {!loadingContacts && contactsSociete.length === 0 && !error && (
                    <Typography variant="caption" sx={{mt: 1, fontStyle: 'italic', color: 'text.secondary'}}>
                        Aucun contact trouvé pour cette société.
                    </Typography>
                 )}
              </FormControl>
            </Grid>

            {/* Sélecteur Type Interaction */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={loadingSubmit}>
                <InputLabel id="type-interaction-label">Type</InputLabel>
                <Select
                  labelId="type-interaction-label"
                  id="type_interaction"
                  name="type_interaction"
                  value={formData.type_interaction}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="APPEL">Appel téléphonique</MenuItem>
                  <MenuItem value="EMAIL">Email</MenuItem>
                  <MenuItem value="RDV">Rendez-vous</MenuItem>
                  <MenuItem value="AUTRE">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Champ Date et Heure */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date et Heure"
                name="date_interaction"
                type="datetime-local" // Utilise le picker natif
                value={formData.date_interaction}
                onChange={handleChange}
                required
                fullWidth
                disabled={loadingSubmit}
                InputLabelProps={{ shrink: true }} // Assure que le label ne chevauche pas la valeur
              />
            </Grid>

            {/* Champ Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                required
                multiline // Zone de texte
                rows={4}     // Hauteur
                fullWidth
                disabled={loadingSubmit}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loadingSubmit} color="inherit">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loadingSubmit || loadingContacts || contactsSociete.length === 0} // Désactiver si chargement ou pas de contact
            startIcon={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loadingSubmit ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Box> {/* Fin du Box form */}
    </Dialog>
  );
}

export default InteractionFormModal;