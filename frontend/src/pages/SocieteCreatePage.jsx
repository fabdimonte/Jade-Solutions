// src/pages/SocieteCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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

// 1. Importer fetchMutateData
import { fetchMutateData } from '../apiClient';

// 2. Recevoir authToken
function SocieteCreatePage({ authToken }) {
  // Initialiser tous les champs nécessaires pour la création
  const [formData, setFormData] = useState({
    nom: '', siren: '', code_naf: '', secteur: '', activite_detaille: '',
    adresse: '', code_postal: '', ville: '', region: '', pays: 'France',
    date_creation: null, forme_juridique: '', capital_social: null,
    derniere_annee_disponible: null, capitaux_propres: null,
    ca_n: null, ca_n1: null, ca_n2: null,
    resultat_exploitation_n: null, resultat_exploitation_n1: null, resultat_exploitation_n2: null,
    resultat_net_n: null, resultat_net_n1: null, resultat_net_n2: null,
    ebitda_n: null, ebitda_n1: null, ebitda_n2: null,
    effectif: null, effectif_approximatif: '',
    numero_standard: '', email_standard: '', site_web: '', lien_linkedin: '',
    maison_mere: null, // L'ID de la maison mère (optionnel à la création)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    // Convertir les nombres, gérer les champs vides pour les nombres/dates
    if (type === 'number') {
      finalValue = value === '' ? null : parseFloat(value);
    } else if (type === 'date') {
      finalValue = value === '' ? null : value;
    }
    // Gérer spécifiquement maison_mere (ID)
    if (name === 'maison_mere') {
        finalValue = value === '' ? null : parseInt(value, 10);
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue,
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 3. Utiliser fetchMutateData pour créer la société
      // Le body est directement notre formData car les noms correspondent
      await fetchMutateData('POST', '/societes/', formData, authToken);
      navigate('/'); // Rediriger vers la liste après succès
    } catch (err) {
      console.error("Erreur création société:", err);
      let errorMessage = "Une erreur est survenue lors de la création.";
      // Essayer d'extraire les erreurs de validation du backend
      if (err.errors) {
         try {
             // Formater les erreurs pour l'affichage
             errorMessage = Object.entries(err.errors)
                 .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                 .join('\n');
         } catch (formatError) {
             errorMessage = JSON.stringify(err.errors); // Affichage brut si formatage échoue
         }
      } else if (err.message) {
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Styles (similaires à SocieteInfo.jsx)
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const separatorStyle = { gridColumn: '1 / -1', border: 0, borderTop: '1px solid #ddd', margin: '15px 0 5px 0' };

  // --- Rendu avec MUI ---
  return (
    // Container pour centrer et limiter la largeur
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {/* Lien retour stylisé */}
      <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', mb: 2, textDecoration: 'none' }}>
        <ArrowBackIcon sx={{ mr: 1 }} />
        Retour à la liste
      </Link>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Créer une nouvelle société
      </Typography>

      {/* Box se comporte comme le <form> */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {/* Grid container pour organiser les champs */}
        <Grid container spacing={2}> {/* spacing reste sur le container */}

          {/* --- Identification --- */}
          {/* Syntaxe v6: size={12} */}
          <Grid size={12}><Typography variant="h6">Identification</Typography></Grid>
          {/* Syntaxe v6: size={{ xs: ..., sm: ... }} */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Nom" name="nom" value={formData.nom} onChange={handleChange} required fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="SIREN" name="siren" value={formData.siren} onChange={handleChange} required fullWidth inputProps={{ minLength: 9, maxLength: 9 }} disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Code NAF" name="code_naf" value={formData.code_naf} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Secteur" name="secteur" value={formData.secteur} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={12}>
            <TextField label="Activité détaillée" name="activite_detaille" value={formData.activite_detaille} onChange={handleChange} multiline rows={3} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Forme Juridique" name="forme_juridique" value={formData.forme_juridique} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Date de création" name="date_creation" type="date" value={formData.date_creation || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} disabled={loading}/>
          </Grid>

          {/* --- Coordonnées --- */}
          <Grid size={12}><Typography variant="h6" sx={{mt:2}}>Coordonnées</Typography></Grid>
          <Grid size={12}>
            <TextField label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Code Postal" name="code_postal" value={formData.code_postal} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Ville" name="ville" value={formData.ville} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Région" name="region" value={formData.region} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}> {/* sm=4 pour aligner */}
            <TextField label="Pays" name="pays" value={formData.pays} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          {/* Placeholders pour compléter la ligne si besoin */}
          <Grid size={{ xs: 0, sm: 4 }}></Grid>
          <Grid size={{ xs: 0, sm: 4 }}></Grid>


          {/* --- Contact & Effectif --- */}
          <Grid size={12}><Typography variant="h6" sx={{mt:2}}>Contact & Effectif</Typography></Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="N° Standard" name="numero_standard" value={formData.numero_standard} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="Email Standard" name="email_standard" type="email" value={formData.email_standard} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="Site Web" name="site_web" type="url" value={formData.site_web} onChange={handleChange} fullWidth placeholder="https://..." disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="Page LinkedIn" name="lien_linkedin" type="url" value={formData.lien_linkedin} onChange={handleChange} fullWidth placeholder="https://linkedin.com/company/..." disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="Effectif (précis)" name="effectif" type="number" value={formData.effectif || ''} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
             <TextField label="Tranche d'effectif" name="effectif_approximatif" value={formData.effectif_approximatif} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>

          {/* --- Données Financières (Optionnel) --- */}
          <Grid size={12}><Typography variant="h6" sx={{mt:2}}>Données Financières (Optionnel)</Typography></Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Dernière année dispo." name="derniere_annee_disponible" type="number" value={formData.derniere_annee_disponible || ''} onChange={handleChange} fullWidth placeholder="Ex: 2024" disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Capital Social (€)" name="capital_social" type="number" step="0.01" value={formData.capital_social || ''} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Capitaux Propres (€)" name="capitaux_propres" type="number" step="0.01" value={formData.capitaux_propres || ''} onChange={handleChange} fullWidth disabled={loading}/>
          </Grid>
          {/* Ajouter les autres champs financiers ici si nécessaire... */}


          {/* --- Groupe (Optionnel) --- */}
          <Grid size={12}><Typography variant="h6" sx={{mt:2}}>Groupe (Optionnel)</Typography></Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Maison Mère (ID Société)" name="maison_mere" type="number" value={formData.maison_mere || ''} onChange={handleChange} fullWidth placeholder="Entrer l'ID si applicable" disabled={loading}/>
          </Grid>

        </Grid> {/* Fin Grid container */}

        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
            {error}
          </Alert>
        )}

        {/* Bouton de soumission */}
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer la société'}
          </Button>
        </Box>

      </Box> {/* Fin Box form */}
    </Container>
  );
}

export default SocieteCreatePage;