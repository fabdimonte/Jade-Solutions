// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocieteListPage from './pages/SocieteListPage';
import SocieteDetailPage from './pages/SocieteDetailPage';
import SocieteCreatePage from './pages/SocieteCreatePage';
import './App.css';

function App() {
  return (
    // On "enveloppe" toute l'application dans le BrowserRouter
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>Mon CRM M&A</h1>
        </header>
        <main>
          {/* Routes définit les différentes "pages" de notre app */}
          <Routes>
            <Route path="/" element={<SocieteListPage />} />
            <Route path="/societes/nouveau" element={<SocieteCreatePage />} />
            <Route path="/societes/:id" element={<SocieteDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;