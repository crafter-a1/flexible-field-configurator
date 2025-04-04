
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Collections from './pages/Collections';
import FieldConfiguration from './pages/FieldConfiguration';
import FieldsShowcase from './pages/FieldsShowcase';
import Dashboard from './pages/Dashboard';
import Components from './pages/Components';
import Content from './pages/Content';
import Api from './pages/Api';
import Users from './pages/Users';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collectionId/fields" element={<FieldConfiguration />} />
        <Route path="/fields-showcase" element={<FieldsShowcase />} />
        <Route path="/components" element={<Components />} />
        <Route path="/content" element={<Content />} />
        <Route path="/api" element={<Api />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
