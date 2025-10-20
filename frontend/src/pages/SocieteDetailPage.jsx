// src/pages/SocieteDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SocieteInfo from '../components/SocieteInfo';     // <--- Importer l'onglet Info
import SocieteContacts from '../components/SocieteContacts'; // <--- Importer l'onglet Contacts
import ContactFormModal from '../components/ContactFormModal';

function SocieteDetailPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactListVersion, setContactListVersion] = useState(0);

  // 1. NOUVEL ÉTAT : Stocker le contact à modifier
  const [contactToEdit, setContactToEdit] = useState(null);

  // 2. Le useEffect (inchangé) va chercher les données de la société
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/societes/${id}/`)
      .then(response => response.json())
      .then(data => setFormData(data))
      .catch(error => console.error('Erreur fetch:', error));
  }, [id]);

  // 3. Le handleChange (inchangé) met à jour le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // 4. Le handleSubmit (inchangé) sauvegarde le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/societes/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) alert('Modifications sauvegardées !');
      else alert("Erreur lors de la mise à jour.");
      return response.json();
    })
    .then(data => setFormData(data))
    .catch(error => console.error("Erreur API:", error));
  };

  // 2. La fonction de succès est mise à jour pour "nettoyer"
  const handleContactSaveSuccess = () => {
    setContactListVersion(v => v + 1); // Rafraîchit la liste
    setIsModalOpen(false); // Ferme la modale
    setContactToEdit(null); // RAZ du contact à modifier
  };

  // 3. NOUVELLE FONCTION : pour ouvrir la modale en mode "Création"
  const handleAddContactClick = () => {
    setContactToEdit(null); // S'assurer qu'on est en mode création
    setIsModalOpen(true);
  };

  // 4. NOUVELLE FONCTION : pour ouvrir la modale en mode "Modification"
  const handleEditContactClick = (contact) => {
    setContactToEdit(contact); // Définir le contact à modifier
    setIsModalOpen(true);      // Ouvrir la modale
  };

  // 5. NOUVELLE FONCTION : pour gérer la fermeture
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContactToEdit(null); // Toujours RAZ à la fermeture
  };

  // 5. NOUVELLE FONCTION : pour gérer la suppression
  const handleDeleteContactClick = (contactId) => {
    // On demande confirmation pour éviter les accidents
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      fetch(`http://127.0.0.1:8000/api/contacts/${contactId}/`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) { // 'ok' couvre les statuts 200-299. DELETE renvoie souvent 204 No Content
          alert('Contact supprimé.');
          setContactListVersion(v => v + 1); // On force le rafraîchissement de la liste
        } else {
          alert('Erreur lors de la suppression du contact.');
        }
      })
      .catch(error => console.error("Erreur API:", error));
    }
  };

  // 5. Styles CSS simples pour les onglets
  const tabStyles = {
    padding: '10px 15px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderBottom: 'none',
    backgroundColor: '#f1f1f1',
    color: '#000',
  };
  const activeTabStyles = {
    ...tabStyles,
    backgroundColor: 'white',
    borderBottom: '1px solid white',
    position: 'relative',
    top: '1px'
  };

  if (!formData) {
    return <div>Chargement...</div>;
  }

  // 6. Le JSX (HTML) avec la nouvelle structure
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* BARRE D'ACTION EN HAUT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/">&larr; Retour à la liste</Link>
          <h1>{formData.nom}</h1>
          <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px' }}>
            Sauvegarder
          </button>
        </div>

        {/* SÉLECTEUR D'ONGLETS */}
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <button
            type="button" // Empêche le bouton de soumettre le formulaire
            style={activeTab === 'info' ? activeTabStyles : tabStyles}
            onClick={() => setActiveTab('info')}
          >
            Informations Société
          </button>
          <button
            type="button"
            style={activeTab === 'contacts' ? activeTabStyles : tabStyles}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
          {/* Ajoutez d'autres boutons d'onglets ici (ex: Mandats) */}
        </div>

          {/* CONTENU DES ONGLETS */}
          <div>
          {activeTab === 'info' && (
            <SocieteInfo formData={formData} handleChange={handleChange} />
          )}

          {activeTab === 'contacts' && (
            // 2. On passe la NOUVELLE fonction à SocieteContacts
            <SocieteContacts
              societeId={id}
              listVersion={contactListVersion}
              onAddContactClick={handleAddContactClick}
              onEditContactClick={handleEditContactClick}
              onDeleteContactClick={handleDeleteContactClick} // <-- NOUVELLE PROP
            />
          )}
        </div>
      </form>
      {/* 7. On passe le NOUVEL état à la modale */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        societeId={id}
        onSaveSuccess={handleContactSaveSuccess}
        contactToEdit={contactToEdit} // <-- NOUVELLE PROP
      />
    </div>
  );
}

export default SocieteDetailPage;