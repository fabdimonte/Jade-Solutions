// src/components/MandatInfo.jsx
import React from 'react';

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

// Ce composant "bête" ne fait qu'afficher le formulaire et remonter les changements
function MandatInfo({ formData, handleChange }) {

  // --- Rendu avec MUI Grid v6+ ---
  return (
    // Grid container (parent reste inchangé)
    <Grid container spacing={2}>

      {/* --- Section Identification --- */}
      {/* Optionnel: Titre de section */}
      {/* <Grid size={12}><Typography variant="subtitle1" gutterBottom>Détails</Typography></Grid> */}

      {/* Grid enfants corrigés (sans 'item', avec 'size') */}
      <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
        <TextField
          label="Nom du mandat"
          name="nom_mandat"
          value={formData.nom_mandat || ''}
          onChange={handleChange}
          required
          fullWidth
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
        <TextField
          label="Client"
          name="client_nom"
          value={formData.client_nom || (formData.client ? `ID: ${formData.client}`: '')}
          disabled
          fullWidth
          sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000', backgroundColor: '#eee' } }}
        />
         <input type="hidden" name="client" value={formData.client || ''} />
      </Grid>

      {/* --- Section Statut & Phase --- */}
       <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
         <FormControl fullWidth required>
           <InputLabel id="type-mandat-select-label">Type de mandat</InputLabel>
           <Select
             labelId="type-mandat-select-label"
             id="type_mandat_select"
             name="type_mandat"
             value={formData.type_mandat || 'SELL'}
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
        <FormControl fullWidth required>
          <InputLabel id="statut-mandat-select-label">Statut</InputLabel>
          <Select
            labelId="statut-mandat-select-label"
            id="statut_select"
            name="statut"
            value={formData.statut || 'PROSP'}
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
        <FormControl fullWidth>
          <InputLabel id="phase-mandat-select-label">Phase</InputLabel>
          <Select
            labelId="phase-mandat-select-label"
            id="phase_select"
            name="phase"
            value={formData.phase || ''}
            label="Phase"
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value=""><em></em></MenuItem>
            <MenuItem value="PREPA">Préparation (Teaser, IM)</MenuItem>
            <MenuItem value="MARKET">Phase de marketing</MenuItem>
            <MenuItem value="NEGO">Négociation (LOI)</MenuItem>
            <MenuItem value="DUE_DIL">Due Diligence</MenuItem>
            <MenuItem value="SIGN">Signature (SPA)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {/* Placeholder pour aligner la grille */}
      <Grid size={{ xs: 12, sm: 6 }}></Grid> {/* <-- CORRIGÉ */}

      {/* --- Section Financier --- */}
      {/* Optionnel: Titre de section */}
      {/* <Grid size={12}><Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>Financier</Typography></Grid> */}

      <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
        <TextField
          label="Valorisation estimée (€)"
          name="valorisation_estimee"
          type="number"
          value={formData.valorisation_estimee ?? ''}
          onChange={handleChange}
          fullWidth
          InputProps={{ inputProps: { step: 0.01 } }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}> {/* <-- CORRIGÉ */}
        <TextField
          label="Honoraires estimés (€)"
          name="honoraires_estimes"
          type="number"
          value={formData.honoraires_estimes ?? ''}
          onChange={handleChange}
          fullWidth
          InputProps={{ inputProps: { step: 0.01 } }}
        />
      </Grid>

    </Grid> // Fin Grid container
  );
}

export default MandatInfo;