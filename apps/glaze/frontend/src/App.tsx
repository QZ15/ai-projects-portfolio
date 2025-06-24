import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GlazeCreatorPage from './pages/GlazeCreatorPage.tsx';
import SlipCreatorPage from './pages/SlipCreatorPage.tsx';
import LibraryPage from './pages/LibraryPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import "./styles/global.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/glaze-creator" element={<GlazeCreatorPage />} />
      <Route path="/slip-creator" element={<SlipCreatorPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
