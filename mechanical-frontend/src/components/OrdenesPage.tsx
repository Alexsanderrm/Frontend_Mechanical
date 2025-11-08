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
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ordenesService, type AsignarMecanicoDTO, type DiagnosticoDTO, type ServicioMecanicoDTO } from '../services/ordenesService';

const OrdenesPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openAsignarMecanico, setOpenAsignarMecanico] = useState(false);
  const [openDiagnostico, setOpenDiagnostico] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<string>('');
  const [formData, setFormData] = useState({
    descripcion: '',
    estado: 'PENDIENTE',
    idCliente: '',
    idVehiculo: '',
    idMecanico: '',
  });
  const [asignarMecanicoData, setAsignarMecanicoData] = useState<AsignarMecanicoDTO>({
    rol: 'MECANICO',
  });
  const [diagnosticoData, setDiagnosticoData] = useState<DiagnosticoDTO>({
    diagnosticoInicial: '',
    diagnosticoFinal: '',
  });

  useEffect(() => {
    loadOrdenes();
  }, []);

  const loadOrdenes = async () => {
    try {
      // Por ahora usamos datos mock
      setOrdenes([]);
    } catch (error) {
      console.error('Error loading ordenes:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormData({
      descripcion: '',
      estado: 'PENDIENTE',
      idCliente: '',
      idVehiculo: '',
      idMecanico: '',
    });
  };

  const handleSubmit = async () => {
    try {
      await ordenesService.crearOrden(formData.idCliente, {
        descripcion: formData.descripcion,
        fechaIngreso: new Date().toISOString(),
      });
      handleCloseDialog();
      loadOrdenes();
    } catch (error) {
      console.error('Error creating orden:', error);
    }
  };

  const handleEditar = (orden: any) => {
    setFormData({
      descripcion: orden.descripcion || '',
      estado: orden.estado || 'PENDIENTE',
      idCliente: orden.idCliente || '',
      idVehiculo: orden.idVehiculo || '',
      idMecanico: orden.idMecanico || '',
    });
    setOpen(true);
  };

  const handleAsignarMecanico = (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    setOpenAsignarMecanico(true);
  };

  const handleVerDiagnostico = (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    setOpenDiagnostico(true);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      try {
        await ordenesService.eliminarOrden(id);
        loadOrdenes();
      } catch (error) {
        console.error('Error deleting orden:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'EN_PROCESO': return 'info';
      case 'COMPLETADA': return 'success';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1">
          Gestión de Órdenes de Trabajo
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nueva Orden
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Mecánico</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell>{orden.id}</TableCell>
                <TableCell>{orden.descripcion}</TableCell>
                <TableCell>
                  <Chip
                    label={orden.estado}
                    color={getEstadoColor(orden.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{orden.idCliente}</TableCell>
                <TableCell>{orden.idVehiculo}</TableCell>
                <TableCell>{orden.idMecanico}</TableCell>
                <TableCell>{orden.fechaCreacion}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" onClick={() => handleEditar(orden)}>Editar</Button>
                    <Button size="small" color="primary" onClick={() => handleAsignarMecanico(orden.id)}>Asignar Mecánico</Button>
                    <Button size="small" color="secondary" onClick={() => handleVerDiagnostico(orden.id)}>Diagnóstico</Button>
                    <Button size="small" color="error" onClick={() => handleEliminar(orden.id)}>Eliminar</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {ordenes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay órdenes de trabajo registradas
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nueva Orden de Trabajo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción del Trabajo"
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                >
                  <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                  <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
                  <MenuItem value="COMPLETADA">Completada</MenuItem>
                  <MenuItem value="CANCELADA">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ID del Cliente"
                value={formData.idCliente}
                onChange={(e) => handleInputChange('idCliente', e.target.value)}
                required
                helperText="ID del cliente que solicita el trabajo"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ID del Vehículo"
                value={formData.idVehiculo}
                onChange={(e) => handleInputChange('idVehiculo', e.target.value)}
                required
                helperText="Placa del vehículo"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ID del Mecánico"
                value={formData.idMecanico}
                onChange={(e) => handleInputChange('idMecanico', e.target.value)}
                required
                helperText="ID del mecánico asignado"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Crear Orden</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para asignar mecánico */}
      <Dialog open={openAsignarMecanico} onClose={() => setOpenAsignarMecanico(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Mecánico a Orden</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID del Mecánico"
                value={asignarMecanicoData.rol}
                onChange={(e) => setAsignarMecanicoData(prev => ({ ...prev, rol: e.target.value }))}
                required
                helperText="ID del mecánico a asignar"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID del Mecánico"
                value={asignarMecanicoData.rol}
                onChange={(e) => setAsignarMecanicoData(prev => ({ ...prev, rol: e.target.value }))}
                required
                helperText="ID del mecánico a asignar"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={asignarMecanicoData.rol}
                  label="Rol"
                  onChange={(e) => setAsignarMecanicoData(prev => ({ ...prev, rol: e.target.value }))}
                >
                  <MenuItem value="MECANICO">Mecánico</MenuItem>
                  <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                  <MenuItem value="AYUDANTE">Ayudante</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAsignarMecanico(false)}>Cancelar</Button>
          <Button onClick={handleAsignarMecanicoSubmit} variant="contained">Asignar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para diagnóstico */}
      <Dialog open={openDiagnostico} onClose={() => setOpenDiagnostico(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Diagnóstico</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnóstico Inicial"
                multiline
                rows={3}
                value={diagnosticoData.diagnosticoInicial}
                onChange={(e) => setDiagnosticoData(prev => ({ ...prev, diagnosticoInicial: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnóstico Final"
                multiline
                rows={3}
                value={diagnosticoData.diagnosticoFinal}
                onChange={(e) => setDiagnosticoData(prev => ({ ...prev, diagnosticoFinal: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDiagnostico(false)}>Cancelar</Button>
          <Button onClick={handleDiagnosticoSubmit} variant="contained">Registrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

  const handleAsignarMecanicoSubmit = async () => {
    if (!selectedOrdenId || !asignarMecanicoData.rol) return;

    try {
      await ordenesService.asignarMecanico(selectedOrdenId, 'mecanico-id-placeholder', asignarMecanicoData);
      setOpenAsignarMecanico(false);
      loadOrdenes();
    } catch (error) {
      console.error('Error asignando mecánico:', error);
    }
  };

  const handleDiagnosticoSubmit = async () => {
    if (!selectedOrdenId) return;

    try {
      await ordenesService.registrarDiagnostico(selectedOrdenId, diagnosticoData);
      setOpenDiagnostico(false);
      loadOrdenes();
    } catch (error) {
      console.error('Error registrando diagnóstico:', error);
    }
  };

export default OrdenesPage;