import api from './api';

export interface Repuesto {
  id: string;
  nombre: string;
  costoUnitario: number;
  stock: number;
  idProveedor?: string;
}

export interface CrearRepuestoDTO {
  nombre: string;
  costoUnitario: number;
  stock: number;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const repuestosService = {
  crearRepuesto: async (idProveedor: string, repuesto: CrearRepuestoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/repuestos/${idProveedor}`, repuesto);
    return response.data;
  },

  obtenerRepuesto: async (id: string): Promise<ResponseDTO<Repuesto>> => {
    const response = await api.get(`/repuestos/${id}`);
    return response.data;
  },

  actualizarRepuesto: async (idRepuesto: string, idProveedor: string, repuesto: CrearRepuestoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/repuestos/${idRepuesto}/proveedores/${idProveedor}`, repuesto);
    return response.data;
  },

  eliminarRepuesto: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/repuestos/${id}`);
    return response.data;
  },

  obtenerRepuestos: async (): Promise<ResponseDTO<Repuesto[]>> => {
    const response = await api.get('/repuestos');
    return response.data;
  },
};