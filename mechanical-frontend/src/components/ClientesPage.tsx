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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Phone as PhoneIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { clientesService, type Cliente, type CrearClienteDTO } from '../services/clientesService';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CrearClienteDTO>({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefonos: [],
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
      const response = await clientesService.obtenerClientes();
      if (response.error) {
        throw new Error('Error al obtener clientes');
      }
      setClientes(response.mensaje);
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData(prev => ({
      ...prev,
      telefonos: [{ numero: '', tipo: 'CELULAR' }],
    }));
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      email: '',
      telefonos: [],
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

      // Validar que haya al menos un teléfono válido
      const telefonosValidos = formData.telefonos.filter(tel => tel.numero.trim() !== '');
      if (telefonosValidos.length === 0) {
        alert('Por favor agrega al menos un teléfono válido');
        return;
      }

      // Usar todos los teléfonos (vacíos serán ignorados por el backend)
      const formDataToSend = {
        ...formData,
      };

      console.log('Enviando datos del cliente:', formDataToSend);

      let response;
      if (isEditing && editingId) {
        response = await clientesService.actualizarCliente(editingId, formDataToSend);
      } else {
        response = await clientesService.crearCliente(formDataToSend);
      }

      console.log('Respuesta del servidor:', response);

      if (response.error) {
        throw new Error(response.mensaje);
      }

      handleCloseDialog();
      loadClientes();
      alert(isEditing ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
    } catch (error) {
      console.error('Error saving cliente:', error);
      alert('Error al guardar el cliente: ' + (error as any)?.message || 'Error desconocido');
    }
  };

  const handleEditar = async (cliente: Cliente) => {
    try {
      const response = await clientesService.obtenerCliente(cliente.id);
      if (response.error) {
        throw new Error('Error al obtener cliente');
      }
      const clienteData = response.mensaje;
      setFormData({
        nombre1: clienteData.nombre1,
        nombre2: clienteData.nombre2 || '',
        apellido1: clienteData.apellido1,
        apellido2: clienteData.apellido2 || '',
        email: clienteData.email,
        telefonos: clienteData.telefonos.length > 0 ? clienteData.telefonos : [{ numero: '', tipo: 'CELULAR' }],
        direccion: clienteData.direccion,
        barrio: clienteData.barrio,
        ciudad: clienteData.ciudad,
        departamento: clienteData.departamento,
      });
      setIsEditing(true);
      setEditingId(cliente.id);
      setOpen(true);
    } catch (error) {
      console.error('Error loading cliente for edit:', error);
      alert('Error al cargar datos del cliente para editar');
    }
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

  const handleAddTelefono = () => {
    setFormData(prev => ({
      ...prev,
      telefonos: [...prev.telefonos, { numero: '', tipo: 'CELULAR' }],
    }));
  };

  const handleRemoveTelefono = (index: number) => {
    setFormData(prev => ({
      ...prev,
      telefonos: prev.telefonos.filter((_, i) => i !== index),
    }));
  };

  const handleTelefonoChange = (index: number, field: 'numero' | 'tipo', value: string) => {
    setFormData(prev => ({
      ...prev,
      telefonos: prev.telefonos.map((tel, i) =>
        i === index ? { ...tel, [field]: value } : tel
      ),
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

      {/* Tabla de clientes */}
      <TableContainer component={Paper} sx={{
        width: '100%',
        overflowX: 'auto',
        maxHeight: '70vh',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(139, 92, 246, 0.3)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
          }
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfonos</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4, color: '#A1A1AA' }}>
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell sx={{ color: '#0D0D0D' }}>{cliente.id}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>
                    {`${cliente.nombre1}${cliente.nombre2 ? ' ' + cliente.nombre2 : ''} ${cliente.apellido1}${cliente.apellido2 ? ' ' + cliente.apellido2 : ''}`}
                  </TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{cliente.email}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>
                    {cliente.telefonos.map(tel => tel.numero).join(', ') || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>
                    {cliente.direccion}{cliente.barrio ? `, ${cliente.barrio}` : ''}
                  </TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{cliente.ciudad}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{cliente.departamento}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditar(cliente)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(cliente.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
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
            {/* Teléfonos */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#8B5CF6' }}>
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Teléfonos
              </Typography>
              {formData.telefonos.map((telefono, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Teléfono ${index + 1}`}
                    value={telefono.numero}
                    onChange={(e) => handleTelefonoChange(index, 'numero', e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <FormControl sx={{ minWidth: 120, mr: 2 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={telefono.tipo}
                      label="Tipo"
                      onChange={(e) => handleTelefonoChange(index, 'tipo', e.target.value)}
                    >
                      <MenuItem value="CELULAR">Celular</MenuItem>
                      <MenuItem value="FIJO">Fijo</MenuItem>
                      <MenuItem value="TRABAJO">Trabajo</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveTelefono(index)}
                    disabled={formData.telefonos.length <= 1}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddTelefono}
                startIcon={<AddIcon />}
                sx={{
                  borderColor: '#8B5CF6',
                  color: '#8B5CF6',
                  '&:hover': {
                    borderColor: '#A855F7',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  }
                }}
              >
                Agregar Teléfono
              </Button>
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
          <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Actualizar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesPage;