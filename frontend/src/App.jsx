// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SocieteListPage from './pages/SocieteListPage';
import SocieteDetailPage from './pages/SocieteDetailPage';
import SocieteCreatePage from './pages/SocieteCreatePage';
import MandatDetailPage from './pages/MandatDetailPage';
import GroupeListPage from './pages/GroupeListPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          {/* On modifie le header pour inclure des liens */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <h1>Mon CRM M&A</h1>
            <nav>
              <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Sociétés</Link>
              <Link to="/groupes" style={{ color: 'white' }}>Groupes</Link>
              {/* Plus tard, on ajoutera un lien "Pipeline Mandats" */}
            </nav>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SocieteListPage />} />
            <Route path="/societes/nouveau" element={<SocieteCreatePage />} />
            <Route path="/societes/:id" element={<SocieteDetailPage />} />
            <Route path="/mandats/:id" element={<MandatDetailPage />} />
            <Route path="/groupes" element={<GroupeListPage />} /> {/* <-- VOTRE NOUVELLE ROUTE */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;