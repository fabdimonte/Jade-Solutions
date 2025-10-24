// src/components/InteractionFormModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchGetData } from '../apiClient';

// Styles (similaires aux autres modales)
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

function InteractionFormModal({ isOpen, onClose, societeId, onSaveSuccess, authToken }) {

  // États pour le formulaire
  const [formData, setFormData] = useState({
    contact: '', // ID du contact sélectionné
    type_interaction: 'APPEL',
    date_interaction: new Date().toISOString().slice(0, 16), // Format datetime-local
    notes: '',
  });

  // État pour stocker les contacts de la société
  const [contactsSociete, setContactsSociete] = useState([]);

  // Charger les contacts de la société quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && societeId) {
      fetch(`http://127.0.0.1:8000/api/contacts/?societe_id=${societeId}`)
        .then(res => res.json())
        .then(data => setContactsSociete(data))
        .catch(err => console.error("Erreur chargement contacts société:", err));

      // Reset formulaire à l'ouverture
      setFormData({
        contact: '',
        type_interaction: 'APPEL',
        date_interaction: new Date().toISOString().slice(0, 16),
        notes: '',
      });
    }
  }, [isOpen, societeId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // On n'envoie pas societeId, le backend le déduit du contact
    const dataToSend = { ...formData };

    fetch('http://127.0.0.1:8000/api/interactions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
    .then(response => {
      if (response.ok) {
        onSaveSuccess(); // Rafraîchit la liste et ferme
      } else {
        response.json().then(errors => {
          console.error("Erreur validation interaction:", errors);
          alert(`Erreur sauvegarde :\n${JSON.stringify(errors)}`);
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
        <h2>Ajouter une Interaction</h2>
        <form onSubmit={handleSubmit}>

          <div>
            <label>Contact concerné :</label>
            <select
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            >
              <option value="" disabled>-- Choisir un contact --</option>
              {contactsSociete.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.prenom} {contact.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Type d'interaction :</label>
            <select
              name="type_interaction"
              value={formData.type_interaction}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            >
              <option value="APPEL">Appel téléphonique</option>
              <option value="EMAIL">Email</option>
              <option value="RDV">Rendez-vous</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label>Date et Heure :</label>
            <input
              type="datetime-local"
              name="date_interaction"
              value={formData.date_interaction}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>

          <div>
            <label>Notes :</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
              rows="4"
              style={{ width: '100%', padding: '8px', marginBottom: '10px', fontFamily: 'inherit' }}
            />
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

export default InteractionFormModal;