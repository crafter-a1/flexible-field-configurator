
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Collections from './pages/Collections';
import FieldConfiguration from './pages/FieldConfiguration';
import FieldsShowcase from './pages/FieldsShowcase';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collectionId/fields" element={<FieldConfiguration />} />
        <Route path="/fields-showcase" element={<FieldsShowcase />} />
        <Route path="*" element={<Navigate to="/collections" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
