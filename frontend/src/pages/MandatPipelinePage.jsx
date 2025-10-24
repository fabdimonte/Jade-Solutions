// src/pages/MandatPipelinePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
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

// 1. Importer fetchGetData
import { fetchGetData } from '../apiClient';

// Constantes pour les phases (correspondent aux choix dans models.py)
const PHASES = {
  PREPA: { label: 'Préparation (Teaser, IM)', order: 1 },
  MARKET: { label: 'Phase de marketing', order: 2 },
  NEGO: { label: 'Négociation (LOI)', order: 3 },
  DUE_DIL: { label: 'Due Diligence', order: 4 },
  SIGN: { label: 'Signature (SPA)', order: 5 },
  NONE: { label: '(Non définie)', order: 0 }, // Pour les mandats sans phase
};

// Fonction pour récupérer les infos d'une phase
const getPhaseInfo = (phaseCode) => {
  return PHASES[phaseCode] || PHASES.NONE;
};

// Styles (inchangés)
const columnStyle = {
  flex: '1',
  minWidth: '250px',
  margin: '0 10px',
  padding: '10px',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  alignSelf: 'flex-start', // Empêche les colonnes de s'étirer verticalement
};
const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid #ddd',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '3px',
};

// 2. Recevoir authToken en prop
function MandatPipelinePage({ authToken }) {
  const [mandats, setMandats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Charger les mandats actifs (corrigé)
  useEffect(() => {
    setLoading(true);
    setError('');
    // 3. Utiliser fetchGetData
    fetchGetData('/mandats/', authToken)
      .then(data => {
        // Filtrer pour ne garder que les mandats "en cours"
        const mandatsActifs = data.filter(m =>
          m.statut === 'PROSP' || m.statut === 'EN_COURS' || m.statut === 'CLOSING'
        );
        setMandats(mandatsActifs);
      })
      .catch(err => {
        console.error("Erreur chargement mandats pipeline:", err);
        setError(`Impossible de charger le pipeline: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  // 4. Dépendre de authToken
  }, [authToken]);

  // Regrouper les mandats par phase (useMemo inchangé)
  const mandatsParPhase = useMemo(() => {
    const grouped = {};
    Object.keys(PHASES).forEach(key => { grouped[key] = []; });
    mandats.forEach(mandat => {
      const phaseCode = mandat.phase || 'NONE';
      if (grouped[phaseCode]) {
        grouped[phaseCode].push(mandat);
      } else {
        grouped['NONE'].push(mandat); // Sécurité
      }
    });
    return grouped;
  }, [mandats]);

  // Trier les phases par ordre (inchangé)
  const phasesOrdonnees = Object.keys(mandatsParPhase).sort((a, b) => {
    return getPhaseInfo(a).order - getPhaseInfo(b).order;
  });

  // --- Affichage ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress /> <Typography sx={{ ml: 2 }}>Chargement...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ p: 2 }}> {/* Padding autour de la page */}
      {/* Lien retour optionnel */}
      <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2, textDecoration: 'none' }}>
        <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small"/> Retour
      </Link>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Pipeline des Mandats
      </Typography>

      {/* Conteneur pour les colonnes avec défilement horizontal */}
      <Box sx={{ display: 'flex', overflowX: 'auto', py: 2, // padding vertical
           // Style de la barre de défilement (optionnel, pour améliorer l'esthétique)
           '&::-webkit-scrollbar': { height: 8 },
           '&::-webkit-scrollbar-thumb': { backgroundColor: 'grey.400', borderRadius: 4 },
           '&::-webkit-scrollbar-track': { backgroundColor: 'grey.200', borderRadius: 4 },
           minHeight: '60vh' // Hauteur minimale pour voir les colonnes
         }}>
        {phasesOrdonnees.map(phaseCode => (
          PHASES[phaseCode] && ( // S'assurer que la phase existe dans notre définition
            // Colonne (Box MUI)
            <Box
              key={phaseCode}
              sx={{
                flex: '0 0 300px', // Largeur fixe, ne grandit/rétrécit pas
                mx: 1.5,          // Marge horizontale entre colonnes
                p: 1.5,           // Padding intérieur
                bgcolor: 'grey.100', // Fond légèrement gris
                borderRadius: 2,
                display: 'flex',       // Pour aligner le contenu verticalement
                flexDirection: 'column' // Direction colonne
              }}
            >
              {/* Titre de la colonne */}
              <Typography variant="h6" component="h2" sx={{ mb: 1.5, px: 1, borderBottom: '2px solid', borderColor: 'primary.main', color: 'primary.main' }}>
                {getPhaseInfo(phaseCode).label} ({mandatsParPhase[phaseCode]?.length || 0})
              </Typography>

              {/* Conteneur pour les cartes (avec défilement vertical si besoin) */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}> {/* pr = padding right léger pour scrollbar */}
                {(mandatsParPhase[phaseCode] || []).map(mandat => (
                  // Carte (Paper MUI)
                  <Paper
                    key={mandat.id}
                    elevation={1} // Légère ombre
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      '&:hover': { elevation: 3 } // Ombre plus forte au survol
                    }}
                  >
                    {/* Lien vers le détail */}
                    <Link component={RouterLink} to={`/mandats/${mandat.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' }}>
                        {mandat.nom_mandat}
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Client: {mandat.client_nom || `ID ${mandat.client}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valo: {mandat.valorisation_estimee ? `${mandat.valorisation_estimee} €` : 'N/A'}
                    </Typography>
                    {/* Ajouter Type / Statut si utile */}
                    {/* <Typography variant="caption" display="block" sx={{ mt: 1, color: 'grey.600' }}>
                        {getTypeLabel(mandat.type_mandat)} - {getStatutLabel(mandat.statut)}
                    </Typography> */}
                  </Paper>
                ))}
                {/* Message si colonne vide */}
                {mandatsParPhase[phaseCode]?.length === 0 && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', textAlign: 'center', mt: 2 }}>
                    Aucun mandat
                  </Typography>
                )}
              </Box>
            </Box>
          )
        ))}
      </Box>
    </Box>
  );
}

export default MandatPipelinePage;