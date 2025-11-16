import api from './api';

export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefonos: Telefono[];
}

export interface Telefono {
  numero: string;
  tipo: string;
}

export interface CrearProveedorDTO {
  nombre: string;
  email: string;
  telefonos: CrearTelefonoDTO[];
}

export interface CrearTelefonoDTO {
  numero: string;
  tipo: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const proveedoresService = {
  crearProveedor: async (proveedor: CrearProveedorDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post('/proveedores', proveedor);
    return response.data;
  },

  obtenerProveedor: async (id: string): Promise<ResponseDTO<Proveedor>> => {
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  },

  actualizarProveedor: async (id: string, proveedor: CrearProveedorDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/proveedores/${id}`, proveedor);
    return response.data;
  },

  eliminarProveedor: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/proveedores/${id}`);
    return response.data;
  },

  listarProveedores: async (): Promise<ResponseDTO<Proveedor[]>> => {
    const response = await api.get('/proveedores');
    return response.data;
  },
};