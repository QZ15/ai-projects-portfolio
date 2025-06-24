import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DevHub from './components/DevHub'; // Placeholder, create this later
import Resume360 from './components/Resume360'; // Placeholder, create this later
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/devhub" element={<DevHub />} />
        <Route path="/resume360" element={<Resume360 />} />
      </Routes>
    </Router>
  );
};

export default App;

