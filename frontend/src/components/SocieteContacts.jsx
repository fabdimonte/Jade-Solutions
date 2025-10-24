// src/components/SocieteContacts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGetData } from '../apiClient';
// On n'importe plus ContactFormModal ici

// 1. Accepter les nouvelles props : listVersion et onAddContactClick
function SocieteContacts({ societeId, listVersion, onAddContactClick, onEditContactClick, onDeleteContactClick, authToken }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. L'état de la modale a disparu

  const fetchContacts = useCallback(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/contacts/?societe_id=${societeId}`)
      .then(response => response.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur fetch contacts:", error);
        setLoading(false);
      });
  }, [societeId]);

  // 3. useEffect dépend maintenant de listVersion
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, listVersion, authToken]); // Se relance si listVersion change

  // 4. La fonction handleSaveSuccess a disparu

  if (loading && contacts.length === 0) {
    return <div>Chargement des contacts...</div>;
  }

  // Style pour les "badges" de groupe
  const badgeStyle = {
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '0.8em',
    marginRight: '5px',
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <button type="button" onClick={onAddContactClick}>
          + Ajouter un contact
        </button>
      </div>

      <h3>Contacts liés à cette société</h3>
      {contacts.length === 0 ? (
        <p>Aucun contact trouvé pour cette société.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contacts.map(contact => (
            <li key={contact.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{contact.prenom} {contact.nom}</strong> ({contact.fonction})
                <br />
                Email: {contact.email} | Tél: {contact.telephone_portable}
                <br />

                {/* --- AJOUT : Afficher les groupes --- */}
                  <div style={{ marginTop: '5px' }}>
                    {contact.groupes && contact.groupes.map(groupe => (
                      <span key={groupe.id} style={badgeStyle}>
                        {groupe.nom}
                      </span>
                    ))}
                  </div>

              </div>
              <div>
                {/* 2. NOUVEAU BOUTON : qui appelle la fonction du parent */}
                <button
                  type="button"
                  onClick={() => onEditContactClick(contact)} // <-- L'ACTION
                  style={{ marginLeft: '10px' }}
                >
                  Modifier
                </button>
                {/* 2. NOUVEAU BOUTON : qui appelle la fonction du parent */}
                <button
                  type="button"
                  onClick={() => onDeleteContactClick(contact.id)} // <-- L'ACTION
                  style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SocieteContacts;