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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { serviciosService, type Servicio, type CrearServicioDTO } from '../services/serviciosService';

const tipoServicioOptions = [
  'MANTENIMIENTO_PREVENTIVO',
  'MANTENIMIENTO_CORRECTIVO',
  'REVISION_TECNOMECANICA',
  'MECANICA_GENERAL',
  'SISTEMA_DE_FRENOS',
  'SUSPENSION_Y_DIRECCION',
  'CAMBIO_DE_EMBRAGUE',
  'ELECTRICIDAD_AUTOMOTRIZ',
  'DIAGNOSTICO_ELECTRONICO',
  'REPARACION_AIRE_ACONDICIONADO',
  'LATONERIA',
  'PINTURA',
  'LAVADO_DETALLADO',
  'PULIDO_Y_ENCERADO',
  'ALINEACION_Y_BALANCEO',
  'INSTALACION_ACCESORIOS',
  'MANTENIMIENTO_AIRE_ACONDICIONADO',
  'REVISION_GENERAL',
  'MONTAJE_DE_LLANTAS',
  'CAMBIO_DE_ACEITE',
];

const ServiciosPage: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CrearServicioDTO>({
    tipoServicio: '',
    descripcion: '',
    costoUnitario: 0,
    fechaCreacion: '',
  });

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const response = await serviciosService.obtenerServicios();
      if (response.error) {
        throw new Error('Error al obtener servicios');
      }
      setServicios(response.mensaje);
    } catch (error) {
      console.error('Error loading servicios:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      tipoServicio: '',
      descripcion: '',
      costoUnitario: 0,
      fechaCreacion: '',
    });
  };

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!formData.tipoServicio || !formData.descripcion || !formData.fechaCreacion || formData.costoUnitario <= 0) {
        alert('Por favor completa todos los campos obligatorios y asegúrate de que el costo unitario sea mayor a 0');
        return;
      }

      console.log('Enviando datos del servicio:', formData);

      let response;
      if (isEditing && editingId) {
        response = await serviciosService.actualizarServicio(editingId, formData);
      } else {
        response = await serviciosService.crearServicio(formData);
      }

      console.log('Respuesta del servidor:', response);

      if (response.error) {
        throw new Error(response.mensaje);
      }

      handleCloseDialog();
      loadServicios();
      alert(isEditing ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
    } catch (error) {
      console.error('Error saving servicio:', error);
      alert('Error al guardar el servicio: ' + (error as any)?.message || 'Error desconocido');
    }
  };

  const handleEditar = async (servicio: Servicio) => {
    try {
      const response = await serviciosService.obtenerServicio(servicio.id);
      if (response.error) {
        throw new Error('Error al obtener servicio');
      }
      const servicioData = response.mensaje;
      setFormData({
        tipoServicio: servicioData.tipoServicio,
        descripcion: servicioData.descripcion,
        costoUnitario: servicioData.costoUnitario,
        fechaCreacion: servicioData.fechaCreacion,
      });
      setIsEditing(true);
      setEditingId(servicio.id);
      setOpen(true);
    } catch (error) {
      console.error('Error loading servicio for edit:', error);
      alert('Error al cargar datos del servicio para editar');
    }
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await serviciosService.eliminarServicio(id);
        loadServicios();
      } catch (error) {
        console.error('Error deleting servicio:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
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
          Gestión de Servicios
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
          Nuevo Servicio
        </Button>
      </Box>

      {/* Tabla de servicios */}
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
              <TableCell>Tipo Servicio</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Costo Unitario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#A1A1AA' }}>
                  No hay servicios registrados
                </TableCell>
              </TableRow>
            ) : (
              servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell sx={{ color: '#0D0D0D' }}>{servicio.id}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{servicio.tipoServicio}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{servicio.descripcion}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>{servicio.fechaCreacion}</TableCell>
                  <TableCell sx={{ color: '#0D0D0D' }}>${servicio.costoUnitario.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleEditar(servicio)}
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
                      onClick={() => handleEliminar(servicio.id)}
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
        <DialogTitle>{isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Servicio</InputLabel>
                <Select
                  value={formData.tipoServicio}
                  label="Tipo de Servicio"
                  onChange={(e) => handleInputChange('tipoServicio', e.target.value)}
                >
                  {tipoServicioOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                required
                multiline
                rows={3}
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
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha Creación"
                type="date"
                value={formData.fechaCreacion}
                onChange={(e) => handleInputChange('fechaCreacion', e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
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

export default ServiciosPage;