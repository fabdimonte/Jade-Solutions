// src/components/MandatContreparties.jsx
import React, { useState } from 'react';
// 1. Importer les fonctions apiClient
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

// Props: titre, listeSocietes (déjà filtrée), mandatId, typeAction ('acheteur'/'cedant'), onUpdate (pour rafraîchir), authToken
function MandatContreparties({ titre, listeSocietes, mandatId, typeAction, onUpdate, authToken }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(''); // Pour afficher les erreurs

  // Fonction pour rechercher des sociétés (corrigée)
  const handleSearch = async () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setError(''); // Nettoyer l'erreur si la recherche est trop courte
      return;
    }
    setLoadingSearch(true);
    setError('');
    try {
      // 2. Utiliser fetchGetData avec authToken
      const data = await fetchGetData(`/societes/?search=${encodeURIComponent(searchTerm)}`, authToken);
      // Filtrer pour exclure les sociétés déjà dans la liste actuelle
      const currentIds = new Set((listeSocietes || []).map(s => s.id));
      const filteredResults = data.filter(s => !currentIds.has(s.id));
      setSearchResults(filteredResults);
      if (filteredResults.length === 0) {
        setError("Aucune nouvelle société trouvée pour ce terme.");
      }
    } catch (err) {
      console.error("Erreur recherche société:", err);
      setError(`Erreur lors de la recherche: ${err.message}`);
      setSearchResults([]); // Vider les résultats en cas d'erreur
    } finally {
      setLoadingSearch(false);
    }
  };

  // Fonction pour ajouter une société (corrigée)
  const handleAdd = async (societeId) => {
    setError('');
    try {
      // 3. Utiliser fetchMutateData avec authToken
      await fetchMutateData('POST', `/mandats/${mandatId}/add_${typeAction}/`, { societe_id: societeId }, authToken);
      setSearchTerm(''); // Vider la recherche
      setSearchResults([]); // Vider les résultats
      onUpdate(); // Dire au parent de re-fetch les données du mandat
    } catch (err) {
       console.error(`Erreur ajout ${typeAction}:`, err);
       setError(`Erreur lors de l'ajout: ${err.message || JSON.stringify(err.errors)}`);
       // On ne vide pas la recherche/résultats pour que l'utilisateur puisse voir l'erreur
    }
  };

  // Fonction pour retirer une société (corrigée)
  const handleRemove = async (societeId) => {
    setError('');
    if (window.confirm("Êtes-vous sûr de vouloir retirer cette société de la liste ?")) {
      try {
        // 4. Utiliser fetchMutateData avec authToken
        await fetchMutateData('POST', `/mandats/${mandatId}/remove_${typeAction}/`, { societe_id: societeId }, authToken);
        onUpdate(); // Dire au parent de re-fetch
      } catch (err) {
        console.error(`Erreur retrait ${typeAction}:`, err);
        setError(`Erreur lors du retrait: ${err.message || JSON.stringify(err.errors)}`);
      }
    }
  };

  return (
    <Box>
      {/* ----- Section d'Ajout ----- */}
      {/* Paper pour encadrer la zone de recherche */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Ajouter {titre === 'Acheteurs Potentiels' ? 'un acheteur' : 'un cédant'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="Rechercher société (nom/SIREN)"
            variant="outlined"
            size="small" // Champ plus petit
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
            disabled={loadingSearch}
            error={!!error && searchResults.length === 0} // Surligne en erreur si recherche échoue
            helperText={error && searchResults.length === 0 ? error : 'Minimum 2 caractères'}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loadingSearch || searchTerm.length < 2}
            startIcon={loadingSearch ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          >
            {loadingSearch ? '' : 'Chercher'}
          </Button>
        </Box>

        {/* --- Résultats de recherche --- */}
        {/* Afficher uniquement si loadingSearch=false ET il y a des résultats */}
        {!loadingSearch && searchResults.length > 0 && (
          <List dense sx={{ border: '1px solid', borderColor: 'divider', mt: 1, maxHeight: 150, overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
            {searchResults.map(societe => (
              <ListItem
                key={societe.id}
                secondaryAction={ // Bouton à droite
                  <IconButton edge="end" aria-label="add" onClick={() => handleAdd(societe.id)} color="primary" size="small">
                    <AddCircleOutlineIcon />
                  </IconButton>
                }
                sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
              >
                <ListItemText primary={societe.nom} secondary={`SIREN: ${societe.siren}`} />
              </ListItem>
            ))}
          </List>
        )}
        {/* Afficher l'erreur si la recherche n'a rien donné */}
         {error && searchResults.length === 0 && !loadingSearch && searchTerm.length >= 2 && (
             <Alert severity="info" sx={{mt: 1}}>{error}</Alert>
         )}
      </Paper>

      {/* ----- Section de la Liste ----- */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        {titre} Actuels ({listeSocietes?.length || 0})
      </Typography>
      {!listeSocietes || listeSocietes.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Aucune société dans cette liste.
        </Typography>
      ) : (
        <List>
          {listeSocietes.map(societe => (
            <ListItem
              key={societe.id}
              secondaryAction={
                <IconButton edge="end" aria-label="remove" onClick={() => handleRemove(societe.id)} color="error" size="small">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              }
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1, bgcolor: 'background.paper' }}
            >
              {/* Utiliser Link MUI + react-router pour le lien */}
              <ListItemText
                primary={
                  <Link component={RouterLink} to={`/societes/${societe.id}`} sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    {societe.nom}
                  </Link>
                }
                secondary={`Secteur: ${societe.secteur || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default MandatContreparties;