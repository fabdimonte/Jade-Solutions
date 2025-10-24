// src/components/MandatFormModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchGetData } from '../apiClient';

// (On peut copier-coller les styles de l'autre modale)
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  content: {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
    width: '600px', position: 'relative', color: 'black',
  },
  closeButton: {
    position: 'absolute', top: '10px', right: '10px', cursor: 'pointer',
    border: 'none', background: 'transparent', fontSize: '1.5rem',
  }
};

function MandatFormModal({ isOpen, onClose, societeId, onSaveSuccess, mandatToEdit, authToken }) {

  const [formData, setFormData] = useState({
    nom_mandat: '',
    type_mandat: 'SELL', // Valeur par défaut
    statut: 'PROSP',     // Valeur par défaut
    phase: '',
    valorisation_estimee: '',
    honoraires_estimes: '',
  });

  // Gérer le pré-remplissage pour la modification (pour plus tard)
  useEffect(() => {
    if (mandatToEdit) {
      setFormData({
        nom_mandat: mandatToEdit.nom_mandat || '',
        type_mandat: mandatToEdit.type_mandat || 'SELL',
        statut: mandatToEdit.statut || 'PROSP',
        phase: mandatToEdit.phase || '',
        valorisation_estimee: mandatToEdit.valorisation_estimee || '',
        honoraires_estimes: mandatToEdit.honoraires_estimes || '',
      });
    } else {
      // Reset pour la création
      setFormData({
        nom_mandat: '', type_mandat: 'SELL', statut: 'PROSP',
        phase: '', valorisation_estimee: '', honoraires_estimes: '',
      });
    }
  }, [mandatToEdit, isOpen, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEditing = mandatToEdit && mandatToEdit.id;

    // On ajoute 'client' aux données. L'ID de la société sur laquelle on
    // se trouve est considéré comme le 'client' par défaut.
    const dataToSend = { ...formData, client: societeId };

    const url = isEditing
      ? `http://127.0.0.1:8000/api/mandats/${mandatToEdit.id}/`
      : 'http://127.0.0.1:8000/api/mandats/';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
    .then(response => {
      if (response.ok) {
        onSaveSuccess(); // Succès !
      } else {
        response.json().then(errors => {
          console.error("Erreur de validation:", errors);
          alert(`Erreur de sauvegarde :\n${JSON.stringify(errors)}`);
        });
      }
    })
    .catch(error => console.error("Erreur API:", error));
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
        <h2>{mandatToEdit ? 'Modifier le mandat' : 'Ajouter un nouveau mandat'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label>Nom du mandat (ex: Projet Phoenix):</label>
              <input type="text" name="nom_mandat" value={formData.nom_mandat} onChange={handleChange} required style={{width: '100%'}} />
            </div>

            <div>
              <label>Type de mandat:</label>
              <select name="type_mandat" value={formData.type_mandat} onChange={handleChange} style={{width: '100%'}}>
                <option value="SELL">Sell-Side (Cession)</option>
                <option value="BUY">Buy-Side (Acquisition)</option>
                <option value="FUND">Levée de fonds</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>

            <div>
              <label>Statut:</label>
              <select name="statut" value={formData.statut} onChange={handleChange} style={{width: '100%'}}>
                <option value="PROSP">Prospection</option>
                <option value="EN_COURS">En cours</option>
                <option value="CLOSING">En closing</option>
                <option value="TERMINE">Terminé</option>
                <option value="ABANDONNE">Abandonné</option>
              </select>
            </div>

            <div>
              <label>Valorisation estimée (€):</label>
              <input type="number" name="valorisation_estimee" value={formData.valorisation_estimee} onChange={handleChange} style={{width: '100%'}} />
            </div>

            <div>
              <label>Honoraires estimés (€):</label>
              <input type="number" name="honoraires_estimes" value={formData.honoraires_estimes} onChange={handleChange} style={{width: '100%'}} />
            </div>

            {/* On pourrait aussi ajouter le champ 'phase' ici si besoin */}

          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>Annuler</button>
            <button type="submit" style={{ backgroundColor: 'blue', color: 'white' }}>Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MandatFormModal;