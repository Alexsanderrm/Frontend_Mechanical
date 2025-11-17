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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { repuestosService, type Repuesto, type CrearRepuestoDTO } from '../services/repuestosService';
import { proveedoresService, type Proveedor } from '../services/proveedoresService';

const RepuestosPage: React.FC = () => {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CrearRepuestoDTO & { proveedorId: string | null }>({
    nombre: '',
    costoUnitario: 0,
    stock: 0,
    proveedorId: null,
  });

  useEffect(() => {
    loadRepuestos();
    loadProveedores();
  }, []);

  const loadRepuestos = async () => {
    try {
      const response = await repuestosService.obtenerRepuestos();
      if (response.error) {
        throw new Error('Error al obtener repuestos');
      }
      setRepuestos(response.mensaje);
    } catch (error) {
      console.error('Error loading repuestos:', error);
    }
  };

  const loadProveedores = async () => {
    try {
      const response = await proveedoresService.listarProveedores();
      if (response.error) {
        throw new Error('Error al obtener proveedores');
      }
      setProveedores(response.mensaje);
    } catch (error) {
      console.error('Error loading proveedores:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      nombre: '',
      costoUnitario: 0,
      stock: 0,
      proveedorId: null,
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      costoUnitario: 0,
      stock: 0,
      proveedorId: null,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.nombre || !formData.proveedorId) {
        alert('Por favor completa el nombre y selecciona un proveedor');
        return;
      }

      const repuestoData: CrearRepuestoDTO = {
        nombre: formData.nombre,
        costoUnitario: formData.costoUnitario,
        stock: formData.stock,
      };

      const idProveedor = formData.proveedorId!;

      let response;
      if (isEditing && editingId) {
        response = await repuestosService.actualizarRepuesto(editingId, idProveedor, repuestoData);
      } else {
        response = await repuestosService.crearRepuesto(idProveedor, repuestoData);
      }

      if (response.error) {
        throw new Error(response.mensaje);
      }

      handleCloseDialog();
      loadRepuestos();
      alert(isEditing ? 'Repuesto actualizado exitosamente' : 'Repuesto creado exitosamente');
    } catch (error) {
      console.error('Error saving repuesto:', error);
      alert('Error al guardar el repuesto: ' + (error as any)?.message || 'Error desconocido');
    }
  };

  const handleEditar = async (repuesto: Repuesto) => {
    // Usar datos de la lista
    setFormData({
      nombre: repuesto.nombre,
      costoUnitario: repuesto.costoUnitario,
      stock: repuesto.stock,
      proveedorId: repuesto.idProveedor || null, // Preseleccionar si está disponible
    });
    setIsEditing(true);
    setEditingId(repuesto.id);
    setOpen(true);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
      try {
        await repuestosService.eliminarRepuesto(id);
        loadRepuestos();
      } catch (error) {
        console.error('Error deleting repuesto:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
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
          Gestión de Repuestos
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
          Nuevo Repuesto
        </Button>
      </Box>

      {/* Tabla de repuestos */}
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
              <TableCell>Costo Unitario</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repuestos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#A1A1AA' }}>
                  No hay repuestos registrados
                </TableCell>
              </TableRow>
            ) : (
              repuestos.map((repuesto) => (
                <TableRow key={repuesto.id}>
                  <TableCell sx={{ color: '#0D0D0D' }}>{repuesto.id}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{repuesto.nombre}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>${repuesto.costoUnitario.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{repuesto.stock}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>
                    {repuesto.idProveedor ? proveedores.find(p => p.id === repuesto.idProveedor)?.nombre || 'Desconocido' : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditar(repuesto)}
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
                      onClick={() => handleEliminar(repuesto.id)}
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
        <DialogTitle>{isEditing ? 'Editar Repuesto' : 'Crear Nuevo Repuesto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={formData.proveedorId || ''}
                  label="Proveedor"
                  onChange={(e) => handleInputChange('proveedorId', e.target.value || null)}
                >
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Costo Unitario"
                type="number"
                value={formData.costoUnitario}
                onChange={(e) => handleInputChange('costoUnitario', parseFloat(e.target.value) || 0)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
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

export default RepuestosPage;