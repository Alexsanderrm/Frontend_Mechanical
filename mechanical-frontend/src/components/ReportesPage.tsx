import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Description as ReportIcon,
  Build as BuildIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { reportesService } from '../services/reportesService';

const ReportesPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const reportes = [
    {
      id: 'ordenes',
      titulo: 'Reporte de Órdenes',
      descripcion: 'Lista completa de todas las órdenes de trabajo registradas',
      icono: <AssignmentIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      id: 'repuestos',
      titulo: 'Reporte de Repuestos',
      descripcion: 'Inventario completo de repuestos disponibles',
      icono: <ShoppingCartIcon fontSize="large" />,
      color: '#388e3c',
    },
    {
      id: 'servicios',
      titulo: 'Reporte de Servicios',
      descripcion: 'Catálogo completo de servicios ofrecidos',
      icono: <BuildIcon fontSize="large" />,
      color: '#f57c00',
    },
    {
      id: 'mecanicos-orden',
      titulo: 'Mecánicos por Orden',
      descripcion: 'Lista de mecánicos asignados a una orden específica',
      icono: <PeopleIcon fontSize="large" />,
      color: '#7b1fa2',
      requiereId: true,
      placeholder: 'ID de la Orden',
    },
    {
      id: 'ordenes-cliente',
      titulo: 'Órdenes por Cliente',
      descripcion: 'Historial completo de órdenes de un cliente',
      icono: <AssignmentIcon fontSize="large" />,
      color: '#d32f2f',
      requiereId: true,
      placeholder: 'ID del Cliente',
    },
  ];

  const handleGenerarReporte = async (reporteId: string, id?: string) => {
    setLoading(reporteId);
    try {
      let blob: Blob;

      switch (reporteId) {
        case 'ordenes':
          blob = await reportesService.generarReporteOrdenes();
          break;
        case 'repuestos':
          blob = await reportesService.generarReporteRepuestos();
          break;
        case 'servicios':
          blob = await reportesService.generarReporteServicios();
          break;
        case 'mecanicos-orden':
          if (!id) {
            alert('Por favor ingrese el ID de la orden');
            return;
          }
          blob = await reportesService.generarReporteMecanicosPorOrden(id);
          break;
        case 'ordenes-cliente':
          if (!id) {
            alert('Por favor ingrese el ID del cliente');
            return;
          }
          blob = await reportesService.generarReporteOrdenesPorCliente(id);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }

      // Crear URL para descargar el PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${reporteId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte. Verifique la consola para más detalles.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        background: 'linear-gradient(45deg, #8B5CF6 30%, #A855F7 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        mb: 2
      }}>
        Reportes del Sistema
      </Typography>
      <Typography variant="body1" sx={{ color: '#A1A1AA', mb: 4 }}>
        Genere reportes en formato PDF para análisis y documentación
      </Typography>

      {/* Panel de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700, mb: 1 }}>
              $45,230
            </Typography>
            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
              💰 Ingresos Totales
            </Typography>
            <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 600 }}>
              +12.5% vs mes anterior
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#A855F7', fontWeight: 700, mb: 1 }}>
              1,247
            </Typography>
            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
              👥 Clientes Atendidos
            </Typography>
            <Typography variant="caption" sx={{ color: '#C084FC', fontWeight: 600 }}>
              +8.3% vs mes anterior
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700, mb: 1 }}>
              89
            </Typography>
            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
              🔧 Órdenes Completadas
            </Typography>
            <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 600 }}>
              +15.2% vs mes anterior
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#A855F7', fontWeight: 700, mb: 1 }}>
              4.8
            </Typography>
            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
              ⭐ Calificación Promedio
            </Typography>
            <Typography variant="caption" sx={{ color: '#C084FC', fontWeight: 600 }}>
              +0.3 vs mes anterior
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Reportes Disponibles */}
      <Typography variant="h5" sx={{ mb: 3, color: '#FFFFFF', fontWeight: 600 }}>
        📄 Reportes Disponibles
      </Typography>

      <Grid container spacing={3}>
        {reportes.map((reporte) => (
          <Grid item xs={12} sm={6} md={4} key={reporte.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #1A1A1A 0%, #252525 100%)',
              border: '1px solid #374151',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                borderColor: 'rgba(139, 92, 246, 0.5)'
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: reporte.color,
                  }}
                >
                  {reporte.icono}
                  <Typography variant="h6" component="h2" sx={{ ml: 1, color: '#FFFFFF', fontWeight: 600 }}>
                    {reporte.titulo}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 2, lineHeight: 1.5 }}>
                  {reporte.descripcion}
                </Typography>
                {reporte.requiereId && (
                  <Chip
                    label="Requiere ID"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#F59E0B',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontWeight: 600
                    }}
                  />
                )}
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ReportIcon />}
                  onClick={() => handleGenerarReporte(reporte.id)}
                  disabled={loading === reporte.id}
                  sx={{
                    background: `linear-gradient(45deg, ${reporte.color} 30%, ${reporte.color}CC 90%)`,
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: `0 4px 15px ${reporte.color}40`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${reporte.color}CC 30%, ${reporte.color} 90%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${reporte.color}60`
                    },
                    '&:disabled': {
                      background: '#374151',
                      color: '#6B7280'
                    }
                  }}
                >
                  {loading === reporte.id ? 'Generando...' : 'Generar PDF'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{
        mt: 6,
        p: 4,
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)',
        borderRadius: 3,
        border: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 600 }}>
          📋 Información de Reportes
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: '#A1A1AA', mb: 2 }}>
          • Los reportes se generan en formato PDF y se descargan automáticamente
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: '#A1A1AA', mb: 2 }}>
          • Los reportes que requieren ID necesitan que especifique el identificador correspondiente
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: '#A1A1AA', mb: 0 }}>
          • Asegúrese de que el backend esté ejecutándose para generar los reportes
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportesPage;