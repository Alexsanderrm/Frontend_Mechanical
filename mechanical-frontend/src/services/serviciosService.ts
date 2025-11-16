import api from './api';

export interface Servicio {
  id: string;
  tipoServicio: string;
  descripcion: string;
  fechaCreacion: string;
  costoUnitario: number;
}

export interface CrearServicioDTO {
  tipoServicio: string;
  descripcion: string;
  costoUnitario: number;
  fechaCreacion: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const serviciosService = {
  crearServicio: async (servicio: CrearServicioDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post('/servicios', servicio);
    return response.data;
  },

  obtenerServicio: async (id: string): Promise<ResponseDTO<Servicio>> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  actualizarServicio: async (id: string, servicio: CrearServicioDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/servicios/${id}`, servicio);
    return response.data;
  },

  eliminarServicio: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
  },

  // Obtener todos los servicios
  obtenerServicios: async (): Promise<ResponseDTO<Servicio[]>> => {
    const response = await api.get('/servicios');
    return response.data;
  },
};