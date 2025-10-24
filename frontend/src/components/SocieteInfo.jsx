// src/components/SocieteInfo.jsx
// Version actuelle (complète, avec tous les champs)
import React from 'react';
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

function SocieteInfo({ formData, handleChange }) {

  // Style pour les inputs
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const disabledInputStyle = { ...inputStyle, background: '#eee' };

  return (
    <Box>
      {/* Grid container (parent) */}
      <Grid container spacing={2}>

        {/* --- Section Identification --- */}
        {/* Titre (Syntaxe v6 : size={12}) */}
        <Grid size={12}><Typography variant="h6" gutterBottom>Identification</Typography></Grid>
        {/* Champs (Syntaxe v6 : size={{ xs: ..., sm: ..., md: ... }}) */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="Nom" name="nom" value={formData.nom || ''} onChange={handleChange} required fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="SIREN" name="siren" value={formData.siren || ''} onChange={handleChange} required fullWidth inputProps={{ maxLength: 9 }}/>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="Code NAF" name="code_naf" value={formData.code_naf || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={12}>
          <TextField label="Activité détaillée" name="activite_detaille" value={formData.activite_detaille || ''} onChange={handleChange} multiline rows={3} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="Secteur" name="secteur" value={formData.secteur || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="Forme Juridique" name="forme_juridique" value={formData.forme_juridique || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField label="Date de création" name="date_creation" type="date" value={formData.date_creation || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>

        {/* --- Section Coordonnées --- */}
        <Grid size={12} sx={{ mt: 2 }}><Typography variant="h6" gutterBottom>Coordonnées</Typography></Grid>
        <Grid size={12}>
          <TextField label="Adresse" name="adresse" value={formData.adresse || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField label="Code Postal" name="code_postal" value={formData.code_postal || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField label="Ville" name="ville" value={formData.ville || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField label="Région" name="region" value={formData.region || ''} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField label="Pays" name="pays" value={formData.pays || ''} onChange={handleChange} fullWidth />
        </Grid>

        {/* --- Section Contact Standard & Effectif --- */}
        <Grid size={12} sx={{ mt: 2 }}><Typography variant="h6" gutterBottom>Contact & Effectif</Typography></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="N° Standard" name="numero_standard" value={formData.numero_standard || ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="Email Standard" name="email_standard" type="email" value={formData.email_standard || ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="Effectif (précis)" name="effectif" type="number" value={formData.effectif ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="Site Web" name="site_web" type="url" value={formData.site_web || ''} onChange={handleChange} fullWidth placeholder="https://..." /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="Page LinkedIn" name="lien_linkedin" type="url" value={formData.lien_linkedin || ''} onChange={handleChange} fullWidth placeholder="https://linkedin.com/company/..." /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField label="Tranche d'effectif" name="effectif_approximatif" value={formData.effectif_approximatif || ''} onChange={handleChange} fullWidth /></Grid>

        {/* --- Section Données Financières --- */}
        <Grid size={12} sx={{ mt: 2 }}><Typography variant="h6" gutterBottom>Données Financières</Typography></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><TextField label="Dernière année dispo." name="derniere_annee_disponible" type="number" value={formData.derniere_annee_disponible ?? ''} onChange={handleChange} fullWidth placeholder="Ex: 2024" /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><TextField label="Capital Social (€)" name="capital_social" type="number" step="0.01" value={formData.capital_social ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><TextField label="Capitaux Propres (€)" name="capitaux_propres" type="number" step="0.01" value={formData.capitaux_propres ?? ''} onChange={handleChange} fullWidth /></Grid>
        {/* N */}
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="CA N (€)" name="ca_n" type="number" step="0.01" value={formData.ca_n ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Exp. N (€)" name="resultat_exploitation_n" type="number" step="0.01" value={formData.resultat_exploitation_n ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Net N (€)" name="resultat_net_n" type="number" step="0.01" value={formData.resultat_net_n ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="EBITDA N (€)" name="ebitda_n" type="number" step="0.01" value={formData.ebitda_n ?? ''} onChange={handleChange} fullWidth /></Grid>
        {/* N-1 */}
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="CA N-1 (€)" name="ca_n1" type="number" step="0.01" value={formData.ca_n1 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Exp. N-1 (€)" name="resultat_exploitation_n1" type="number" step="0.01" value={formData.resultat_exploitation_n1 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Net N-1 (€)" name="resultat_net_n1" type="number" step="0.01" value={formData.resultat_net_n1 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="EBITDA N-1 (€)" name="ebitda_n1" type="number" step="0.01" value={formData.ebitda_n1 ?? ''} onChange={handleChange} fullWidth /></Grid>
        {/* N-2 */}
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="CA N-2 (€)" name="ca_n2" type="number" step="0.01" value={formData.ca_n2 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Exp. N-2 (€)" name="resultat_exploitation_n2" type="number" step="0.01" value={formData.resultat_exploitation_n2 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="Res. Net N-2 (€)" name="resultat_net_n2" type="number" step="0.01" value={formData.resultat_net_n2 ?? ''} onChange={handleChange} fullWidth /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><TextField label="EBITDA N-2 (€)" name="ebitda_n2" type="number" step="0.01" value={formData.ebitda_n2 ?? ''} onChange={handleChange} fullWidth /></Grid>

        {/* --- Section Groupe --- */}
        <Grid size={12} sx={{ mt: 2 }}><Typography variant="h6" gutterBottom>Groupe</Typography></Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Maison Mère" name="maison_mere_nom" value={formData.maison_mere_nom || (formData.maison_mere ? `ID: ${formData.maison_mere}`: '')} disabled fullWidth sx={disabledInputStyle}/>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Modifier Maison Mère (ID)" name="maison_mere" type="number" value={formData.maison_mere || ''} onChange={handleChange} placeholder="Entrer l'ID" fullWidth />
        </Grid>

      </Grid> {/* Fin Grid container principal */}

      {/* --- Section Filiales --- */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Filiales ({formData.filiales?.length || 0})</Typography>
        {formData.filiales && formData.filiales.length > 0 ? (
          <List dense>
            {formData.filiales.map(filiale => (
              <ListItem key={filiale.id} disablePadding>
                <Link component={RouterLink} to={`/societes/${filiale.id}`} sx={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <ListItemText primary={filiale.nom} secondary={`ID: ${filiale.id}`} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mb: 0.5, '&:hover': { bgcolor: 'action.hover' } }}/>
                </Link>
              </ListItem>
            ))}
          </List>
        ) : (<Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Cette société n'a pas de filiales enregistrées.</Typography>)}
      </Box>
    </Box>
  );
}

export default SocieteInfo;