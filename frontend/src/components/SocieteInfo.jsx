// src/components/SocieteInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function SocieteInfo({ formData, handleChange }) {

  // Style pour les inputs, pour éviter la répétition
  const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box'
  };

  // Style pour les inputs désactivés
  const disabledInputStyle = {
    ...inputStyle,
    background: '#eee'
  };

  // Style pour les séparateurs
  const separatorStyle = {
    gridColumn: '1 / -1', // Prend toute la largeur de la grille
    border: 0,
    borderTop: '1px solid #ddd',
    margin: '15px 0 5px 0'
  };

  return (
    <>
      {/* Grille principale à 3 colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

        {/* --- Section Identification --- */}
        <h4 style={{ gridColumn: '1 / -1', margin: 0 }}>Identification</h4>
        <div>
          <label>Nom de la société:</label>
          <input type="text" name="nom" value={formData.nom || ''} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label>SIREN:</label>
          <input type="text" name="siren" value={formData.siren || ''} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label>Code NAF:</label>
          <input type="text" name="code_naf" value={formData.code_naf || ''} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label>Activité détaillée:</label>
          <textarea name="activite_detaille" value={formData.activite_detaille || ''} onChange={handleChange} style={{...inputStyle, height: '80px', fontFamily: 'inherit'}} />
        </div>

        <div>
          <label>Secteur d'activité:</label>
          <input type="text" name="secteur" value={formData.secteur || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Forme Juridique:</label>
          <input type="text" name="forme_juridique" value={formData.forme_juridique || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Date de création:</label>
          <input type="date" name="date_creation" value={formData.date_creation || ''} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Section Coordonnées --- */}
        <hr style={separatorStyle} />
        <h4 style={{ gridColumn: '1 / -1', margin: 0 }}>Coordonnées</h4>
        <div>
          <label>Adresse:</label>
          <input type="text" name="adresse" value={formData.adresse || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Code Postal:</label>
          <input type="text" name="code_postal" value={formData.code_postal || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Ville:</label>
          <input type="text" name="ville" value={formData.ville || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Région:</label>
          <input type="text" name="region" value={formData.region || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Pays:</label>
          <input type="text" name="pays" value={formData.pays || ''} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Section Contact Standard --- */}
        <hr style={separatorStyle} />
        <h4 style={{ gridColumn: '1 / -1', margin: 0 }}>Contact Standard</h4>
        <div>
          <label>N° Standard:</label>
          <input type="text" name="numero_standard" value={formData.numero_standard || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Email Standard:</label>
          <input type="email" name="email_standard" value={formData.email_standard || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Effectif (précis):</label>
          <input type="number" name="effectif" value={formData.effectif || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Site Web:</label>
          <input type="url" name="site_web" value={formData.site_web || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Page LinkedIn:</label>
          <input type="url" name="lien_linkedin" value={formData.lien_linkedin || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Tranche d'effectif:</label>
          <input type="text" name="effectif_approximatif" value={formData.effectif_approximatif || ''} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Section Données Financières --- */}
        <hr style={separatorStyle} />
        <h4 style={{ gridColumn: '1 / -1', margin: 0 }}>Données Financières</h4>
        <div>
          <label>Dernière année dispo. (ex: 2024):</label>
          <input type="number" name="derniere_annee_disponible" value={formData.derniere_annee_disponible || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Capital Social (€):</label>
          <input type="number" name="capital_social" value={formData.capital_social || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Capitaux Propres (€):</label>
          <input type="number" name="capitaux_propres" value={formData.capitaux_propres || ''} onChange={handleChange} style={inputStyle} />
        </div>

        {/* Année N */}
        <div>
          <label>Chiffre d'affaires N (€):</label>
          <input type="number" name="ca_n" value={formData.ca_n || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat d'exploitation N (€):</label>
          <input type="number" name="resultat_exploitation_n" value={formData.resultat_exploitation_n || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat net N (€):</label>
          <input type="number" name="resultat_net_n" value={formData.resultat_net_n || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>EBITDA N (€):</label>
          <input type="number" name="ebitda_n" value={formData.ebitda_n || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div />
        <div />

        {/* Année N-1 */}
        <div>
          <label>Chiffre d'affaires N-1 (€):</label>
          <input type="number" name="ca_n1" value={formData.ca_n1 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat d'exploitation N-1 (€):</label>
          <input type="number" name="resultat_exploitation_n1" value={formData.resultat_exploitation_n1 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat net N-1 (€):</label>
          <input type="number" name="resultat_net_n1" value={formData.resultat_net_n1 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>EBITDA N-1 (€):</label>
          <input type="number" name="ebitda_n1" value={formData.ebitda_n1 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div />
        <div />

        {/* Année N-2 */}
        <div>
          <label>Chiffre d'affaires N-2 (€):</label>
          <input type="number" name="ca_n2" value={formData.ca_n2 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat d'exploitation N-2 (€):</label>
          <input type="number" name="resultat_exploitation_n2" value={formData.resultat_exploitation_n2 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>Résultat net N-2 (€):</label>
          <input type="number" name="resultat_net_n2" value={formData.resultat_net_n2 || ''} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label>EBITDA N-2 (€):</label>
          <input type="number" name="ebitda_n2" value={formData.ebitda_n2 || ''} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Section Groupe / Filiales --- */}
        <hr style={separatorStyle} />
        <h4 style={{ gridColumn: '1 / -1', margin: 0 }}>Groupe</h4>
        <div>
          <label>Maison Mère (Nom) :</label>
          <input
            type="text"
            name="maison_mere_nom"
            value={formData.maison_mere_nom || ''}
            disabled
            style={disabledInputStyle}
          />
        </div>
        <div>
          <label>Modifier Maison Mère (par ID) :</label>
          <input
            type="number"
            name="maison_mere"
            value={formData.maison_mere || ''}
            onChange={handleChange}
            placeholder="Entrer l'ID de la société mère"
            style={inputStyle}
          />
        </div>

      </div>

      {/* --- Section Filiales (en dehors de la grille) --- */}
      <div style={{ marginTop: '30px' }}>
        <h3>Filiales</h3>
        {formData.filiales && formData.filiales.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {formData.filiales.map(filiale => (
              <li key={filiale.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '5px' }}>
                <Link to={`/societes/${filiale.id}`}>
                  {filiale.nom} (ID: {filiale.id})
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Cette société n'a pas de filiales enregistrées.</p>
        )}
      </div>
    </>
  );
}

export default SocieteInfo;