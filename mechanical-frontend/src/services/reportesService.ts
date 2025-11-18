import api from './api';

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const reportesService = {
  // Reporte 1: Lista de todas las órdenes
  generarReporteOrdenes: async (): Promise<Blob> => {
    const response = await api.get('/reportes/ordenes/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 2: Lista de todos los repuestos disponibles
  generarReporteRepuestos: async (): Promise<Blob> => {
    const response = await api.get('/reportes/repuestos/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 3: Lista de todos los servicios disponibles
  generarReporteServicios: async (): Promise<Blob> => {
    const response = await api.get('/reportes/servicios/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 4: Lista de mecánicos implícitos en una orden
  generarReporteMecanicosPorOrden: async (idOrden: string): Promise<Blob> => {
    const response = await api.get(`/reportes/mecanicos/${idOrden}/ordenes/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 5: Lista de órdenes del cliente
  generarReporteOrdenesPorCliente: async (idCliente: string): Promise<Blob> => {
    const response = await api.get(`/reportes/ordenes/${idCliente}/clientes/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 6 (Intermedio): Ingresos totales por órdenes finalizadas
  generarReporteIngresos: async (): Promise<Blob> => {
    const response = await api.get('/reportes/ingresos/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 7 (Intermedio): Promedio de horas trabajadas por mecánico
  generarReportePromedioHoras: async (): Promise<Blob> => {
    const response = await api.get('/reportes/promedio-horas/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 8 (Complejo): Órdenes que incluyen un repuesto específico
  generarReporteOrdenesPorRepuesto: async (idRepuesto: string): Promise<Blob> => {
    const response = await api.get(`/reportes/ordenes-repuestos/${idRepuesto}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 9 (Complejo): Facturas en un rango de fechas con detalles de órdenes
  generarReporteFacturasPorFechas: async (fechaInicio: string, fechaFin: string): Promise<Blob> => {
    const response = await api.post('/reportes/facturas-fechas/pdf', {
      fechaInicio,
      fechaFin,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Reporte 10 (Complejo): Mecánicos con órdenes pendientes y repuestos asignados
  generarReporteMecanicosPendientes: async (): Promise<Blob> => {
    const response = await api.get('/reportes/mecanicos-pendientes/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};