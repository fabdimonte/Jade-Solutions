// src/pages/MandatPipelinePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchGetData } from '../apiClient';

// Les phases possibles (correspondent aux choix dans models.py)
// On ajoute une clé 'NONE' pour les mandats sans phase définie
const PHASES = {
  PREPA: { label: 'Préparation (Teaser, IM)', order: 1 },
  MARKET: { label: 'Phase de marketing', order: 2 },
  NEGO: { label: 'Négociation (LOI)', order: 3 },
  DUE_DIL: { label: 'Due Diligence', order: 4 },
  SIGN: { label: 'Signature (SPA)', order: 5 },
  NONE: { label: '(Non définie)', order: 0 }, // Pour les mandats sans phase
};

// Fonction pour récupérer le label et l'ordre d'une phase
const getPhaseInfo = (phaseCode) => {
  return PHASES[phaseCode] || PHASES.NONE;
};

// Style pour les colonnes
const columnStyle = {
  flex: '1',
  minWidth: '250px',
  margin: '0 10px',
  padding: '10px',
  backgroundColor: 'grey',
  borderRadius: '5px',
};

// Style pour les cartes (mandats)
const cardStyle = {
  backgroundColor: 'black',
  border: '1px solid #ddd',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '3px',
};

function MandatPipelinePage({ authToken }) {
  const [mandats, setMandats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les mandats actifs au démarrage
  useEffect(() => {
    // On pourrait filtrer côté API, mais pour l'instant on filtre ici
    fetch('http://127.0.0.1:8000/api/mandats/')
      .then(res => res.json())
      .then(data => {
        // Filtrer pour ne garder que les mandats "en cours" (à ajuster selon vos statuts)
        const mandatsActifs = data.filter(m =>
          m.statut === 'PROSP' || m.statut === 'EN_COURS' || m.statut === 'CLOSING'
        );
        setMandats(mandatsActifs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement mandats:", err);
        setLoading(false);
      });
  }, [authToken]);

  // Regrouper les mandats par phase
  // useMemo évite de recalculer à chaque rendu si 'mandats' n'a pas changé
  const mandatsParPhase = useMemo(() => {
    const grouped = {};
    // Initialiser toutes les colonnes possibles
    Object.keys(PHASES).forEach(key => {
      grouped[key] = [];
    });

    // Placer chaque mandat dans la bonne colonne
    mandats.forEach(mandat => {
      const phaseCode = mandat.phase || 'NONE'; // Utiliser 'NONE' si phase est vide
      if (grouped[phaseCode]) {
        grouped[phaseCode].push(mandat);
      } else {
        grouped['NONE'].push(mandat); // Sécurité si code phase inconnu
      }
    });
    return grouped;
  }, [mandats]);

  // Trier les clés des phases par leur ordre défini
  const phasesOrdonnees = Object.keys(mandatsParPhase).sort((a, b) => {
    return getPhaseInfo(a).order - getPhaseInfo(b).order;
  });

  if (loading) {
    return <div>Chargement du pipeline...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pipeline des Mandats</h1>

      {/* Conteneur flexible pour les colonnes */}
      <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px' }}>
        {phasesOrdonnees.map(phaseCode => (
          // Afficher une colonne uniquement si elle contient des mandats OU si c'est une phase définie
          (mandatsParPhase[phaseCode].length > 0 || PHASES[phaseCode]) && (
            <div key={phaseCode} style={columnStyle}>
              {/* Titre de la colonne */}
              <h3>{getPhaseInfo(phaseCode).label} ({mandatsParPhase[phaseCode].length})</h3>

              {/* Liste des mandats dans cette colonne */}
              <div>
                {mandatsParPhase[phaseCode].map(mandat => (
                  <div key={mandat.id} style={cardStyle}>
                    <Link to={`/mandats/${mandat.id}`}>
                      <strong>{mandat.nom_mandat}</strong>
                    </Link>
                    <br />
                    <small>Client: {mandat.client_nom || `ID ${mandat.client}`}</small><br/>
                    <small>Valo: {mandat.valorisation_estimee || 'N/A'} €</small>
                    {/* Plus tard: Ajouter la possibilité de glisser-déposer */}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default MandatPipelinePage;