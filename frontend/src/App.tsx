import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import PersonaPage from './pages/PersonaPage';
import RestPage from './pages/RestPage';
import MealPage from './pages/MealPage';
import WeatherPage from './pages/WeatherPage';
import HealthTipPage from './pages/HealthTipPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="persona" element={<PersonaPage />} />
          <Route path="rest" element={<RestPage />} />
          <Route path="meal" element={<MealPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="health-tip" element={<HealthTipPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;






