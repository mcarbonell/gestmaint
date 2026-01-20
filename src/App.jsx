import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import IncidentsPage from './pages/Incidents/IncidentsPage';
import IncidentForm from './components/incidents/IncidentForm';
import IncidentDetail from './pages/Incidents/IncidentDetail';
import ContactsPage from './pages/Contacts/ContactsPage';
import UserManagement from './pages/Admin/UserManagement';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />

        <Route path="incidents" element={<IncidentsPage />} />
        <Route path="incidents/new" element={<IncidentForm />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
        <Route path="my-incidents" element={<Navigate to="/incidents" replace />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<div className="card">Configuración (Próximamente)</div>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
