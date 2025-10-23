// src/pages/MandatDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import MandatInfo from '../components/MandatInfo'; // <--- Importer
import MandatContreparties from '../components/MandatContreparties'; // <--- Importer

function MandatDetailPage() {
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info' par défaut
  const { id } = useParams();

  // On met le fetch dans une fonction "useCallback" pour pouvoir l'appeler
  const fetchMandatData = useCallback(() => {
    fetch(`http://127.0.0.1:8000/api/mandats/${id}/`)
      .then(response => {
        if (!response.ok) throw new Error('Mandat non trouvé');
        return response.json();
      })
      .then(data => setFormData(data))
      .catch(error => console.error('Erreur:', error));
  }, [id]);

  // Appeler la fonction au chargement
  useEffect(() => {
    fetchMandatData();
  }, [fetchMandatData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Sauvegarde UNIQUEMENT les infos de l'onglet "Informations"
  const handleSubmitInfo = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/mandats/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => response.ok ? response.json() : Promise.reject('Erreur sauvegarde'))
    .then(data => {
      setFormData(data); // Re-synchroniser l'état
      alert('Modifications sauvegardées !');
    })
    .catch(error => alert("Erreur lors de la mise à jour."));
  };

  // Styles pour les onglets
  const tabStyles = {
    padding: '10px 15px', cursor: 'pointer', border: '1px solid #ccc',
    borderBottom: 'none', backgroundColor: '#f1f1f1', color: '#000',
  };
  const activeTabStyles = {
    ...tabStyles, backgroundColor: 'white', borderBottom: '1px solid white',
    position: 'relative', top: '1px'
  };

  if (!formData) {
    return <div>Chargement des détails du mandat...</div>;
  }

  return (
    <div> {/* On n'a plus besoin d'un seul grand <form> */}

      {/* Barre d'action en haut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/">&larr; Retour à la liste des sociétés</Link>
        <h1>Mandat : {formData.nom_mandat || ''}</h1>
        {/* Le bouton Sauvegarder n'est visible que sur l'onglet 'info' */}
        {activeTab === 'info' && (
          <button
            type="button"
            onClick={handleSubmitInfo}
            style={{ backgroundColor: 'blue', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px' }}
          >
            Sauvegarder les infos
          </button>
        )}
      </div>

      {/* SÉLECTEUR D'ONGLETS */}
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <button type="button" style={activeTab === 'info' ? activeTabStyles : tabStyles} onClick={() => setActiveTab('info')}>
          Informations
        </button>
        <button type="button" style={activeTab === 'acheteurs' ? activeTabStyles : tabStyles} onClick={() => setActiveTab('acheteurs')}>
          Acheteurs Potentiels
        </button>
        <button type="button" style={activeTab === 'cedants' ? activeTabStyles : tabStyles} onClick={() => setActiveTab('cedants')}>
          Cédants Potentiels
        </button>
      </div>

      {/* CONTENU DES ONGLETS */}
      <div>
        {activeTab === 'info' && (
          // Le formulaire est maintenant dans son propre composant
          // On le met dans un <form> pour que le 'submit' fonctionne
          <form onSubmit={handleSubmitInfo}>
            <MandatInfo formData={formData} handleChange={handleChange} />
          </form>
        )}

        {activeTab === 'acheteurs' && (
          <MandatContreparties
            titre="Acheteurs Potentiels"
            listeSocietes={formData.acheteurs_potentiels}
            mandatId={id}
            typeAction="acheteur"
            onUpdate={fetchMandatData} // On passe la fonction de refresh !
          />
        )}

        {activeTab === 'cedants' && (
          <MandatContreparties
            titre="Cédants Potentiels"
            listeSocietes={formData.cedants_potentiels}
            mandatId={id}
            typeAction="cedant"
            onUpdate={fetchMandatData} // On passe la fonction de refresh !
          />
        )}
      </div>
    </div>
  );
}

export default MandatDetailPage;