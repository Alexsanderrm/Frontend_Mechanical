import api from './api';

export interface Mecanico {
  id: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  experiencia: number;
  salario: number;
  especializacion: string[];
}

export interface CrearMecanicoDTO {
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  experiencia: number;
  salario: number;
  especializacion: string[];
}

export interface EstadisticasMecanico {
  totalOrdenes: number;
  totalHorasTrabajadas: number;
  serviciosRealizados: number;
  promedioHorasPorOrden: number;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const mecanicosService = {
  crearMecanico: async (mecanico: CrearMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post('/mecanicos', mecanico);
    return response.data;
  },

  obtenerMecanico: async (id: string): Promise<ResponseDTO<Mecanico>> => {
    const response = await api.get(`/mecanicos/${id}`);
    return response.data;
  },

  actualizarMecanico: async (id: string, mecanico: CrearMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/mecanicos/${id}`, mecanico);
    return response.data;
  },

  eliminarMecanico: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/mecanicos/${id}`);
    return response.data;
  },

  listarMecanicos: async (): Promise<ResponseDTO<Mecanico[]>> => {
    const response = await api.get('/mecanicos');
    return response.data;
  },

  // Obtener estadísticas de mecánico
  obtenerEstadisticas: async (id: string): Promise<ResponseDTO<EstadisticasMecanico>> => {
    const response = await api.get(`/mecanicos/${id}/estadisticas`);
    return response.data;
  },

  // Listar servicios por mecánico
  listarServiciosPorMecanico: async (id: string): Promise<ResponseDTO<any[]>> => {
    const response = await api.get(`/mecanicos/${id}/servicios`);
    return response.data;
  },
};