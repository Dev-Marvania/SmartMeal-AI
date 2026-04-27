/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProfileSetup } from './pages/ProfileSetup';
import { Profile } from './pages/Profile';
import { Stats } from './pages/Stats';
import { useProfile } from './hooks/useProfile';

export default function App() {
  const { profile } = useProfile();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={!profile ? <ProfileSetup /> : <Navigate to="/" />} />
        <Route element={profile ? <Layout /> : <Navigate to="/setup" />}>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/log" element={<div className="p-8 text-center text-on-surface-variant text-lg">Log is coming soon!</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
