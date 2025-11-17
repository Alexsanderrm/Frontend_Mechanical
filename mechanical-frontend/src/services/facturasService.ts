import api from './api';

export interface Factura {
  id: string;
  consecutivo: string;
  estado: string;
  fechaEmision: string;
  impuestos: number;
  valorTotal: number;
  ordenId: string;
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
    const response = await api.get(`/facturas/${idCliente}/clientes`);
    return response.data;
  },

  // Eliminar una factura
  eliminarFactura: async (idFactura: string, idOrden: string): Promise<ResponseDTO<void>> => {
    const response = await api.delete(`/facturas/${idFactura}/ordenes/${idOrden}`);
    return response.data;
  },
};