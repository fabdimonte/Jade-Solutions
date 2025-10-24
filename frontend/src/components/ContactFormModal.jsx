// src/components/ContactFormModal.jsx
import React, { useState, useEffect } from 'react';
import { fetchGetData } from '../apiClient';

// ... (les styles de la modale restent inchangés) ...
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

// 1. Accepter la nouvelle prop 'contactToEdit'
function ContactFormModal({ isOpen, onClose, societeId, onSaveSuccess, contactToEdit, authToken }) {

  const [allGroupes, setAllGroupes] = useState([]);
  // 2. L'état initial du formulaire est vide
  const [formData, setFormData] = useState({
    prenom: '', nom: '', email: '', telephone_portable: '', fonction: '',
    groupes_ids: [],
  });

  // 3. useEffect pour charger les groupes disponibles
  useEffect(() => {
    // On charge les groupes uniquement si la modale est ouverte
    if (isOpen) {
      fetch('http://127.0.0.1:8000/api/groupes/')
        .then(res => res.json())
        .then(data => setAllGroupes(data))
        .catch(err => console.error("Erreur chargement groupes:", err));
    }
  }, [isOpen, authToken]);

  // 3. NOUVEAU : Un 'useEffect' qui surveille 'contactToEdit'
  // Si on passe un contact à modifier, on remplit le formulaire avec ses données.
  // Si 'contactToEdit' est null (création), on vide le formulaire.
  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        prenom: contactToEdit.prenom || '',
        nom: contactToEdit.nom || '',
        email: contactToEdit.email || '',
        telephone_portable: contactToEdit.telephone_portable || '',
        fonction: contactToEdit.fonction || '',
        groupes_ids: contactToEdit.groupes ? contactToEdit.groupes.map(g => g.id) : [],
      });
    } else {
      setFormData({
        prenom: '', nom: '', email: '', telephone_portable: '', fonction: '',
        groupes_ids: [],
      });
    }
  }, [contactToEdit, isOpen]); // Se redéclenche si le contact ou l'ouverture change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // 5. NOUVELLE fonction pour gérer les cases à cocher
  const handleCheckboxChange = (groupeId) => {
    setFormData(prevData => {
      const currentGroupes = prevData.groupes_ids;
      if (currentGroupes.includes(groupeId)) {
        // Si déjà coché, on le retire
        return { ...prevData, groupes_ids: currentGroupes.filter(id => id !== groupeId) };
      } else {
        // Sinon, on l'ajoute
        return { ...prevData, groupes_ids: [...currentGroupes, groupeId] };
      }
    });
  };

  // 4. Le handleSubmit gère maintenant les deux cas (POST ou PUT)
  const handleSubmit = (e) => {
    e.preventDefault();

    // On détermine si on est en mode "modification"
    const isEditing = contactToEdit && contactToEdit.id;

    // On prépare les données et l'URL
    const dataToSend = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      telephone_portable: formData.telephone_portable,
      fonction: formData.fonction,
      societe: societeId,
      groupes_ids: formData.groupes_ids, // <-- Notre champ est là
    };

    const url = isEditing
      ? `http://127.0.0.1:8000/api/contacts/${contactToEdit.id}/`
      : 'http://127.0.0.1:8000/api/contacts/';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })
    .then(response => {
      if (response.ok) {
        onSaveSuccess(); // Rafraîchit la liste et ferme la modale (géré par le parent)
      } else {
        response.json().then(errors => {
          console.error("Erreur de validation:", errors);
          let errorMessages = [];
          for (const field in errors) {
            errorMessages.push(`${field}: ${errors[field].join(', ')}`);
          }
          alert(`Erreur de sauvegarde :\n${errorMessages.join('\n')}`);
        });
      }
    })
    .catch(error => console.error("Erreur API:", error));
  };

  if (!isOpen) return null;

  // 5. On change le titre de la modale en fonction du mode
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
        <h2>{contactToEdit ? 'Modifier le contact' : 'Ajouter un nouveau contact'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Prénom:</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required style={{width: '100%'}} />
            </div>
            <div>
              <label>Nom:</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required style={{width: '100%'}} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div>
              <label>Téléphone Portable:</label>
              <input type="text" name="telephone_portable" value={formData.telephone_portable} onChange={handleChange} style={{width: '100%'}} />
            </div>
            <div>
              <label>Fonction:</label>
              <input type="text" name="fonction" value={formData.fonction} onChange={handleChange} style={{width: '100%'}} />
            </div>
          </div>

          {/* 7. NOUVELLE section pour les groupes */}
          <hr style={{ margin: '20px 0' }} />
          <h4>Groupes</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
            {allGroupes.length > 0 ? (
              allGroupes.map(groupe => (
                <div key={groupe.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.groupes_ids.includes(groupe.id)}
                      onChange={() => handleCheckboxChange(groupe.id)}
                    />
                    {groupe.nom}
                  </label>
                </div>
              ))
            ) : (
              <p>Aucun groupe trouvé. (Créez-en dans la page "Gestion des Groupes")</p>
            )}
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

export default ContactFormModal;