import api from './api';

export interface Orden {
  id: string;
  descripcion: string;
  fechaIngreso: string | null;
  fechaSalida: string | null;
  estado: string;
  diagnosticoInicial: string | null;
  diagnosticoFinal: string | null;
  placa: string;
}

export interface CrearOrdenDTO {
  descripcion: string;
  fechaIngreso?: string;
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
  idNuevoMecanico?: string;
  idNuevoServicio?: string;
}

export interface AsignarRepuestoDTO {
  cantidad: number;
}

export interface RepuestoOrden {
  id: string;
  nombre: string;
  costoUnitario: number;
  cantidad: number;
  idRepuesto: string;
  idServicio: string;
  idOrden: string;
}

export const ordenesService = {
  crearOrden: async (idVehiculo: string, orden: CrearOrdenDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/ordenes/${idVehiculo}/vehiculo`, orden);
    return response.data;
  },

  obtenerOrden: async (id: string): Promise<ResponseDTO<Orden>> => {
    const response = await api.get(`/ordenes/${id}`);
    return response.data;
  },

  actualizarOrden: async (id: string, orden: { fechaIngreso: string; fechaSalida?: string | null; descripcion: string; idVehiculo: string }): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/ordenes/${id}`, orden);
    return response.data;
  },

  eliminarOrden: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/ordenes/${id}`);
    return response.data;
  },

  // Finalizar orden (crea factura internamente)
  finalizarOrden: async (idOrden: string): Promise<ResponseDTO<string>> => {
    const response = await api.patch(`/ordenes/${idOrden}`);
    return response.data;
  },

  obtenerTodasLasOrdenes: async (): Promise<ResponseDTO<Orden[]>> => {
    const response = await api.get('/ordenes');
    return response.data;
  },

  listaOrdenesPorCliente: async (idCliente: string): Promise<ResponseDTO<Orden[]>> => {
    const response = await api.get(`/ordenes/cliente/${idCliente}`);
    return response.data;
  },

  // Asignar mecánico a orden
  asignarMecanico: async (idOrden: string, idMecanico: string, rol: { rol: string }): Promise<ResponseDTO<string>> => {
    const response = await api.patch(`/ordenes/${idOrden}/mecanicos/${idMecanico}`, rol);
    return response.data;
  },

  // Eliminar mecánico de orden
  eliminarMecanico: async (idOrden: string, idMecanico: string): Promise<ResponseDTO<string>> => {
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
  obtenerDiagnostico: async (idOrden: string): Promise<ResponseDTO<DiagnosticoDTO>> => {
    const response = await api.get(`/ordenes/${idOrden}/diagnosticos`);
    return response.data;
  },

  // Registrar servicio en orden
  registrarServicio: async (idOrden: string, idMecanico: string, idServicio: string, detalle: ServicioMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/ordenes/${idOrden}/mecanicos/${idMecanico}/servicios/${idServicio}`, detalle);
    return response.data;
  },

  // Actualizar detalle de servicio
  actualizarDetalleServicio: async (idOrden: string, idMecanico: string, idServicio: string, detalle: ServicioMecanicoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/ordenes/${idOrden}/mecanicos/${idMecanico}/servicios/${idServicio}`, detalle);
    return response.data;
  },

  // Obtener detalle de orden
  obtenerDetalleOrden: async (idOrden: string): Promise<ResponseDTO<any[]>> => {
    const response = await api.get(`/ordenes/${idOrden}/detalle`);
    return response.data;
  },

  // CRUD para repuestos en órdenes

  // Asignar repuesto a servicio en orden (Create)
  asignarRepuesto: async (idRepuesto: string, idServicio: string, idOrden: string, data: any): Promise<ResponseDTO<string>> => {
    console.log('Asignando repuesto - Endpoint:', `/ordenes/${idOrden}/repuestos/${idRepuesto}/servicios/${idServicio}`);
    console.log('Body enviado:', data);
    const response = await api.post(`/ordenes/${idOrden}/repuestos/${idRepuesto}/servicios/${idServicio}`, data);
    console.log('Respuesta asignar:', response);
    return response.data;
  },

  // Obtener repuestos por servicio en orden (Read)
  obtenerRepuestosPorServicio: async (idOrden: string, idServicio: string): Promise<ResponseDTO<RepuestoOrden[]>> => {
    const response = await api.get(`/ordenes/${idOrden}/servicios/${idServicio}`);
    return response.data;
  },

  // Actualizar cantidad de repuesto en orden (Update)
  actualizarRepuestoOrden: async (idRepuesto: string, idServicio: string, idOrden: string, data: any): Promise<ResponseDTO<string>> => {
    const response = await api.patch(`/ordenes/${idOrden}/repuestos/${idRepuesto}/servicios/${idServicio}`, data);
    return response.data;
  },

  // Eliminar repuesto de orden (Delete)
  eliminarRepuestoOrden: async (idRepuesto: string, idServicio: string, idOrden: string): Promise<ResponseDTO<string>> => {
    console.log('Llamando DELETE:', `/ordenes/${idOrden}/repuestos/${idRepuesto}/servicios/${idServicio}`);
    const response = await api.delete(`/ordenes/${idOrden}/repuestos/${idRepuesto}/servicios/${idServicio}`);
    console.log('Respuesta DELETE:', response);
    return response.data;
  },
};