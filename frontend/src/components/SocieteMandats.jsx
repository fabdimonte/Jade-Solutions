// src/components/SocieteMandats.jsx
import React, { useState, useEffect, useCallback } from 'react';

// On va créer une petite fonction pour "traduire" les codes de l'API
const getStatutLabel = (statut) => {
  const statuts = {
    PROSP: 'Prospection',
    EN_COURS: 'En cours',
    CLOSING: 'En closing',
    TERMINE: 'Terminé',
    ABANDONNE: 'Abandonné',
  };
  return statuts[statut] || statut; // Renvoie le label ou le code si inconnu
};

const getTypeLabel = (type) => {
  const types = {
    SELL: 'Sell-Side (Cession)',
    BUY: 'Buy-Side (Acquisition)',
    FUND: 'Levée de fonds',
    AUTRE: 'Autre',
  };
  return types[type] || type;
};


function SocieteMandats({ societeId, listVersion, onAddMandatClick, onEditMandatClick, onDeleteMandatClick }) {
  const [mandats, setMandats] = useState([]);
  const [loading, setLoading] = useState(true);

  // On utilise useCallback pour mémoriser la fonction
  const fetchMandats = useCallback(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/mandats/?societe_id=${societeId}`)
      .then(response => response.json())
      .then(data => {
        setMandats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur fetch mandats:", error);
        setLoading(false);
      });
  }, [societeId]); // La fonction ne sera recréée que si societeId change

  // On appelle la fonction au chargement
  useEffect(() => {
    fetchMandats();
  }, [fetchMandats, listVersion]); // Se rafraîchit si listVersion change

  if (loading) {
    return <div>Chargement des mandats...</div>;
  }

  return (
    <div>
      {/* On ajoutera un bouton "+ Ajouter Mandat" ici plus tard */}
      <div style={{ marginBottom: '15px' }}>
        <button type="button" onClick={onAddMandatClick}>
          + Ajouter un mandat
        </button>
      </div>

      <h3>Mandats liés à cette société</h3>
      {mandats.length === 0 ? (
        <p>Aucun mandat trouvé pour cette société.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mandats.map(mandat => (
            <li key={mandat.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{mandat.nom_mandat}</strong>
                  <br />
                  Type: {getTypeLabel(mandat.type_mandat)} | Statut: {getStatutLabel(mandat.statut)}
                  <br />
                  Valorisation estimée: {mandat.valorisation_estimee ? `${mandat.valorisation_estimee} €` : 'N/A'}
                </div>
                <div>
                  {/* On ajoutera les boutons Modifier/Supprimer ici */}
                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() => onEditMandatClick(mandat)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                    onClick={() => onDeleteMandatClick(mandat.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SocieteMandats;''