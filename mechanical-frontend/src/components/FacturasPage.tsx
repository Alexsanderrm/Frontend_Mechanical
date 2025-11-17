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
  Chip,
  TextField,
  Grid,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { facturasService, type Factura } from '../services/facturasService';

const FacturasPage: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);

  useEffect(() => {
    loadFacturas();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFacturas(facturas);
    } else {
      const filtered = facturas.filter(factura =>
        factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factura.ordenId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFacturas(filtered);
    }
  }, [facturas, searchTerm]);

  const loadFacturas = async () => {
    try {
      const response = await facturasService.listarFacturas();
      if (!response.error) {
        setFacturas(response.mensaje);
      }
    } catch (error) {
      console.error('Error loading facturas:', error);
    }
  };

  const handleSearchFacturaPorOrden = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await facturasService.obtenerFacturaPorOrden(searchTerm);
      if (!response.error) {
        setFilteredFacturas([response.mensaje]);
      }
    } catch (error) {
      console.error('Error searching factura:', error);
    }
  };

  const handleSearchFacturaPorPlaca = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await facturasService.obtenerFacturasPorPlaca(searchTerm);
      if (!response.error) {
        setFilteredFacturas(response.mensaje);
      }
    } catch (error) {
      console.error('Error searching facturas by placa:', error);
    }
  };

  const handleSearchFacturaPorCliente = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await facturasService.obtenerFacturasPorCliente(searchTerm);
      if (!response.error) {
        setFilteredFacturas(response.mensaje);
      }
    } catch (error) {
      console.error('Error searching facturas by cliente:', error);
    }
  };

  const handleDeleteFactura = async (idFactura: string, idOrden: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) return;

    try {
      await facturasService.eliminarFactura(idFactura, idOrden);
      loadFacturas(); // Recargar la lista
    } catch (error) {
      console.error('Error deleting factura:', error);
      alert('Error al eliminar la factura');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'PAGADA': return 'success';
      case 'VENCIDA': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Facturas
      </Typography>

      {/* Search Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar por ID Orden, Placa o ID Cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearchFacturaPorOrden}
                disabled={!searchTerm.trim()}
              >
                Por Orden
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearchFacturaPorPlaca}
                disabled={!searchTerm.trim()}
              >
                Por Placa
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearchFacturaPorCliente}
                disabled={!searchTerm.trim()}
              >
                Por Cliente
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  loadFacturas();
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID Factura</TableCell>
              <TableCell>Consecutivo</TableCell>
              <TableCell>ID Orden</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Emisión</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFacturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.consecutivo}</TableCell>
                <TableCell>{factura.ordenId}</TableCell>
                <TableCell>{formatCurrency(factura.impuestos)}</TableCell>
                <TableCell>{formatCurrency(factura.valorTotal)}</TableCell>
                <TableCell>
                  <Chip
                    label={factura.estado}
                    color={getEstadoColor(factura.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(factura.fechaEmision).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteFactura(factura.id, factura.ordenId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredFacturas.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm ? 'No se encontraron facturas con los criterios de búsqueda' : 'No hay facturas registradas'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FacturasPage;