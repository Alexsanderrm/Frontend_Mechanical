import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Clientes',
      icon: <PeopleIcon />,
      path: '/clientes',
    },
    {
      text: 'Vehículos',
      icon: <CarIcon />,
      path: '/vehiculos',
    },
    {
      text: 'Proveedores',
      icon: <BusinessIcon />,
      path: '/proveedores',
    },
    {
      text: 'Repuestos',
      icon: <InventoryIcon />,
      path: '/repuestos',
    },
    {
      text: 'Servicios',
      icon: <SettingsIcon />,
      path: '/servicios',
    },
    {
      text: 'Órdenes',
      icon: <BuildIcon />,
      path: '/ordenes',
    },
    {
      text: 'Mecánicos',
      icon: <EngineeringIcon />,
      path: '/mecanicos',
    },
    {
      text: 'Facturas',
      icon: <ReceiptIcon />,
      path: '/facturas',
    },
    {
      text: 'Reportes',
      icon: <AssessmentIcon />,
      path: '/reportes',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleGoHome = () => {
    navigate('/');
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          background: 'linear-gradient(180deg, #1A2A40 0%, #253C59 100%)',
          color: 'white',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            mb: 1,
          }}
        >
          🏁 Taller Pro
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#E2E8F0',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          Sistema de Gestión
        </Typography>
      </Box>

      <List sx={{ pt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleGoHome}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Inicio"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 2,
                mb: 0.5,
                borderRadius: 2,
                backgroundColor: location.pathname === item.path
                  ? 'rgba(66, 98, 140, 0.2)'
                  : 'transparent',
                border: location.pathname === item.path
                  ? '1px solid rgba(66, 98, 140, 0.3)'
                  : 'none',
                '&:hover': {
                  backgroundColor: location.pathname === item.path
                    ? 'rgba(66, 98, 140, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#42628C' : 'white',
                  minWidth: 40,
                  transition: 'color 0.2s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  color: location.pathname === item.path ? '#42628C' : 'white',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#E2E8F0',
            textAlign: 'center',
            opacity: 0.7,
            fontSize: '0.8rem',
          }}
        >
          © 2024 Taller Automotriz Pro
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;