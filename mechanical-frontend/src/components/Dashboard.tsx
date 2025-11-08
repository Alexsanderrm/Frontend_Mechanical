import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { ordenesService, type Orden } from '../services/ordenesService';

const Dashboard: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    estado: 'PENDIENTE',
    prioridad: 'MEDIA',
    clienteId: '',
    vehiculoId: '',
  });

  const stats = [
    { title: 'Clientes', value: '150', icon: <PeopleIcon />, color: '#42628C' },
    { title: 'Vehículos', value: '200', icon: <CarIcon />, color: '#059669' },
    { title: 'Órdenes Activas', value: ordenes.filter(o => o.estado === 'EN_PROCESO').length.toString(), icon: <BuildIcon />, color: '#dc2626' },
    { title: 'Facturas del Mes', value: '85', icon: <ReceiptIcon />, color: '#7c3aed' },
  ];

  useEffect(() => {
    loadOrdenes();
  }, []);

  const loadOrdenes = async () => {
    try {
      // Por ahora usamos datos mock ya que no tenemos endpoint para listar todas las órdenes
      setOrdenes([
        {
          id: '1',
          descripcion: 'Cambio de aceite y filtros',
          estado: 'EN_PROCESO',
          prioridad: 'MEDIA',
          fechaCreacion: '2024-01-15',
          fechaActualizacion: '2024-01-15',
          cliente: { id: '1', nombre1: 'Juan', apellido1: 'Pérez' },
          vehiculo: { id: '1', placa: 'ABC123', marca: 'Toyota', modelo: 'Corolla' },
          mecanicos: [],
          servicios: [],
        },
        {
          id: '2',
          descripcion: 'Reparación de frenos',
          estado: 'PENDIENTE',
          prioridad: 'ALTA',
          fechaCreacion: '2024-01-14',
          fechaActualizacion: '2024-01-14',
          cliente: { id: '2', nombre1: 'María', apellido1: 'González' },
          vehiculo: { id: '2', placa: 'XYZ789', marca: 'Honda', modelo: 'Civic' },
          mecanicos: [],
          servicios: [],
        },
      ]);
    } catch (error) {
      console.error('Error loading ordenes:', error);
    }
  };

  return (
    <div style={{ width: '100%', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <h1 style={{
        marginBottom: '32px',
        fontWeight: 'bold',
        color: '#1A2A40',
        fontSize: '2.5rem',
        margin: 0
      }}>
        Panel de Control - Taller Mecánico
      </h1>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {stat.title}
                </div>
                <div style={{
                  fontWeight: 'bold',
                  color: stat.color,
                  fontSize: '2rem',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
              </div>
              <div style={{
                color: stat.color,
                fontSize: '2rem'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Órdenes Recientes */}
      <Box sx={{ mt: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" sx={{ color: '#1A2A40', fontWeight: 600 }}>
            Órdenes Recientes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: '#42628C',
              '&:hover': {
                backgroundColor: '#253C59',
              },
            }}
          >
            Nueva Orden
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Vehículo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.slice(0, 5).map((orden) => (
                <TableRow key={orden.id} hover>
                  <TableCell>{orden.id}</TableCell>
                  <TableCell>{orden.descripcion}</TableCell>
                  <TableCell>{orden.idCliente || 'Cliente'}</TableCell>
                  <TableCell>{orden.idVehiculo || 'Vehículo'}</TableCell>
                  <TableCell>
                    <Chip
                      label={orden.estado}
                      size="small"
                      sx={{
                        backgroundColor: orden.estado === 'EN_PROCESO' ? '#dc2626' :
                                        orden.estado === 'COMPLETADA' ? '#059669' : '#f59e0b',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} sx={{ mr: 1 }}>
                      Editar
                    </Button>
                    <Button size="small" startIcon={<DeleteIcon />} color="error">
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal para Nueva Orden - Temporarily removed for modern design */}

    </div>
  );
};

export default Dashboard;