import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: { xs: 'block', md: 'none' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: '#FFFFFF',
            fontSize: '1.5rem',
          }}
        >
          🏁 Taller Automotriz Pro
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/clientes')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Clientes
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/vehiculos')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Vehículos
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/servicios')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Servicios
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/ordenes')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Órdenes
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/mecanicos')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Mecánicos
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/facturas')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Facturas
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/reportes')}
            sx={{
              borderRadius: 6,
              px: 2,
              py: 1,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Reportes
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;