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
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { proveedoresService, type Proveedor, type CrearProveedorDTO } from '../services/proveedoresService';

const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CrearProveedorDTO>({
    nombre: '',
    email: '',
    telefonos: [],
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const response = await proveedoresService.listarProveedores();
      if (response.error) {
        throw new Error('Error al obtener proveedores');
      }
      console.log('Proveedores cargados:', response.mensaje);
      setProveedores(response.mensaje);
    } catch (error) {
      console.error('Error loading proveedores:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData(prev => ({
      ...prev,
      telefonos: [{ numero: '', tipo: 'FIJO' }],
    }));
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      email: '',
      telefonos: [],
    });
  };

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!formData.nombre || !formData.email) {
        alert('Por favor completa los campos obligatorios (Nombre, Email)');
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

      console.log('Enviando datos del proveedor:', formDataToSend);

      let response;
      if (isEditing && editingId) {
        response = await proveedoresService.actualizarProveedor(editingId, formDataToSend);
      } else {
        response = await proveedoresService.crearProveedor(formDataToSend);
      }

      console.log('Respuesta del servidor:', response);

      if (response.error) {
        throw new Error(response.mensaje);
      }

      handleCloseDialog();
      loadProveedores();
      alert(isEditing ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente');
    } catch (error) {
      console.error('Error saving proveedor:', error);
      alert('Error al guardar el proveedor: ' + (error as any)?.message || 'Error desconocido');
    }
  };

  const handleEditar = async (proveedor: Proveedor) => {
    try {
      const response = await proveedoresService.obtenerProveedor(proveedor.id);
      if (response.error) {
        throw new Error('Error al obtener proveedor');
      }
      const proveedorData = response.mensaje;
      setFormData({
        nombre: proveedorData.nombre,
        email: proveedorData.email,
        telefonos: proveedorData.telefonos.length > 0 ? proveedorData.telefonos : [{ numero: '', tipo: 'FIJO' }],
      });
      setIsEditing(true);
      setEditingId(proveedor.id);
      setOpen(true);
    } catch (error) {
      console.error('Error loading proveedor for edit:', error);
      alert('Error al cargar datos del proveedor para editar');
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await proveedoresService.eliminarProveedor(id);
        loadProveedores();
      } catch (error) {
        console.error('Error deleting proveedor:', error);
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
      telefonos: [...prev.telefonos, { numero: '', tipo: 'FIJO' }],
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
          Gestión de Proveedores
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
          Nuevo Proveedor
        </Button>
      </Box>

      {/* Tabla de proveedores */}
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
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfonos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#A1A1AA' }}>
                  No hay proveedores registrados
                </TableCell>
              </TableRow>
            ) : (
              proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell sx={{ color: '#0D0D0D' }}>{proveedor.id}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{proveedor.nombre}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{proveedor.email}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>
                    {proveedor.telefonos && proveedor.telefonos.length > 0
                      ? proveedor.telefonos.map(tel => tel.numero).filter(num => num && num.trim() !== '').join(', ')
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditar(proveedor)}
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
                      onClick={() => handleEliminar(proveedor.id)}
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
        <DialogTitle>{isEditing ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                required
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
                      <MenuItem value="FIJO">Fijo</MenuItem>
                      <MenuItem value="CELULAR">Celular</MenuItem>
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

export default ProveedoresPage;