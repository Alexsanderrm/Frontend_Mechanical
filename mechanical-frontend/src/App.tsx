import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ClientesPage from './components/ClientesPage';
import OrdenesPage from './components/OrdenesPage';
import VehiculosPage from './components/VehiculosPage';
import MecanicosPage from './components/MecanicosPage';
import FacturasPage from './components/FacturasPage';
import ReportesPage from './components/ReportesPage';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#42628C', // Azul medio para botones y acentos
    },
    secondary: {
      main: '#253C59', // Azul medio oscuro para fondos alternativos
    },
    background: {
      default: '#F2F2F2', // Blanco grisáceo como fondo principal
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0D0D0D', // Negro suave para texto principal
      secondary: '#42628C',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Montserrat", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      color: '#1A2A40', // Azul oscuro para encabezados
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#1A2A40',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1A2A40',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#1A2A40',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1A2A40',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1A2A40',
    },
    body1: {
      fontSize: '1rem',
      color: '#0D0D0D',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      color: '#42628C',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A2A40', // Azul oscuro para navbar
          color: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(26, 42, 64, 0.3)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            transform: 'translateY(-1px)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
            '& .MuiTableCell-root': {
              color: '#1e293b',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#374151',
            borderBottom: '2px solid #e2e8f0',
            transition: 'all 0.2s ease',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#F2F2F2',
          overflow: 'auto',
        }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <Dashboard />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/clientes" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <ClientesPage />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/ordenes" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <OrdenesPage />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/vehiculos" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <VehiculosPage />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/mecanicos" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <MecanicosPage />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/facturas" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <FacturasPage />
                  </Container>
                </Box>
              </>
            } />
            <Route path="/reportes" element={
              <>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{
                  minHeight: '100vh',
                  backgroundColor: '#F2F2F2',
                  pt: '80px',
                }}>
                  <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
                    <ReportesPage />
                  </Container>
                </Box>
              </>
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
