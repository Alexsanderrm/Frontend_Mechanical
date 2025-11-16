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
import { mecanicosService } from '../services/mecanicosService';
import { serviciosService } from '../services/serviciosService';

const OrdenesPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openAsignarMecanico, setOpenAsignarMecanico] = useState(false);
  const [openDiagnostico, setOpenDiagnostico] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openRegistrarServicio, setOpenRegistrarServicio] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState<string>('');
  const [formData, setFormData] = useState({
    descripcion: '',
    idVehiculo: '',
    fechaIngreso: '',
    fechaSalida: '',
  });
  const [asignarMecanicoData, setAsignarMecanicoData] = useState({
    idMecanico: '',
    rol: 'MECANICO',
  });
  const [diagnosticoData, setDiagnosticoData] = useState<DiagnosticoDTO>({
    diagnosticoInicial: '',
    diagnosticoFinal: '',
  });
  const [detalleData, setDetalleData] = useState<any[]>([]);
  const [registrarServicioData, setRegistrarServicioData] = useState({
    idMecanico: '',
    idServicio: '',
    rol: 'MECANICO',
    horasTrabajadas: 0,
    fechaAsignacion: '',
  });

  useEffect(() => {
    loadOrdenes();
    loadMecanicos();
    loadServicios();
  }, []);

  const loadMecanicos = async () => {
    try {
      const response = await mecanicosService.listarMecanicos();
      setMecanicos(response.mensaje || []);
    } catch (error) {
      console.error('Error loading mecanicos:', error);
    }
  };

  const loadServicios = async () => {
    try {
      const response = await serviciosService.obtenerServicios();
      setServicios(response.mensaje || []);
    } catch (error) {
      console.error('Error loading servicios:', error);
    }
  };

  const loadOrdenes = async () => {
    try {
      const response = await ordenesService.obtenerTodasLasOrdenes();
      setOrdenes(response.mensaje || []);
    } catch (error) {
      console.error('Error loading ordenes:', error);
    }
  };

  const handleOpenDialog = () => {
    setIsEditing(false);
    setSelectedOrdenId('');
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedOrdenId('');
    setFormData({
      descripcion: '',
      idVehiculo: '',
      fechaIngreso: '',
      fechaSalida: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await ordenesService.actualizarOrden(selectedOrdenId, {
          fechaIngreso: formData.fechaIngreso,
          fechaSalida: formData.fechaSalida || undefined,
          descripcion: formData.descripcion,
        });
      } else {
        const fechaIngreso = formData.fechaIngreso || new Date().toISOString();
        await ordenesService.crearOrden(formData.idVehiculo, {
          descripcion: formData.descripcion,
          fechaIngreso,
        });
      }
      handleCloseDialog();
      loadOrdenes();
    } catch (error) {
      console.error('Error saving orden:', error);
    }
  };

  const handleEditar = (orden: any) => {
    setIsEditing(true);
    setSelectedOrdenId(orden.id);
    setFormData({
      descripcion: orden.descripcion || '',
      idVehiculo: orden.placa || '', // placa es del vehiculo, pero para edición no se cambia vehiculo
      fechaIngreso: orden.fechaIngreso ? new Date(orden.fechaIngreso).toISOString().slice(0, 16) : '',
      fechaSalida: orden.fechaSalida ? new Date(orden.fechaSalida).toISOString().slice(0, 16) : '',
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

  const handleVerDetalle = async (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    try {
      const response = await ordenesService.obtenerDetalleOrden(ordenId);
      setDetalleData(response.mensaje || []);
      setOpenDetalle(true);
    } catch (error) {
      console.error('Error loading detalle:', error);
    }
  };

  const handleRegistrarServicio = (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    setOpenRegistrarServicio(true);
  };

  const handleRegistrarServicioSubmit = async () => {
    if (!selectedOrdenId || !registrarServicioData.idMecanico || !registrarServicioData.idServicio) return;

    try {
      await ordenesService.registrarServicio(selectedOrdenId, registrarServicioData.idMecanico, registrarServicioData.idServicio, {
        rol: registrarServicioData.rol,
        horasTrabajadas: registrarServicioData.horasTrabajadas,
        fechaAsignacion: registrarServicioData.fechaAsignacion,
      });
      setOpenRegistrarServicio(false);
      setRegistrarServicioData({
        idMecanico: '',
        idServicio: '',
        rol: 'MECANICO',
        horasTrabajadas: 0,
        fechaAsignacion: '',
      });
      loadOrdenes();
    } catch (error) {
      console.error('Error registrando servicio:', error);
    }
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
              <TableCell>Placa</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
              <TableCell>Fecha Salida</TableCell>
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
                <TableCell>{orden.placa}</TableCell>
                <TableCell>{orden.fechaIngreso ? new Date(orden.fechaIngreso).toLocaleString() : '-'}</TableCell>
                <TableCell>{orden.fechaSalida ? new Date(orden.fechaSalida).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" onClick={() => handleEditar(orden)}>Editar</Button>
                    <Button size="small" color="primary" onClick={() => handleAsignarMecanico(orden.id)}>Asignar Mecánico</Button>
                    <Button size="small" color="secondary" onClick={() => handleVerDiagnostico(orden.id)}>Diagnóstico</Button>
                    <Button size="small" color="info" onClick={() => handleVerDetalle(orden.id)}>Ver Detalles</Button>
                    <Button size="small" color="success" onClick={() => handleRegistrarServicio(orden.id)}>Registrar Servicio</Button>
                    <Button size="small" color="error" onClick={() => handleEliminar(orden.id)}>Eliminar</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {ordenes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
        <DialogTitle>{isEditing ? 'Editar Orden de Trabajo' : 'Crear Nueva Orden de Trabajo'}</DialogTitle>
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
              <TextField
                fullWidth
                label="ID del Vehículo"
                value={formData.idVehiculo}
                onChange={(e) => handleInputChange('idVehiculo', e.target.value)}
                required
                helperText="ID del vehículo"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Fecha de Ingreso${!isEditing ? ' (opcional)' : ''}`}
                type="datetime-local"
                value={formData.fechaIngreso}
                onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
                required={isEditing}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {isEditing && (
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Salida"
                  type="datetime-local"
                  value={formData.fechaSalida}
                  onChange={(e) => handleInputChange('fechaSalida', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
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
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Mecánico</InputLabel>
                <Select
                  value={asignarMecanicoData.idMecanico}
                  label="Mecánico"
                  onChange={(e) => setAsignarMecanicoData(prev => ({ ...prev, idMecanico: e.target.value }))}
                >
                  {mecanicos.map((mecanico) => (
                    <MenuItem key={mecanico.id} value={mecanico.id}>
                      {mecanico.nombre1} {mecanico.nombre2} {mecanico.apellido1} {mecanico.apellido2}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={asignarMecanicoData.rol}
                  label="Rol"
                  onChange={(e) => setAsignarMecanicoData(prev => ({ ...prev, rol: e.target.value }))}
                >
                  <MenuItem value="MECANICO">Mecánico</MenuItem>
                  <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
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

      {/* Dialog para ver detalles de la orden */}
      <Dialog open={openDetalle} onClose={() => setOpenDetalle(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Detalles de la Orden</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mecánico</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Costo Unitario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Horas Trabajadas</TableCell>
                  <TableCell>Fecha Asignación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detalleData.map((detalle, index) => (
                  <TableRow key={index}>
                    <TableCell>{detalle.nombre1} {detalle.nombre2} {detalle.apellido1} {detalle.apellido2}</TableCell>
                    <TableCell>{detalle.tipo} - {detalle.descripcion}</TableCell>
                    <TableCell>${detalle.costoUnitario}</TableCell>
                    <TableCell>{detalle.rol}</TableCell>
                    <TableCell>{detalle.horasTrabajadas}</TableCell>
                    <TableCell>{detalle.fechaAsignacion ? new Date(detalle.fechaAsignacion).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
                {detalleData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No hay servicios registrados en esta orden
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetalle(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para registrar servicio */}
      <Dialog open={openRegistrarServicio} onClose={() => setOpenRegistrarServicio(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Servicio en Orden</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Mecánico</InputLabel>
                <Select
                  value={registrarServicioData.idMecanico}
                  label="Mecánico"
                  onChange={(e) => setRegistrarServicioData(prev => ({ ...prev, idMecanico: e.target.value }))}
                >
                  {mecanicos.map((mecanico) => (
                    <MenuItem key={mecanico.id} value={mecanico.id}>
                      {mecanico.nombre1} {mecanico.nombre2} {mecanico.apellido1} {mecanico.apellido2}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Servicio</InputLabel>
                <Select
                  value={registrarServicioData.idServicio}
                  label="Servicio"
                  onChange={(e) => setRegistrarServicioData(prev => ({ ...prev, idServicio: e.target.value }))}
                >
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.tipoServicio} - {servicio.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={registrarServicioData.rol}
                  label="Rol"
                  onChange={(e) => setRegistrarServicioData(prev => ({ ...prev, rol: e.target.value }))}
                >
                  <MenuItem value="MECANICO">Mecánico</MenuItem>
                  <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Horas Trabajadas"
                type="number"
                value={registrarServicioData.horasTrabajadas}
                onChange={(e) => setRegistrarServicioData(prev => ({ ...prev, horasTrabajadas: parseInt(e.target.value) }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de Asignación"
                type="datetime-local"
                value={registrarServicioData.fechaAsignacion}
                onChange={(e) => setRegistrarServicioData(prev => ({ ...prev, fechaAsignacion: e.target.value }))}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegistrarServicio(false)}>Cancelar</Button>
          <Button onClick={handleRegistrarServicioSubmit} variant="contained">Registrar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};
  const handleAsignarMecanicoSubmit = async () => {
    if (!selectedOrdenId || !asignarMecanicoData.idMecanico || !asignarMecanicoData.rol) return;

    try {
      await ordenesService.asignarMecanico(selectedOrdenId, asignarMecanicoData.idMecanico, { rol: asignarMecanicoData.rol });
      setOpenAsignarMecanico(false);
      setAsignarMecanicoData({ idMecanico: '', rol: 'MECANICO' });
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