// src/App.jsx
import LogoImage from '/logo.png';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, Navigate, useLocation } from 'react-router-dom';

// --- Imports MUI ---
import { Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField,  Button,  Select,  MenuItem,  FormControl,  InputLabel,
  Grid,  Box,  CircularProgress,  Alert,  IconButton, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,  Paper, Link,
  Container, Chip, Divider, AppBar, Toolbar, Tabs, Tab, CssBaseline, Drawer, ListItemButton, ListItemIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
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
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import TimelineIcon from '@mui/icons-material/Timeline';

// Importer toutes les pages
import SocieteListPage from './pages/SocieteListPage';
import SocieteCreatePage from './pages/SocieteCreatePage';
import SocieteDetailPage from './pages/SocieteDetailPage';
import MandatDetailPage from './pages/MandatDetailPage';
import GroupeListPage from './pages/GroupeListPage';
import MandatPipelinePage from './pages/MandatPipelinePage';
import LoginPage from './pages/LoginPage';

// Importer les styles globaux si nécessaire
import './App.css';

// *** 1. Créer un composant interne pour la structure principale ***
function Layout({ authToken, handleLogout }) {
  // *** Utiliser useLocation ICI, à l'intérieur du composant enfant ***
  const location = useLocation();
  const activeLinkColor = '#014a40'; // Ton vert foncé

  // Si pas connecté, on n'affiche rien (géré par ProtectedRoute plus bas)
  if (!authToken) {
    return null; // Ou afficher un loader minimal si besoin
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: { xs: 40, sm: 40 } }}>
          <Typography variant="h6" component="div" sx={{ mr: 3 }}>
            <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Box
                  component="img" // Rendre une balise <img>
                  src={LogoImage}
                  alt="Logo Jade CRM"
                  // Styles MUI pour l'image
                  sx={{
                    height: 32, // Hauteur de 32px (standard pour les logos d'AppBar)
                    width: 'auto',
                    //filter: 'brightness(0) invert(1)', // Rend l'image blanche si elle n'est pas déjà
                  }}
              />
            </RouterLink>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            {/* Bouton Sociétés */}
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{
                backgroundColor: location.pathname === '/' ? activeLinkColor : 'transparent',
                '&:hover': { backgroundColor: location.pathname === '/' ? activeLinkColor : 'rgba(255, 255, 255, 0.08)' },

              }}
            >
              Sociétés
            </Button>
            {/* Bouton Groupes */}
            <Button
              color="inherit"
              component={RouterLink}
              to="/groupes"
              sx={{
                backgroundColor: location.pathname === '/groupes' ? activeLinkColor : 'transparent',
                '&:hover': { backgroundColor: location.pathname === '/groupes' ? activeLinkColor : 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              Groupes
            </Button>
            {/* Bouton Pipeline */}
            <Button
              color="inherit"
              component={RouterLink}
              to="/pipeline"
              sx={{
                backgroundColor: location.pathname === '/pipeline' ? activeLinkColor : 'transparent',
                '&:hover': { backgroundColor: location.pathname === '/pipeline' ? activeLinkColor : 'rgba(255, 255, 255, 0.08)' },
              }}
            >
              Pipeline
            </Button>
          </Box>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            sx={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      {/* Le Container et les Routes sont déplacés ici */}
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 3, bgcolor: 'grey.50' }}>
         {/* Le composant Routes doit être ici pour que useLocation fonctionne dans les pages */}
         {/* On passe le authToken aux composants via ProtectedRoute */}
         <Routes>
            {/* Les routes protégées sont définies dans App */}
            {/* On rend juste un "Outlet" ou le contenu spécifique si nécessaire */}
            {/* Pour simplifier, on redéfinit les routes protégées ici */}
             <Route path="/" element={<SocieteListPage authToken={authToken} />} />
             <Route path="/societes/nouveau" element={<SocieteCreatePage authToken={authToken} />} />
             <Route path="/societes/:id" element={<SocieteDetailPage authToken={authToken} />} />
             <Route path="/mandats/:id" element={<MandatDetailPage authToken={authToken} />} />
             <Route path="/groupes" element={<GroupeListPage authToken={authToken} />} />
             <Route path="/pipeline" element={<MandatPipelinePage authToken={authToken} />} />
             {/* Redirection si connecté mais URL inconnue */}
             <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </Container>
    </Box>
  );
}


// *** 2. Le composant App gère l'état et le routing global ***
function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => { if (authToken) localStorage.setItem('authToken', authToken); else localStorage.removeItem('authToken'); }, [authToken]);
  const handleLoginSuccess = (token) => { setAuthToken(token); };
  const handleLogout = () => { setAuthToken(null); };

  // ProtectedRoute vérifie le token pour accéder au Layout
  const ProtectedLayout = () => {
    if (!authToken) {
      return <Navigate to="/login" replace />;
    }
    // Rend le composant Layout qui contient AppBar+Contenu+Routes internes
    return <Layout authToken={authToken} handleLogout={handleLogout} />;
  };

  return (
    // BrowserRouter englobe tout
    <BrowserRouter>
       {/* Pas besoin de Box ici, Layout s'en occupe */}
       <Routes>
         {/* Route publique pour Login */}
         <Route
           path="/login"
           element={authToken ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
         />
         {/* Route "catch-all" pour toutes les autres URL protégées */}
         {/* ProtectedLayout vérifie l'auth ET rend le layout avec les routes internes */}
         <Route path="/*" element={<ProtectedLayout />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;