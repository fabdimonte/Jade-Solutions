// src/components/MandatInfo.jsx
import React from 'react';
import { fetchGetData } from '../apiClient';

// Ce composant "bête" ne fait qu'afficher le formulaire
function MandatInfo({ formData, handleChange, authToken }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label>Nom du mandat:</label>
        <input
          type="text"
          name="nom_mandat"
          value={formData.nom_mandat || ''}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label>Client :</label>
        <input
          type="text"
          name="client_nom"
          value={formData.client_nom || ''}
          disabled
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', background: '#eee' }}
        />
      </div>

      <div>
        <label>Type de mandat:</label>
        <select name="type_mandat" value={formData.type_mandat || 'SELL'} onChange={handleChange} style={{width: '100%', padding: '8px'}}>
          <option value="SELL">Sell-Side (Cession)</option>
          <option value="BUY">Buy-Side (Acquisition)</option>
          <option value="FUND">Levée de fonds</option>
          <option value="AUTRE">Autre</option>
        </select>
      </div>

      <div>
        <label>Statut:</label>
        <select name="statut" value={formData.statut || 'PROSP'} onChange={handleChange} style={{width: '100%', padding: '8px'}}>
          <option value="PROSP">Prospection</option>
          <option value="EN_COURS">En cours</option>
          <option value="CLOSING">En closing</option>
          <option value="TERMINE">Terminé</option>
          <option value="ABANDONNE">Abandonné</option>
        </select>
      </div>

      <div>
        <label>Phase:</label>
        <select name="phase" value={formData.phase || ''} onChange={handleChange} style={{width: '100%', padding: '8px'}}>
          <option value="">(Aucune)</option>
          <option value="PREPA">Préparation (Teaser, IM)</option>
          <option value="MARKET">Phase de marketing</option>
          <option value="NEGO">Négociation (LOI)</option>
          <option value="DUE_DIL">Due Diligence</option>
          <option value="SIGN">Signature (SPA)</option>
        </select>
      </div>

      <div>
        <label>Valorisation estimée (€):</label>
        <input
          type="number"
          name="valorisation_estimee"
          value={formData.valorisation_estimee || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label>Honoraires estimés (€):</label>
        <input
          type="number"
          name="honoraires_estimes"
          value={formData.honoraires_estimes || ''}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
}

export default MandatInfo;