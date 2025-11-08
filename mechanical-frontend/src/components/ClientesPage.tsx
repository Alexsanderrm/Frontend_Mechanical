import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { clientesService, type Cliente, type CrearClienteDTO } from '../services/clientesService';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CrearClienteDTO>({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefonos: [{ numero: '', tipo: 'CELULAR' }],
    direccion: '',
    barrio: '',
    ciudad: '',
    departamento: '',
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      // Por ahora usamos datos mock ya que no tenemos endpoint para listar todos
      setClientes([]);
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      email: '',
      telefonos: [{ numero: '', tipo: 'CELULAR' }],
      direccion: '',
      barrio: '',
      ciudad: '',
      departamento: '',
    });
  };

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!formData.nombre1 || !formData.apellido1 || !formData.email) {
        alert('Por favor completa los campos obligatorios (Primer Nombre, Primer Apellido, Email)');
        return;
      }

      console.log('Enviando datos del cliente:', formData);
      const response = await clientesService.crearCliente(formData);
      console.log('Respuesta del servidor:', response);
      
      if (response.error) {
        throw new Error(response.mensaje);
      }
      
      handleCloseDialog();
      loadClientes();
      alert('Cliente creado exitosamente');
    } catch (error) {
      console.error('Error creating cliente:', error);
      alert('Error al crear el cliente: ' + (error as any)?.message || 'Error desconocido');
    }
  };

  const handleEditar = (cliente: Cliente) => {
    // TODO: Implementar edición
    console.log('Editar cliente:', cliente);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesService.eliminarCliente(id);
        loadClientes();
      } catch (error) {
        console.error('Error deleting cliente:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1" sx={{
          background: 'linear-gradient(45deg, #8B5CF6 30%, #A855F7 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        }}>
          Gestión de Clientes
        </Typography>
        <Button
          variant="outlined"
          onClick={handleOpenDialog}
          sx={{
            borderColor: '#8B5CF6',
            color: '#8B5CF6',
            borderWidth: 2,
            fontWeight: 600,
            px: 3,
            '&:hover': {
              borderColor: '#A855F7',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Tabla simple */}
      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#A1A1AA' }}>
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell sx={{ color: '#FFFFFF' }}>{cliente.id}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>
                    {`${cliente.nombre1} ${cliente.apellido1}`}
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{cliente.email}</TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>
                    {cliente.telefonos[0]?.numero || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#FFFFFF' }}>{cliente.direccion.ciudad}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditar(cliente)}
                      sx={{
                        color: '#8B5CF6',
                        border: '1px solid #8B5CF6',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                        }
                      }}
                    >
                      ⚡ Editar
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleEliminar(cliente.id)}
                      sx={{
                        color: '#A855F7',
                        border: '1px solid #A855F7',
                        '&:hover': {
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                        }
                      }}
                    >
                      💥 Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Primer Nombre"
                value={formData.nombre1}
                onChange={(e) => handleInputChange('nombre1', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Segundo Nombre"
                value={formData.nombre2}
                onChange={(e) => handleInputChange('nombre2', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Primer Apellido"
                value={formData.apellido1}
                onChange={(e) => handleInputChange('apellido1', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Segundo Apellido"
                value={formData.apellido2}
                onChange={(e) => handleInputChange('apellido2', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefonos[0].numero}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  telefonos: [{ ...prev.telefonos[0], numero: e.target.value }],
                }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Barrio"
                value={formData.barrio}
                onChange={(e) => handleInputChange('barrio', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => handleInputChange('ciudad', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={formData.departamento}
                onChange={(e) => handleInputChange('departamento', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesPage;