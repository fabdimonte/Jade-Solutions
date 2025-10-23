// src/pages/GroupeListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

function GroupeListPage() {
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour le formulaire (création ou édition)
  const [formData, setFormData] = useState({ id: null, nom: '', description: '' });

  // Fonction pour charger les groupes
  const fetchGroupes = useCallback(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/groupes/')
      .then(res => res.json())
      .then(data => {
        setGroupes(data);
        setLoading(false);
      });
  }, []);

  // Charger les groupes au démarrage
  useEffect(() => {
    fetchGroupes();
  }, [fetchGroupes]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const isEditing = formData.id !== null;
    const url = isEditing
      ? `http://127.0.0.1:8000/api/groupes/${formData.id}/`
      : 'http://127.0.0.1:8000/api/groupes/';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom: formData.nom, description: formData.description }),
    })
    .then(response => {
      if (response.ok) {
        fetchGroupes(); // Rafraîchir la liste
        setFormData({ id: null, nom: '', description: '' }); // Vider le formulaire
      } else {
        alert("Erreur lors de la sauvegarde du groupe.");
      }
    });
  };

  // Gérer la suppression
  const handleDelete = (groupeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      fetch(`http://127.0.0.1:8000/api/groupes/${groupeId}/`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          fetchGroupes(); // Rafraîchir la liste
        } else {
          alert('Erreur lors de la suppression.');
        }
      });
    }
  };

  // Pré-remplir le formulaire pour l'édition
  const handleEditClick = (groupe) => {
    setFormData({ id: groupe.id, nom: groupe.nom, description: groupe.description || '' });
  };

  // Vider le formulaire
  const cancelEdit = () => {
    setFormData({ id: null, nom: '', description: '' });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Retour à la liste des sociétés</Link>
      <h1>Gestion des Groupes</h1>

      {/* --- Formulaire d'ajout / modification --- */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{formData.id ? 'Modifier le groupe' : 'Ajouter un nouveau groupe'}</h3>
        <input
          type="text"
          placeholder="Nom du groupe"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Description (optionnel)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit">{formData.id ? 'Mettre à jour' : 'Créer'}</button>
        {formData.id && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>Annuler</button>
        )}
      </form>

      {/* --- Liste des groupes --- */}
      <h3>Groupes existants</h3>
      {groupes.length === 0 ? (
        <p>Aucun groupe créé.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {groupes.map(groupe => (
            <li key={groupe.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{groupe.nom}</strong>
                <br />
                <small>{groupe.description}</small>
              </div>
              <div>
                <button type="button" onClick={() => handleEditClick(groupe)} style={{ marginLeft: '10px' }}>Modifier</button>
                <button type="button" onClick={() => handleDelete(groupe.id)} style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GroupeListPage;