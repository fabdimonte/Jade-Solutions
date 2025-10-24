// src/pages/SocieteDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';

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

// Import des composants enfants (onglets et modales)
import SocieteInfo from '../components/SocieteInfo';
import SocieteContacts from '../components/SocieteContacts';
import SocieteMandats from '../components/SocieteMandats';
import SocieteInteractions from '../components/SocieteInteractions';
import ContactFormModal from '../components/ContactFormModal';
import MandatFormModal from '../components/MandatFormModal';
import InteractionFormModal from '../components/InteractionFormModal';

// 1. Importer les fonctions apiClient
import { fetchGetData, fetchMutateData } from '../apiClient';

// 2. Le composant reçoit authToken en prop
function SocieteDetailPage({ authToken }) {
  const { id } = useParams(); // ID de la société depuis l'URL
  const [societeData, setSocieteData] = useState(null); // Renommé pour plus de clarté
  const [activeTab, setActiveTab] = useState(0); // Onglet actif par défaut
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // États pour contrôler l'ouverture des modales
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMandatModalOpen, setIsMandatModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);

  // États pour savoir quel item éditer dans les modales (null = création)
  const [contactToEdit, setContactToEdit] = useState(null);
  const [mandatToEdit, setMandatToEdit] = useState(null);

  // États "version" pour forcer le rafraîchissement des listes enfants
  const [contactListVersion, setContactListVersion] = useState(0);
  const [mandatListVersion, setMandatListVersion] = useState(0);
  const [interactionListVersion, setInteractionListVersion] = useState(0);

  // Fonction pour charger les données de la société (corrigée)
  const fetchSocieteData = useCallback(async () => { // Ajouter async
    // setLoading(true); // Optionnel: peut causer clignotement lors des refresh
    setError('');
    try {
      // 3. Utiliser fetchGetData
      const data = await fetchGetData(`/societes/${id}/`, authToken);
      setSocieteData(data);
    } catch (error) {
      console.error('Erreur fetch société:', error);
      setError(`Impossible de charger les données de la société: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [id, authToken]); // Dépend de l'ID et du token

  // Charger les données au montage initial
  useEffect(() => {
    fetchSocieteData();
  }, [fetchSocieteData]); // Dépend de la fonction fetchSocieteData

  // Gérer les changements dans le formulaire SocieteInfo
  const handleInfoChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    } else if (type === 'date') {
      finalValue = value === '' ? null : value;
    }
    if (name === 'maison_mere') {
      finalValue = value === '' ? null : parseInt(value, 10);
    }
    // Met à jour l'état societeData directement
    setSocieteData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  // Sauvegarder les modifications de l'onglet Info (corrigée)
  const handleInfoSubmit = async (e) => {
    // Si appelé depuis un <form>, empêcher le rechargement
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    try {
      // 4. Utiliser fetchMutateData
      const updatedData = await fetchMutateData('PUT', `/societes/${id}/`, societeData, authToken);
      setSocieteData(updatedData); // Mettre à jour avec la réponse du serveur
      alert('Modifications sauvegardées !');
    } catch (err) {
      console.error("Erreur sauvegarde société:", err);
      let errorMessage = "Une erreur est survenue lors de la sauvegarde.";
      if (err.errors) {
         errorMessage = `Erreur de sauvegarde :\n${JSON.stringify(err.errors)}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      setError(errorMessage); // Afficher l'erreur (peut être affiché dans le JSX)
      alert(errorMessage); // Ou via une alerte simple
    }
  };

  // --- Fonctions pour gérer les modales ---

  // Contact
  const handleContactSaveSuccess = () => { setContactListVersion(v => v + 1); setIsContactModalOpen(false); setContactToEdit(null); };
  const handleAddContactClick = () => { setContactToEdit(null); setIsContactModalOpen(true); };
  const handleEditContactClick = (contact) => { setContactToEdit(contact); setIsContactModalOpen(true); };
  const handleCloseContactModal = () => { setIsContactModalOpen(false); setContactToEdit(null); };
  const handleDeleteContactClick = async (contactId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      try {
        await fetchMutateData('DELETE', `/contacts/${contactId}/`, null, authToken); // Utilise apiClient
        alert('Contact supprimé.');
        setContactListVersion(v => v + 1);
      } catch (error) {
        console.error("Erreur suppression contact:", error);
        alert('Erreur lors de la suppression du contact.');
      }
    }
  };

  // Mandat
  const handleMandatSaveSuccess = () => { setMandatListVersion(v => v + 1); setIsMandatModalOpen(false); setMandatToEdit(null); fetchSocieteData(); /* Rafraîchir aussi les données société si un mandat a été ajouté/modifié */ };
  const handleAddMandatClick = () => { setMandatToEdit(null); setIsMandatModalOpen(true); };
  const handleEditMandatClick = (mandat) => { setMandatToEdit(mandat); setIsMandatModalOpen(true); };
  const handleCloseMandatModal = () => { setIsMandatModalOpen(false); setMandatToEdit(null); };
   const handleDeleteMandatClick = async (mandatId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mandat ?")) {
      try {
        await fetchMutateData('DELETE', `/mandats/${mandatId}/`, null, authToken); // Utilise apiClient
        alert('Mandat supprimé.');
        setMandatListVersion(v => v + 1);
        fetchSocieteData(); // Rafraîchir les données société
      } catch (error) {
        console.error("Erreur suppression mandat:", error);
        alert('Erreur lors de la suppression du mandat.');
      }
    }
  };

  // Interaction
  const handleInteractionSaveSuccess = () => { setInteractionListVersion(v => v + 1); setIsInteractionModalOpen(false); };
  const handleAddInteractionClick = () => { setIsInteractionModalOpen(true); };
  const handleCloseInteractionModal = () => { setIsInteractionModalOpen(false); };

  // Gérer le changement d'onglet MUI
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Met à jour l'état qui contrôle quel onglet est visible
    setError(''); // Optionnel: Nettoyer les erreurs en changeant d'onglet
  };


  // --- Affichage ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement...</Typography>
      </Box>
    );
  }

  if (error && !societeData) { // Erreur fatale au chargement
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  if (!societeData) { // Ne devrait pas arriver si pas d'erreur
    return <Typography sx={{ p: 2 }}>Données non disponibles.</Typography>;
  }

  return (
    // Container optionnel pour limiter la largeur
    // <Container maxWidth="lg">
    <Box sx={{ mt: 2 }}> {/* Marge en haut */}
      {/* Barre d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          Retour
        </Link>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', flexGrow: 1 }}>
          {societeData.nom}
        </Typography>
        {/* Bouton Sauvegarder visible seulement sur l'onglet info */}
        {activeTab === 0 && ( // Onglet Info est à l'index 0
          <Button
            variant="contained"
            color="primary"
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleInfoSubmit}
            disabled={saveLoading}
          >
            {saveLoading ? 'Sauvegarde...' : 'Sauvegarder Infos'}
          </Button>
        )}
      </Box>

      {/* Affichage d'erreur de sauvegarde (pour l'onglet Info) */}
      {error && activeTab === 0 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Système d'onglets MUI */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Onglets Société">
          <Tab label="Informations Société" id="societe-tab-0" aria-controls="societe-tabpanel-0" />
          <Tab label="Contacts" id="societe-tab-1" aria-controls="societe-tabpanel-1" />
          <Tab label="Mandats" id="societe-tab-2" aria-controls="societe-tabpanel-2" />
          <Tab label="Interactions" id="societe-tab-3" aria-controls="societe-tabpanel-3" />
        </Tabs>
      </Box>

      {/* Contenu des Onglets (Panels) */}
      {/* On utilise Paper pour un léger fond et une bordure */}
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Padding adaptatif */}
        {/* Panel Info */}
        <div role="tabpanel" hidden={activeTab !== 0} id="societe-tabpanel-0" aria-labelledby="societe-tab-0">
          {activeTab === 0 && <SocieteInfo formData={societeData} handleChange={handleInfoChange} />}
        </div>

        {/* Panel Contacts */}
        <div role="tabpanel" hidden={activeTab !== 1} id="societe-tabpanel-1" aria-labelledby="societe-tab-1">
          {activeTab === 1 && (
            <SocieteContacts
              societeId={id}
              listVersion={contactListVersion}
              onAddContactClick={handleAddContactClick}
              onEditContactClick={handleEditContactClick}
              onDeleteContactClick={handleDeleteContactClick}
              authToken={authToken} // <-- Passer authToken
            />
          )}
        </div>

        {/* Panel Mandats */}
        <div role="tabpanel" hidden={activeTab !== 2} id="societe-tabpanel-2" aria-labelledby="societe-tab-2">
           {activeTab === 2 && (
            <SocieteMandats
              societeId={id}
              listVersion={mandatListVersion}
              onAddMandatClick={handleAddMandatClick}
              onEditMandatClick={handleEditMandatClick}
              onDeleteMandatClick={handleDeleteMandatClick}
              authToken={authToken} // <-- Passer authToken
            />
          )}
        </div>

        {/* Panel Interactions */}
        <div role="tabpanel" hidden={activeTab !== 3} id="societe-tabpanel-3" aria-labelledby="societe-tab-3">
           {activeTab === 3 && (
            <SocieteInteractions
              societeId={id}
              listVersion={interactionListVersion}
              onAddInteractionClick={handleAddInteractionClick}
              authToken={authToken} // <-- Passer authToken
            />
          )}
        </div>
      </Paper>

      {/* Modales (inchangées, mais reçoivent authToken) */}
      <ContactFormModal isOpen={isContactModalOpen} onClose={handleCloseContactModal} societeId={id} onSaveSuccess={handleContactSaveSuccess} contactToEdit={contactToEdit} authToken={authToken}/>
      <MandatFormModal isOpen={isMandatModalOpen} onClose={handleCloseMandatModal} societeId={id} onSaveSuccess={handleMandatSaveSuccess} mandatToEdit={mandatToEdit} authToken={authToken}/>
      <InteractionFormModal isOpen={isInteractionModalOpen} onClose={handleCloseInteractionModal} societeId={id} onSaveSuccess={handleInteractionSaveSuccess} authToken={authToken}/>
    </Box>
    // </Container> // Fin du Container optionnel
  );
}

export default SocieteDetailPage;