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
import { ordenesService, type DiagnosticoDTO } from '../services/ordenesService';
import { mecanicosService } from '../services/mecanicosService';
import { serviciosService } from '../services/serviciosService';
import { vehiculosService } from '../services/vehiculosService';

const OrdenesPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openAsignarMecanico, setOpenAsignarMecanico] = useState(false);
  const [openDiagnostico, setOpenDiagnostico] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openRegistrarServicio, setOpenRegistrarServicio] = useState(false);
  const [openVerMecanicos, setOpenVerMecanicos] = useState(false);
  const [openEditarServicio, setOpenEditarServicio] = useState(false);
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
  const [mecanicosAsignados, setMecanicosAsignados] = useState<any[]>([]);
  const [registrarServicioData, setRegistrarServicioData] = useState({
    idMecanico: '',
    idServicio: '',
    rol: 'MECANICO',
    horasTrabajadas: 0,
    fechaAsignacion: '',
  });
  const [editarServicioData, setEditarServicioData] = useState({
    idMecanico: '',
    idServicio: '',
    rol: 'MECANICO',
    horasTrabajadas: 0,
    fechaAsignacion: '',
    idNuevoMecanico: '',
    idNuevoServicio: '',
  });

  useEffect(() => {
    loadOrdenes();
    loadMecanicos();
    loadServicios();
    loadVehiculos();
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

  const loadVehiculos = async () => {
    try {
      const response = await vehiculosService.listarVehiculos();
      setVehiculos(response.mensaje || []);
    } catch (error) {
      console.error('Error loading vehiculos:', error);
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
          fechaIngreso: new Date(formData.fechaIngreso).toISOString().slice(0, 19),
          fechaSalida: formData.fechaSalida ? new Date(formData.fechaSalida).toISOString().slice(0, 19) : null,
          descripcion: formData.descripcion,
          idVehiculo: formData.idVehiculo,
        });
      } else {
        const fechaIngreso = formData.fechaIngreso
          ? new Date(formData.fechaIngreso).toISOString().slice(0, 19)
          : new Date().toISOString().slice(0, 19);
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
    // Buscar el vehículo por placa
    const vehiculoEncontrado = vehiculos.find(v => v.placa === orden.placa);
    setFormData({
      descripcion: orden.descripcion || '',
      idVehiculo: vehiculoEncontrado ? vehiculoEncontrado.id : '',
      fechaIngreso: orden.fechaIngreso ? new Date(orden.fechaIngreso).toISOString().slice(0, 16) : '',
      fechaSalida: orden.fechaSalida ? new Date(orden.fechaSalida).toISOString().slice(0, 16) : '',
    });
    setOpen(true);
  };

  const handleAsignarMecanico = (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    setOpenAsignarMecanico(true);
  };

  const handleVerDiagnostico = async (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    try {
      const response = await ordenesService.obtenerDiagnostico(ordenId);
      setDiagnosticoData(response.mensaje || { diagnosticoInicial: '', diagnosticoFinal: '' });
    } catch (error) {
      console.error('Error loading diagnostico:', error);
      setDiagnosticoData({ diagnosticoInicial: '', diagnosticoFinal: '' });
    }
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

  const handleVerMecanicos = async (ordenId: string) => {
    setSelectedOrdenId(ordenId);
    try {
      const response = await ordenesService.obtenerMecanicosPorOrden(ordenId);
      setMecanicosAsignados(response.mensaje || []);
      setOpenVerMecanicos(true);
    } catch (error) {
      console.error('Error loading mecanicos asignados:', error);
    }
  };

  const handleEliminarMecanico = async (idMecanico: string) => {
    if (!selectedOrdenId) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar este mecánico de la orden?')) {
      try {
        await ordenesService.eliminarMecanico(selectedOrdenId, idMecanico);
        // Recargar mecánicos asignados
        const response = await ordenesService.obtenerMecanicosPorOrden(selectedOrdenId);
        setMecanicosAsignados(response.mensaje || []);
      } catch (error) {
        console.error('Error eliminando mecánico:', error);
      }
    }
  };

  const handleEditarServicio = (detalle: any) => {
    // Buscar IDs por nombre ya que el backend no los devuelve
    const nombreCompleto = `${detalle.nombre1} ${detalle.nombre2} ${detalle.apellido1} ${detalle.apellido2}`;
    const mecanicoEncontrado = mecanicos.find(m => `${m.nombre1} ${m.nombre2} ${m.apellido1} ${m.apellido2}` === nombreCompleto);
    const servicioEncontrado = servicios.find(s => s.tipoServicio === detalle.tipo && s.descripcion === detalle.descripcion);

    const idMecanico = mecanicoEncontrado ? mecanicoEncontrado.id : '';
    const idServicio = servicioEncontrado ? servicioEncontrado.id : '';

    setEditarServicioData({
      idMecanico,
      idServicio,
      rol: detalle.rol,
      horasTrabajadas: detalle.horasTrabajadas,
      fechaAsignacion: detalle.fechaAsignacion ? new Date(detalle.fechaAsignacion).toISOString().slice(0, 16) : '',
      idNuevoMecanico: idMecanico,
      idNuevoServicio: idServicio,
    });
    setOpenEditarServicio(true);
  };

  const handleRegistrarServicioSubmit = async () => {
    if (!selectedOrdenId || !registrarServicioData.idMecanico || !registrarServicioData.idServicio) return;

    try {
      await ordenesService.registrarServicio(selectedOrdenId, registrarServicioData.idMecanico, registrarServicioData.idServicio, {
        rol: registrarServicioData.rol,
        horasTrabajadas: registrarServicioData.horasTrabajadas,
        fechaAsignacion: new Date(registrarServicioData.fechaAsignacion).toISOString().slice(0, 19),
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

  const handleEditarServicioSubmit = async () => {
    if (!selectedOrdenId || !editarServicioData.idMecanico || !editarServicioData.idServicio) {
      console.error('Faltan IDs requeridos:', { selectedOrdenId, idMecanico: editarServicioData.idMecanico, idServicio: editarServicioData.idServicio });
      return;
    }

    try {
      await ordenesService.actualizarDetalleServicio(selectedOrdenId, editarServicioData.idMecanico, editarServicioData.idServicio, {
        rol: editarServicioData.rol,
        horasTrabajadas: editarServicioData.horasTrabajadas,
        fechaAsignacion: new Date(editarServicioData.fechaAsignacion).toISOString().slice(0, 19),
        idNuevoMecanico: editarServicioData.idNuevoMecanico || editarServicioData.idMecanico,
        idNuevoServicio: editarServicioData.idNuevoServicio || editarServicioData.idServicio,
      });
      setOpenEditarServicio(false);
      // Recargar detalles
      const response = await ordenesService.obtenerDetalleOrden(selectedOrdenId);
      setDetalleData(response.mensaje || []);
    } catch (error) {
      console.error('Error actualizando servicio:', error);
    }
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
                    <Button size="small" color="warning" onClick={() => handleVerMecanicos(orden.id)}>Ver Mecánicos</Button>
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
              <FormControl fullWidth>
                <InputLabel>Vehículo</InputLabel>
                <Select
                  value={formData.idVehiculo}
                  label="Vehículo"
                  onChange={(e) => handleInputChange('idVehiculo', e.target.value)}
                >
                  {vehiculos.map((vehiculo) => (
                    <MenuItem key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          <Button onClick={handleSubmit} variant="contained">{isEditing ? 'Actualizar Orden' : 'Crear Orden'}</Button>
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
                  <TableCell>Acción</TableCell>
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
                    <TableCell><Button size="small" onClick={() => handleEditarServicio(detalle)}>Editar</Button></TableCell>
                  </TableRow>
                ))}
                {detalleData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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

      {/* Dialog para ver mecánicos asignados */}
      <Dialog open={openVerMecanicos} onClose={() => setOpenVerMecanicos(false)} maxWidth="md" fullWidth>
        <DialogTitle>Mecánicos Asignados a la Orden</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Experiencia</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mecanicosAsignados.map((mecanico, index) => (
                  <TableRow key={index}>
                    <TableCell>{mecanico.nombre1} {mecanico.nombre2} {mecanico.apellido1} {mecanico.apellido2}</TableCell>
                    <TableCell>{mecanico.email}</TableCell>
                    <TableCell>{mecanico.experiencia} años</TableCell>
                    <TableCell>{mecanico.rolDTO.rol}</TableCell>
                    <TableCell><Button size="small" color="error" onClick={() => handleEliminarMecanico(mecanico.id)}>Eliminar</Button></TableCell>
                  </TableRow>
                ))}
                {mecanicosAsignados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No hay mecánicos asignados a esta orden
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerMecanicos(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar servicio */}
      <Dialog open={openEditarServicio} onClose={() => setOpenEditarServicio(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Servicio en Orden</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Mecánico Actual</InputLabel>
                <Select
                  value={editarServicioData.idMecanico}
                  label="Mecánico Actual"
                  onChange={(e) => setEditarServicioData(prev => ({ ...prev, idMecanico: e.target.value }))}
                  disabled
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
                <InputLabel>Servicio Actual</InputLabel>
                <Select
                  value={editarServicioData.idServicio}
                  label="Servicio Actual"
                  onChange={(e) => setEditarServicioData(prev => ({ ...prev, idServicio: e.target.value }))}
                  disabled
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
                <InputLabel>Nuevo Mecánico</InputLabel>
                <Select
                  value={editarServicioData.idNuevoMecanico}
                  label="Nuevo Mecánico"
                  onChange={(e) => setEditarServicioData(prev => ({ ...prev, idNuevoMecanico: e.target.value }))}
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
                <InputLabel>Nuevo Servicio</InputLabel>
                <Select
                  value={editarServicioData.idNuevoServicio}
                  label="Nuevo Servicio"
                  onChange={(e) => setEditarServicioData(prev => ({ ...prev, idNuevoServicio: e.target.value }))}
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
                  value={editarServicioData.rol}
                  label="Rol"
                  onChange={(e) => setEditarServicioData(prev => ({ ...prev, rol: e.target.value }))}
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
                value={editarServicioData.horasTrabajadas}
                onChange={(e) => setEditarServicioData(prev => ({ ...prev, horasTrabajadas: parseInt(e.target.value) }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de Asignación"
                type="datetime-local"
                value={editarServicioData.fechaAsignacion}
                onChange={(e) => setEditarServicioData(prev => ({ ...prev, fechaAsignacion: e.target.value }))}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditarServicio(false)}>Cancelar</Button>
          <Button onClick={handleEditarServicioSubmit} variant="contained">Actualizar</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default OrdenesPage;