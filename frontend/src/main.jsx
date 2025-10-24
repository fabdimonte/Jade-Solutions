// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { deepPurple, amber, green } from '@mui/material/colors'; // Importer des couleurs

// --- Personnaliser le thème ---
const theme = createTheme({
  palette: {
    // Changer la couleur principale pour un violet
    primary: {
      main: "#005f52", // Utilise une nuance de la palette MUI
    },
    // Changer la couleur secondaire (pour d'autres éléments)
    secondary: {
      main: green[700],
    },
    // Tu peux aussi définir 'error', 'warning', 'info', 'success'
    background: { default: '#f5f5f5' } // Changer le fond par défaut
  },
  typography: {
    // Changer la police par défaut (si tu l'as importée via CSS ou Google Fonts)
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem', // Personnaliser la taille des titres h1
    }
  },
  // Tu peux même changer les styles par défaut des composants
  components: {
    MuiButton: { // Cible tous les composants Button
      defaultProps: {
        // disableElevation: true, // Enlever l'ombre par défaut
      },
      styleOverrides: {
        root: { // Style appliqué à la racine du bouton
          // textTransform: 'none', // Empêcher la mise en majuscules
          // borderRadius: 8, // Arrondir les coins
        }
      }
    }
  }
});
// --- Fin de la personnalisation ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);