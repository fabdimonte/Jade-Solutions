// src/pages/SocieteDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SocieteInfo from '../components/SocieteInfo';
import SocieteContacts from '../components/SocieteContacts';
import ContactFormModal from '../components/ContactFormModal';
import SocieteMandats from '../components/SocieteMandats';
import MandatFormModal from '../components/MandatFormModal';

function SocieteDetailPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // --- États pour la modale Contact (inchangés) ---
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactListVersion, setContactListVersion] = useState(0);
  const [contactToEdit, setContactToEdit] = useState(null);

  // 2. NOUVEAUX ÉTATS : pour la modale Mandat
  const [isMandatModalOpen, setIsMandatModalOpen] = useState(false);
  const [mandatListVersion, setMandatListVersion] = useState(0);
  const [mandatToEdit, setMandatToEdit] = useState(null); // Pour la modification plus tard

  // 2. Le useEffect va chercher les données de la société
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/societes/${id}/`)
      .then(response => response.json())
      .then(data => setFormData(data))
      .catch(error => console.error('Erreur fetch:', error));
  }, [id]);

  // 3. Le handleChange met à jour le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // 4. Le handleSubmit sauvegarde le formulaire
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
    setIsContactModalOpen(false); // Ferme la modale
    setContactToEdit(null); // RAZ du contact à modifier
  };

  // 3. pour ouvrir la modale en mode "Création"
  const handleAddContactClick = () => {
    setContactToEdit(null); // S'assurer qu'on est en mode création
    setIsContactModalOpen(true);
  };

  // 4. pour ouvrir la modale en mode "Modification"
  const handleEditContactClick = (contact) => {
    setContactToEdit(contact); // Définir le contact à modifier
    setIsContactModalOpen(true);      // Ouvrir la modale
  };

  // 5. pour gérer la fermeture de contact
  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setContactToEdit(null);
  };

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

  const handleMandatSaveSuccess = () => {
    setMandatListVersion(v => v + 1); // Rafraîchit la liste des mandats
    setIsMandatModalOpen(false);
    setMandatToEdit(null);
  };

  const handleAddMandatClick = () => {
    setMandatToEdit(null); // On est en mode création
    setIsMandatModalOpen(true);
  };

  const handleCloseMandatModal = () => {
    setIsMandatModalOpen(false);
    setMandatToEdit(null);
  };

  const handleEditMandatClick = (mandat) => {
  setMandatToEdit(mandat); // On définit le mandat à modifier
  setIsMandatModalOpen(true);  // On ouvre la modale
  };

  const handleDeleteMandatClick = (mandatId) => {
    // On demande confirmation pour éviter les accidents
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce mandat ?")) {
      fetch(`http://127.0.0.1:8000/api/mandats/${mandatId}/`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) { // 'ok' couvre les statuts 200-299. DELETE renvoie souvent 204 No Content
          alert('Mandat supprimé.');
          setMandatListVersion(v => v + 1); // On force le rafraîchissement de la liste
        } else {
          alert('Erreur lors de la suppression du mandat.');
        }
      })
      .catch(error => console.error("Erreur API:", error));
    }
  };

  // 5. NOUVELLE FONCTION : pour gérer la suppression


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

          <button
            type="button"
            style={activeTab === 'mandats' ? activeTabStyles : tabStyles}
            onClick={() => setActiveTab('mandats')}
          >
            Mandats
          </button>
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
          {activeTab === 'mandats' && (
            // 4. On passe les nouvelles props à SocieteMandats
            <SocieteMandats
              societeId={id}
              listVersion={mandatListVersion}
              onAddMandatClick={handleAddMandatClick}
              onEditMandatClick={handleEditMandatClick}
              onDeleteMandatClick={handleDeleteMandatClick}
            />
          )}
        </div>
      </form>
      {/* 7. On passe le NOUVEL état à la modale */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        societeId={id}
        onSaveSuccess={handleContactSaveSuccess}
        contactToEdit={contactToEdit} // <-- NOUVELLE PROP
      />
      {/* 5. On ajoute la nouvelle modale des mandats (qui est vide pour l'instant) */}
      <MandatFormModal
        isOpen={isMandatModalOpen}
        onClose={handleCloseMandatModal}
        societeId={id} // On passe l'ID de la société pour l'auto-associer
        onSaveSuccess={handleMandatSaveSuccess}
        mandatToEdit={mandatToEdit}
      />
    </div>
  );
}

export default SocieteDetailPage;