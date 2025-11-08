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
import { mecanicosService } from '../services/mecanicosService';

const MecanicosPage: React.FC = () => {
  const [mecanicos, setMecanicos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    especialidad: '',
    rol: 'MECANICO',
    salario: '',
    experiencia: 0,
  });

  useEffect(() => {
    loadMecanicos();
  }, []);

  const loadMecanicos = async () => {
    try {
      // Por ahora usamos datos mock
      setMecanicos([]);
    } catch (error) {
      console.error('Error loading mecanicos:', error);
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
      telefono: '',
      especialidad: '',
      rol: 'MECANICO',
      salario: '',
      experiencia: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      await mecanicosService.crearMecanico({
        nombre1: formData.nombre1,
        nombre2: formData.nombre2,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        email: formData.email,
        experiencia: parseInt(formData.experiencia.toString()),
        especializacion: [], // TODO: Implementar selección múltiple
        estado: 'ACTIVO',
      });
      handleCloseDialog();
      loadMecanicos();
    } catch (error) {
      console.error('Error creating mecanico:', error);
    }
  };

  const handleEditar = (mecanico: any) => {
    // TODO: Implementar edición
    console.log('Editar mecanico:', mecanico);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mecánico?')) {
      try {
        await mecanicosService.eliminarMecanico(id);
        loadMecanicos();
      } catch (error) {
        console.error('Error deleting mecanico:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'JEFE_TALLER': return 'error';
      case 'MECANICO': return 'primary';
      case 'AYUDANTE': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1">
          Gestión de Mecánicos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nuevo Mecánico
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mecanicos.map((mecanico) => (
              <TableRow key={mecanico.id}>
                <TableCell>{mecanico.id}</TableCell>
                <TableCell>{`${mecanico.nombre1} ${mecanico.apellido1}`}</TableCell>
                <TableCell>{mecanico.email}</TableCell>
                <TableCell>{mecanico.telefono}</TableCell>
                <TableCell>{mecanico.especialidad}</TableCell>
                <TableCell>
                  <Chip
                    label={mecanico.rol}
                    color={getRolColor(mecanico.rol)}
                    size="small"
                  />
                </TableCell>
                <TableCell>${mecanico.salario}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditar(mecanico)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleEliminar(mecanico.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
            {mecanicos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay mecánicos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Mecánico</DialogTitle>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Especialidad"
                value={formData.especialidad}
                onChange={(e) => handleInputChange('especialidad', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Experiencia (años)"
                type="number"
                value={formData.experiencia}
                onChange={(e) => handleInputChange('experiencia', parseInt(e.target.value) || 0)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.rol}
                  label="Rol"
                  onChange={(e) => handleInputChange('rol', e.target.value)}
                >
                  <MenuItem value="JEFE_TALLER">Jefe de Taller</MenuItem>
                  <MenuItem value="MECANICO">Mecánico</MenuItem>
                  <MenuItem value="AYUDANTE">Ayudante</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Salario"
                type="number"
                value={formData.salario}
                onChange={(e) => handleInputChange('salario', e.target.value)}
                required
                helperText="Salario mensual en pesos"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Crear Mecánico</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MecanicosPage;