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
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { vehiculosService } from '../services/vehiculosService';
import { clientesService } from '../services/clientesService';
import type { Cliente } from '../services/clientesService';

const VehiculosPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    idCliente: '',
  });

  useEffect(() => {
    loadVehiculos();
    loadClientes();
  }, []);

  const loadVehiculos = async () => {
    try {
      const response = await vehiculosService.listarVehiculos();
      if (response.error) {
        throw new Error('Error al obtener vehículos');
      }
      setVehiculos(response.mensaje);
    } catch (error) {
      console.error('Error loading vehiculos:', error);
    }
  };

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
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedVehiculoId(null);
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      anio: '',
      color: '',
      idCliente: '',
    });
  };

  const handleSubmit = async () => {
    const idClienteTrimmed = formData.idCliente.trim();
    if (!idClienteTrimmed) {
      alert('El ID del cliente es requerido');
      return;
    }
    try {
      if (isEditing && selectedVehiculoId) {
        await vehiculosService.actualizarVehiculo(selectedVehiculoId, idClienteTrimmed, {
          placa: formData.placa,
          anio: parseInt(formData.anio),
          color: formData.color,
          modelo: formData.modelo,
          marca: formData.marca,
        });
      } else {
        await vehiculosService.crearVehiculo(idClienteTrimmed, {
          placa: formData.placa,
          anio: parseInt(formData.anio),
          color: formData.color,
          modelo: formData.modelo,
          marca: formData.marca,
        });
      }
      handleCloseDialog();
      loadVehiculos();
    } catch (error) {
      console.error('Error saving vehiculo:', error);
    }
  };

  const handleEditar = async (vehiculo: any) => {
    setSelectedVehiculoId(vehiculo.id);
    setIsEditing(true);
    try {
      const response = await vehiculosService.obtenerVehiculo(vehiculo.id);
      if (response.error) {
        throw new Error('Error obteniendo vehículo');
      }
      const v = response.mensaje;
      setFormData({
        placa: v.placa,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio.toString(),
        color: v.color,
        idCliente: v.idPropietario,
      });
    } catch (error) {
      console.error('Error loading vehiculo:', error);
    }
    setOpen(true);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await vehiculosService.eliminarVehiculo(id);
        loadVehiculos();
      } catch (error) {
        console.error('Error deleting vehiculo:', error);
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
        <Typography variant="h4" component="h1">
          Gestión de Vehículos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nuevo Vehículo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID del Propietario</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.placa}>
                <TableCell sx={{ color: '#0D0D0D' }}>{vehiculo.idPropietario}</TableCell>
                <TableCell>{vehiculo.placa}</TableCell>
                <TableCell>{vehiculo.marca}</TableCell>
                <TableCell>{vehiculo.modelo}</TableCell>
                <TableCell>{vehiculo.anio}</TableCell>
                <TableCell>{vehiculo.color}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditar(vehiculo)}
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
                    onClick={() => handleEliminar(vehiculo.id)}
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
            ))}
            {vehiculos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay vehículos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Placa"
                value={formData.placa}
                onChange={(e) => handleInputChange('placa', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                value={formData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Modelo"
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Año"
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange('anio', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                options={clientes}
                getOptionLabel={(option) => `${option.nombre1} ${option.apellido1}${option.nombre2 ? ' ' + option.nombre2 : ''}${option.apellido2 ? ' ' + option.apellido2 : ''}`}
                value={clientes.find(c => c.id === formData.idCliente) || null}
                onChange={(event, newValue) => {
                  handleInputChange('idCliente', newValue ? newValue.id : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente Propietario"
                    required
                    helperText="Selecciona el cliente propietario del vehículo"
                  />
                )}
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

export default VehiculosPage;