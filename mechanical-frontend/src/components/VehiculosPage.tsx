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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { vehiculosService } from '../services/vehiculosService';

const VehiculosPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    tipoVehiculo: 'AUTOMOVIL',
    idCliente: '',
  });

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      // Por ahora usamos datos mock
      setVehiculos([]);
    } catch (error) {
      console.error('Error loading vehiculos:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      anio: '',
      color: '',
      tipoVehiculo: 'AUTOMOVIL',
      idCliente: '',
    });
  };

  const handleSubmit = async () => {
    try {
      await vehiculosService.crearVehiculo(formData.idCliente, {
        placa: formData.placa,
        marca: formData.marca,
        modelo: formData.modelo,
        anio: formData.anio,
        color: formData.color,
        tipoVehiculo: formData.tipoVehiculo,
      });
      handleCloseDialog();
      loadVehiculos();
    } catch (error) {
      console.error('Error creating vehiculo:', error);
    }
  };

  const handleEditar = (vehiculo: any) => {
    // TODO: Implementar edición
    console.log('Editar vehiculo:', vehiculo);
  };

  const handleEliminar = async (placa: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await vehiculosService.eliminarVehiculo(placa);
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
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.placa}>
                <TableCell>{vehiculo.placa}</TableCell>
                <TableCell>{vehiculo.marca}</TableCell>
                <TableCell>{vehiculo.modelo}</TableCell>
                <TableCell>{vehiculo.anio}</TableCell>
                <TableCell>{vehiculo.color}</TableCell>
                <TableCell>{vehiculo.tipoVehiculo}</TableCell>
                <TableCell>{vehiculo.idCliente}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditar(vehiculo)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleEliminar(vehiculo.placa)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
            {vehiculos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
        <DialogTitle>Crear Nuevo Vehículo</DialogTitle>
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
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Vehículo</InputLabel>
                <Select
                  value={formData.tipoVehiculo}
                  label="Tipo de Vehículo"
                  onChange={(e) => handleInputChange('tipoVehiculo', e.target.value)}
                >
                  <MenuItem value="AUTOMOVIL">Automóvil</MenuItem>
                  <MenuItem value="MOTOCICLETA">Motocicleta</MenuItem>
                  <MenuItem value="CAMIONETA">Camioneta</MenuItem>
                  <MenuItem value="CAMION">Camión</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID del Cliente"
                value={formData.idCliente}
                onChange={(e) => handleInputChange('idCliente', e.target.value)}
                required
                helperText="ID del cliente propietario del vehículo"
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

export default VehiculosPage;