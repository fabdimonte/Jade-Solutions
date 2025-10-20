// src/pages/SocieteListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- IMPORTER Link

function SocieteListPage() {
  const [societes, setSocietes] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/societes/')
      .then(response => response.json())
      .then(data => setSocietes(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

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