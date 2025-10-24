// src/components/SocieteInteractions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGetData } from '../apiClient';

// Fonction pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// 1. Accepter les props nécessaires
function SocieteInteractions({ societeId, listVersion, onAddInteractionClick, authToken }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fonction pour fetch les interactions
  const fetchInteractions = useCallback(() => {
    setLoading(true);
    // On utilise le filtre par societe_id
    fetch(`http://127.0.0.1:8000/api/interactions/?societe_id=${societeId}`)
      .then(res => res.json())
      .then(data => {
        setInteractions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur fetch interactions:", err);
        setLoading(false);
      });
  }, [societeId, authToken]);

  // 3. Charger les interactions au montage et si listVersion change
  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions, listVersion]);

  if (loading && interactions.length === 0) {
    return <div>Chargement de l'historique...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        {/* 4. Bouton pour ouvrir la future modale */}
        <button type="button" onClick={onAddInteractionClick}>
          + Ajouter une interaction
        </button>
      </div>

      <h3>Historique des Interactions</h3>
      {interactions.length === 0 ? (
        <p>Aucune interaction enregistrée pour cette société.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {interactions.map(interaction => (
            <li key={interaction.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>{interaction.get_type_interaction_display || interaction.type_interaction}</strong>
                <small>{formatDate(interaction.date_interaction)}</small>
              </div>
              <div>
                <strong>Contact :</strong> {interaction.contact_nom || 'N/A'}
                {/* On pourrait ajouter l'utilisateur ici plus tard */}
              </div>
              <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{interaction.notes}</p>
              {/* On ajoutera Modifier/Supprimer ici plus tard */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SocieteInteractions;