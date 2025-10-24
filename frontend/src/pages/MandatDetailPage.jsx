// src/pages/MandatDetailPage.jsx
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

// Import des composants enfants (onglets)
import MandatInfo from '../components/MandatInfo';
import MandatContreparties from '../components/MandatContreparties';

// 1. Importer les fonctions apiClient
import { fetchGetData, fetchMutateData } from '../apiClient';

// 2. Le composant reçoit authToken en prop
function MandatDetailPage({ authToken }) {
  const { id } = useParams(); // ID du mandat depuis l'URL
  const [mandatData, setMandatData] = useState(null); // Renommé pour clarté
  const [activeTab, setActiveTab] = useState(0); // Onglet actif par défaut
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [saveLoading, setSaveLoading] = useState(false); // État pour le bouton sauvegarder

  // Fonction pour charger les données du mandat (corrigée)
  const fetchMandatData = useCallback(async () => { // Ajouter async
    // setLoading(true); // Optionnel
    setError('');
    try {
      // 3. Utiliser fetchGetData
      const data = await fetchGetData(`/mandats/${id}/`, authToken);
      setMandatData(data);
    } catch (error) {
      console.error('Erreur fetch mandat:', error);
      setError(`Impossible de charger les données du mandat: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [id, authToken]); // Dépend de l'ID et du token

  // Charger les données au montage initial
  useEffect(() => {
    fetchMandatData();
  }, [fetchMandatData]); // Dépend de la fonction fetchMandatData

  // Gérer les changements dans le formulaire MandatInfo
  const handleInfoChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    }
    // Gérer spécifiquement le champ client (qui est juste un ID)
    if (name === 'client') {
      finalValue = value === '' ? null : parseInt(value, 10);
    }
    // Met à jour l'état mandatData directement
    setMandatData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  // Sauvegarder les modifications de l'onglet Info (corrigée)
  const handleInfoSubmit = async (e) => { // Ajouter async
    // Si appelé depuis un <form>, empêcher le rechargement
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    try {
      // Préparer les données (on ne renvoie pas client_nom, acheteurs_potentiels, cedants_potentiels)
      const dataToSend = {
          nom_mandat: mandatData.nom_mandat,
          client: mandatData.client, // On envoie l'ID
          type_mandat: mandatData.type_mandat,
          statut: mandatData.statut,
          phase: mandatData.phase,
          valorisation_estimee: mandatData.valorisation_estimee,
          honoraires_estimes: mandatData.honoraires_estimes,
          // Les ManyToMany sont gérés par les actions add/remove
      };

      // 4. Utiliser fetchMutateData
      const updatedData = await fetchMutateData('PUT', `/mandats/${id}/`, dataToSend, authToken);
      // Mettre à jour l'état local avec la réponse complète pour MAJ les champs readOnly comme client_nom etc.
      // Important: il faut re-fetcher pour avoir les listes acheteurs/cédants à jour
      fetchMandatData();
      alert('Modifications sauvegardées !');
    } catch (err) {
      console.error("Erreur sauvegarde mandat:", err);
      let errorMessage = "Une erreur est survenue lors de la sauvegarde.";
      if (err.errors) {
         errorMessage = `Erreur de sauvegarde :\n${JSON.stringify(err.errors)}`;
      } else if (err.message) {
          errorMessage = err.message;
      }
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Gérer le changement d'onglet MUI
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Met à jour l'état de l'onglet actif
    setError(''); // Optionnel: Nettoyer les erreurs en changeant d'onglet
  };


  // --- Affichage ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress /> <Typography sx={{ ml: 2 }}>Chargement...</Typography>
      </Box>
    );
  }

  if (error && !mandatData) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  if (!mandatData) {
    return <Typography sx={{ p: 2 }}>Mandat non trouvé ou données indisponibles.</Typography>;
  }

  return (
    // Container optionnel
    // <Container maxWidth="lg">
    <Box sx={{ mt: 2 }}>
      {/* Barre d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          Retour
        </Link>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', flexGrow: 1 }}>
          Mandat : {mandatData.nom_mandat || ''}
        </Typography>
        {activeTab === 0 && ( // Bouton visible seulement sur onglet Info (index 0)
          <Button
            variant="contained"
            color="primary"
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleInfoSubmit} // Appelle la fonction de sauvegarde
            disabled={saveLoading}
          >
            {saveLoading ? 'Sauvegarde...' : 'Sauvegarder Infos'}
          </Button>
        )}
      </Box>

      {/* Affichage d'erreur de sauvegarde */}
      {error && activeTab === 0 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Système d'onglets MUI */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Onglets Mandat">
          <Tab label="Informations" id="mandat-tab-0" aria-controls="mandat-tabpanel-0" />
          <Tab label="Acheteurs Potentiels" id="mandat-tab-1" aria-controls="mandat-tabpanel-1" />
          <Tab label="Cédants Potentiels" id="mandat-tab-2" aria-controls="mandat-tabpanel-2" />
        </Tabs>
      </Box>

      {/* Contenu des Onglets */}
      <Paper elevation={0} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Panel Info */}
        <div role="tabpanel" hidden={activeTab !== 0} id="mandat-tabpanel-0" aria-labelledby="mandat-tab-0">
          {/* S'assurer que MandatInfo utilise la syntaxe Grid v6+ */}
          {activeTab === 0 && <MandatInfo formData={mandatData} handleChange={handleInfoChange} />}
        </div>

        {/* Panel Acheteurs */}
        <div role="tabpanel" hidden={activeTab !== 1} id="mandat-tabpanel-1" aria-labelledby="mandat-tab-1">
          {activeTab === 1 && (
            <MandatContreparties
              titre="Acheteurs Potentiels"
              listeSocietes={mandatData.acheteurs_potentiels || []}
              mandatId={id}
              typeAction="acheteur"
              onUpdate={fetchMandatData}
              authToken={authToken}
            />
          )}
        </div>

        {/* Panel Cédants */}
        <div role="tabpanel" hidden={activeTab !== 2} id="mandat-tabpanel-2" aria-labelledby="mandat-tab-2">
           {activeTab === 2 && (
            <MandatContreparties
              titre="Cédants Potentiels"
              listeSocietes={mandatData.cedants_potentiels || []}
              mandatId={id}
              typeAction="cedant"
              onUpdate={fetchMandatData}
              authToken={authToken}
            />
          )}
        </div>
      </Paper>
    </Box>
    // </Container>
  );
}

export default MandatDetailPage;