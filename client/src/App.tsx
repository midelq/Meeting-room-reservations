import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomDetailPage } from './pages/RoomDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/rooms" replace />} />
              <Route path="/rooms" element={<DashboardPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1c1916',
              color: '#f0e8df',
              border: '1px solid #3a2f29',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              maxWidth: '340px',
            },
            success: {
              iconTheme: { primary: '#f0a84a', secondary: '#1c1916' },
            },
            error: {
              iconTheme: { primary: '#e05c5c', secondary: '#1c1916' },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
