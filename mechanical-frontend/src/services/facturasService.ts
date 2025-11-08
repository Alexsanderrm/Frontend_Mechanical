import api from './api';

export interface Factura {
  id: string;
  idOrden: string;
  total: number;
  estado: string;
  fechaEmision: string;
  fechaPago?: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const facturasService = {
  // Obtener factura por orden
  obtenerFacturaPorOrden: async (idOrden: string): Promise<ResponseDTO<Factura>> => {
    const response = await api.get(`/facturas/${idOrden}/ordenes`);
    return response.data;
  },

  // Obtener facturas por placa de vehículo
  obtenerFacturasPorPlaca: async (placa: string): Promise<ResponseDTO<Factura[]>> => {
    const response = await api.get(`/facturas/${placa}/vehiculos`);
    return response.data;
  },

  // Listar todas las facturas
  listarFacturas: async (): Promise<ResponseDTO<Factura[]>> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  // Obtener facturas por cliente
  obtenerFacturasPorCliente: async (idCliente: string): Promise<ResponseDTO<Factura[]>> => {
    const response = await api.get(`/facturas/${idCliente}/factura`);
    return response.data;
  },
};