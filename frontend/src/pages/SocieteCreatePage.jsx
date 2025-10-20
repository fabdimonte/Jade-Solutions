// src/pages/SocieteCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Hook pour la redirection

function SocieteCreatePage() {
  // 1. Un "état" pour chaque champ de notre formulaire
  const [nom, setNom] = useState('');
  const [siren, setSiren] = useState('');
  const [secteur, setSecteur] = useState('');
  // (On ne met que 3 champs pour l'exemple, vous pourrez ajouter les autres)

  // 2. On récupère la fonction 'navigate' pour rediriger l'utilisateur
  const navigate = useNavigate();

  // 3. La fonction qui s'exécute quand on valide le formulaire
  const handleSubmit = (e) => {
    // Empêche le navigateur de recharger la page (comportement par défaut)
    e.preventDefault();

    // 4. On rassemble les données du formulaire dans un objet
    const nouvelleSociete = {
      nom: nom,
      siren: siren,
      secteur: secteur,
      // Note : Le backend s'attend à tous les champs.
      // Si des champs (ex: CA, EBITDA) ne sont pas envoyés,
      // ils seront 'null' si `null=True, blank=True` a été défini dans le modèle Django.
    };

    // 5. On fait l'appel API, mais cette fois en 'POST'
    fetch('http://127.0.0.1:8000/api/societes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // On dit à l'API qu'on envoie du JSON
      },
      body: JSON.stringify(nouvelleSociete), // On convertit notre objet JS en chaîne JSON
    })
    .then(response => {
      if (response.ok) {
        // 6. Si la création a réussi, on redirige vers la page de liste
        navigate('/');
      } else {
        // Gérer les erreurs, par exemple un SIREN qui existe déjà
        alert("Erreur lors de la création de la société.");
      }
    })
    .catch(error => console.error("Erreur API:", error));
  };

  // 7. Le JSX (HTML) du formulaire
  return (
    <div>
      <h2>Créer une nouvelle société</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nom de la société:
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)} // Met à jour l'état 'nom' à chaque frappe
              required
            />
          </label>
        </div>
        <div>
          <label>
            SIREN:
            <input
              type="text"
              value={siren}
              onChange={e => setSiren(e.target.value)} // Met à jour l'état 'siren'
              required
              minLength={9}
              maxLength={9}
            />
          </label>
        </div>
        <div>
          <label>
            Secteur:
            <input
              type="text"
              value={secteur}
              onChange={e => setSecteur(e.target.value)} // Met à jour l'état 'secteur'
            />
          </label>
        </div>

        {/* Vous pouvez ajouter les autres champs ici en suivant le même modèle */}

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default SocieteCreatePage;