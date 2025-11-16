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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { mecanicosService } from '../services/mecanicosService';
import type { Mecanico, CrearMecanicoDTO } from '../services/mecanicosService';

const especializaciones = [
  'MECANICA_GENERAL',
  'ELECTRICIDAD_AUTOMOTRIZ',
  'INYECCION_ELECTRONICA',
  'FRENOS',
  'SUSPENSION_Y_DIRECCION',
  'TRANSMISION',
  'AIRE_ACONDICIONADO',
  'SISTEMA_DE_ENFRIAMIENTO',
  'DIAGNOSTICO_COMPUTARIZADO',
  'LATONERIA_Y_PINTURA',
  'SISTEMA_DE_ESCAPE',
  'MOTOR_GASOLINA',
  'MOTOR_DIESEL',
  'ELECTRONICA_DE_BORDO',
  'ALINEACION_Y_BALANCEO',
];


const MecanicosPage: React.FC = () => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMecanicoId, setSelectedMecanicoId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    email: '',
    experiencia: '',
    salario: '',
    especializacion: [] as string[],
  });

  useEffect(() => {
    loadMecanicos();
  }, []);

  const loadMecanicos = async () => {
    try {
      const response = await mecanicosService.listarMecanicos();
      if (response.error) {
        throw new Error('Error al obtener mecánicos');
      }
      setMecanicos(response.mensaje);
    } catch (error) {
      console.error('Error loading mecanicos:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setIsEditing(false);
    setSelectedMecanicoId(null);
    setFormData({
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      email: '',
      experiencia: '',
      salario: '',
      especializacion: [],
    });
  };

  const handleSubmit = async () => {
    try {
      const mecanicoData: CrearMecanicoDTO = {
        nombre1: formData.nombre1,
        nombre2: formData.nombre2 || undefined,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2 || undefined,
        email: formData.email,
        experiencia: parseInt(formData.experiencia),
        salario: parseFloat(formData.salario),
        especializacion: formData.especializacion,
      };

      if (isEditing && selectedMecanicoId) {
        await mecanicosService.actualizarMecanico(selectedMecanicoId, mecanicoData);
      } else {
        await mecanicosService.crearMecanico(mecanicoData);
      }
      handleCloseDialog();
      loadMecanicos();
    } catch (error) {
      console.error('Error saving mecanico:', error);
    }
  };

  const handleEditar = async (mecanico: Mecanico) => {
    setSelectedMecanicoId(mecanico.id);
    setIsEditing(true);
    setFormData({
      nombre1: mecanico.nombre1,
      nombre2: mecanico.nombre2 || '',
      apellido1: mecanico.apellido1,
      apellido2: mecanico.apellido2 || '',
      email: mecanico.email,
      experiencia: mecanico.experiencia.toString(),
      salario: mecanico.salario.toString(),
      especializacion: mecanico.especializacion,
    });
    setOpen(true);
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experiencia</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Especialización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mecanicos.map((mecanico) => (
              <TableRow key={mecanico.id}>
                <TableCell>{`${mecanico.nombre1} ${mecanico.nombre2 || ''} ${mecanico.apellido1} ${mecanico.apellido2 || ''}`}</TableCell>
                <TableCell>{mecanico.email}</TableCell>
                <TableCell>{mecanico.experiencia}</TableCell>
                <TableCell>{mecanico.salario}</TableCell>
                <TableCell>
                  {mecanico.especializacion.map((esp) => (
                    <Chip key={esp} label={esp} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleEditar(mecanico)}
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
                    onClick={() => handleEliminar(mecanico.id)}
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
            ))}
            {mecanicos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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
        <DialogTitle>{isEditing ? 'Editar Mecánico' : 'Crear Nuevo Mecánico'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nombre 1"
                value={formData.nombre1}
                onChange={(e) => handleInputChange('nombre1', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nombre 2"
                value={formData.nombre2}
                onChange={(e) => handleInputChange('nombre2', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido 1"
                value={formData.apellido1}
                onChange={(e) => handleInputChange('apellido1', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido 2"
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Experiencia (años)"
                type="number"
                value={formData.experiencia}
                onChange={(e) => handleInputChange('experiencia', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Salario"
                type="number"
                value={formData.salario}
                onChange={(e) => handleInputChange('salario', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Especialización</InputLabel>
                <Select
                  multiple
                  value={formData.especializacion}
                  onChange={(e) => handleInputChange('especializacion', e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {especializaciones.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default MecanicosPage;