// src/components/SocieteInfo.jsx
import React from 'react';

function SocieteInfo({ formData, handleChange }) {

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <label>Nom de la société:</label>
        <input
          type="text"
          name="nom"
          value={formData.nom || ''} // <--- MODIFIÉ
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label>SIREN:</label>
        <input
          type="text"
          name="siren"
          value={formData.siren || ''} // <--- MODIFIÉ
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label>Secteur:</label>
        <input
          type="text"
          name="secteur"
          value={formData.secteur || ''} // <--- MODIFIÉ
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label>Adresse:</label>
        <input
          type="text"
          name="adresse"
          value={formData.adresse || ''} // <--- MODIFIÉ
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label>Chiffre d'affaires N (€):</label>
        <input
          type="number"
          name="ca_n"
          value={formData.ca_n || ''} // <--- MODIFIÉ
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label>EBITDA N (€):</label>
        <input
          type="number"
          name="ebitda_n"
          value={formData.ebitda_n || ''} // <--- MODIFIÉ
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
}

export default SocieteInfo;