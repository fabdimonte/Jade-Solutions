// src/pages/SocieteListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; //
import { fetchGetData } from '../apiClient';

function SocieteListPage({ authToken }) {
  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchGetData('/societes/', authToken)
      .then(data => {
        setSocietes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, [authToken]);

  return (
    <div>
      <h2>Liste des Sociétés</h2>

      <div style={{ marginBottom: '20px' }}>
        <Link to="/societes/nouveau">
          <button>+ Ajouter une société</button>
        </Link>
      </div>

      <ul>
        {societes.map(societe => (
          // On transforme le <li> en un lien qui pointe vers la page de détail
          <li key={societe.id}>
            <Link to={`/societes/${societe.id}`}>
              {societe.nom} (SIREN: {societe.siren})
            </Link>
          </li>
        ))}
      </ul>
      {societes.length === 0 && <p>Aucune société trouvée.</p>}
    </div>
  );
}

export default SocieteListPage;