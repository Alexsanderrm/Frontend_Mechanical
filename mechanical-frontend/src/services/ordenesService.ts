import api from './api';

export interface Orden {
  id: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  fechaIngreso?: string;
  fechaSalida?: string;
  idCliente: string;
  idVehiculo: string;
}

export interface CrearOrdenDTO {
  descripcion: string;
  fechaIngreso: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export interface AsignarMecanicoDTO {
  rol: string;
}

export interface DiagnosticoDTO {
  diagnosticoInicial: string;
  diagnosticoFinal: string;
}

export interface ServicioMecanicoDTO {
  rol: string;
  horasTrabajadas: number;
  fechaAsignacion: string;
}

export const ordenesService = {
  crearOrden: async (idCliente: string, orden: CrearOrdenDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/ordenes/${idCliente}/vehiculo`, orden);
    return response.data;
  },

  obtenerOrden: async (id: string): Promise<ResponseDTO<Orden>> => {
    const response = await api.get(`/ordenes/${id}`);
    return response.data;
  },

  actualizarOrden: async (id: string, orden: Partial<CrearOrdenDTO>): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/ordenes/${id}`, orden);
    return response.data;
  },

  eliminarOrden: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/ordenes/${id}`);
    return response.data;
  },

  listarOrdenes: async (): Promise<ResponseDTO<Orden[]>> => {
    const response = await api.get('/ordenes');
    return response.data;
  },

  // Asignar mecánico a orden
  asignarMecanico: async (idOrden: string, idMecanico: string, asignacion: AsignarMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.patch(`/ordenes/${idOrden}/mecanicos/${idMecanico}`, asignacion);
    return response.data;
  },

  // Eliminar mecánico de orden
  eliminarMecanicoDeOrden: async (idOrden: string, idMecanico: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/ordenes/${idOrden}/mecanicos/${idMecanico}`);
    return response.data;
  },

  // Obtener mecánicos por orden
  obtenerMecanicosPorOrden: async (idOrden: string): Promise<ResponseDTO<any[]>> => {
    const response = await api.get(`/ordenes/${idOrden}/mecanicos`);
    return response.data;
  },

  // Registrar diagnóstico
  registrarDiagnostico: async (idOrden: string, diagnostico: DiagnosticoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/ordenes/${idOrden}/diagnosticos`, diagnostico);
    return response.data;
  },

  // Obtener diagnóstico
  obtenerDiagnostico: async (idOrden: string): Promise<ResponseDTO<any>> => {
    const response = await api.get(`/ordenes/${idOrden}/diagnosticos`);
    return response.data;
  },

  // Registrar servicio-mecánico en orden
  registrarServicioMecanico: async (idOrden: string, idMecanico: string, idServicio: string, servicio: ServicioMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/ordenes/${idOrden}/mecanicos/${idMecanico}/servicios/${idServicio}`, servicio);
    return response.data;
  },

  // Actualizar detalle de servicio-mecánico
  actualizarServicioMecanico: async (idOrden: string, idMecanico: string, idServicio: string, servicio: ServicioMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/ordenes/${idOrden}/mecanicos/${idMecanico}/servicios/${idServicio}`, servicio);
    return response.data;
  },

  // Obtener detalle de orden
  obtenerDetalleOrden: async (idOrden: string): Promise<ResponseDTO<any>> => {
    const response = await api.get(`/ordenes/${idOrden}/detalle`);
    return response.data;
  },
};