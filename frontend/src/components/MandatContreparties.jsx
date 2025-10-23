// src/components/MandatContreparties.jsx
import React, { useState } from 'react';

// Ce composant gère soit les 'acheteurs' soit les 'cedants'
// - titre: "Acheteurs Potentiels" ou "Cédants Potentiels"
// - listeSocietes: la liste (ex: mandat.acheteurs_potentiels)
// - mandatId: l'ID du mandat en cours
// - typeAction: "acheteur" ou "cedant", pour appeler la bonne API
// - onUpdate: la fonction pour dire au parent de se rafraîchir
function MandatContreparties({ titre, listeSocietes, mandatId, typeAction, onUpdate }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fonction pour rechercher des sociétés
  const handleSearch = async () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    // On utilise l'API de recherche qu'on a créée
    const response = await fetch(`http://127.0.0.1:8000/api/societes/?search=${searchTerm}`);
    const data = await response.json();
    setSearchResults(data);
  };

  // Fonction pour ajouter une société (ex: add_acheteur)
  const handleAdd = async (societeId) => {
    await fetch(`http://127.0.0.1:8000/api/mandats/${mandatId}/add_${typeAction}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ societe_id: societeId }),
    });
    setSearchTerm(''); // Vider la recherche
    setSearchResults([]); // Vider les résultats
    onUpdate(); // Dire au parent de re-fetch les données
  };

  // Fonction pour retirer une société (ex: remove_acheteur)
  const handleRemove = async (societeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cette société de la liste ?")) {
      await fetch(`http://127.0.0.1:8000/api/mandats/${mandatId}/remove_${typeAction}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ societe_id: societeId }),
      });
      onUpdate(); // Dire au parent de re-fetch les données
    }
  };

  return (
    <div>
      {/* ----- Section d'Ajout ----- */}
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h4>Ajouter {titre === 'Acheteurs Potentiels' ? 'un acheteur' : 'un cédant'}</h4>
        <input
          type="text"
          placeholder="Rechercher une société par nom ou SIREN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        <button type="button" onClick={handleSearch} style={{ marginTop: '5px' }}>Rechercher</button>

        {/* --- Résultats de recherche --- */}
        {searchResults.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #eee', marginTop: '10px' }}>
            {searchResults.map(societe => (
              <li key={societe.id} style={{ padding: '5px', display: 'flex', justifyContent: 'space-between' }}>
                {societe.nom} ({societe.siren})
                <button type="button" onClick={() => handleAdd(societe.id)}>+</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ----- Section de la Liste ----- */}
      <h3 style={{ marginTop: '30px' }}>{titre} Actuels</h3>
      {listeSocietes.length === 0 ? (
        <p>Aucune société dans cette liste.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {listeSocietes.map(societe => (
            <li key={societe.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{societe.nom}</strong>
                <br />
                Secteur: {societe.secteur}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(societe.id)}
                style={{ backgroundColor: '#f44336', color: 'white', border: 'none' }}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MandatContreparties;