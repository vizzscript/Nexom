import { ROUTES } from '@/constants';
import { AuthProvider } from '@/features/auth';
import { BookService } from '@/features/booking';
import { MainLayout } from '@/layouts';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Notifications from '@/pages/Notifications';
import Payment from '@/pages/Payment';
import Services from '@/pages/Services';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#0f172a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <MainLayout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SERVICES} element={<Services />} />
            <Route path={ROUTES.BOOK} element={<BookService />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PAYMENT} element={<Payment />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
