// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import GameLobby   from "./components/GameLobby";
import SlotsPage   from "./components/SlotsPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* public */}
        <Route path="/"        element={<LoginForm />} />
        <Route path="/login"   element={<LoginForm />} />
        <Route path="/register"element={<RegisterForm />} />

        {/* protected */}
        <Route path="/lobby"   element={
            <PrivateRoute><GameLobby /></PrivateRoute>
        }/>
        <Route path="/game/slots" element={
            <PrivateRoute><SlotsPage /></PrivateRoute>
        }/>
        {/* placeholder for future games */}
        <Route path="/game/roulette" element={
            <PrivateRoute><h2>Roulette coming soon…</h2></PrivateRoute>
        }/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
