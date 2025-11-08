import api from './api';

export interface Cliente {
  id: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  fechaRegistro: string;
  telefonos: Telefono[];
  direccion: Direccion;
}

export interface Telefono {
  numero: string;
  tipo: string;
}

export interface Direccion {
  calle: string;
  ciudad: string;
  departamento: string;
}

export interface CrearClienteDTO {
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  email: string;
  telefonos: CrearTelefonoDTO[];
  direccion: string;
  barrio: string;
  ciudad: string;
  departamento: string;
}

export interface CrearTelefonoDTO {
  numero: string;
  tipo: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const clientesService = {
  crearCliente: async (cliente: CrearClienteDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  obtenerCliente: async (id: string): Promise<ResponseDTO<Cliente>> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  actualizarCliente: async (id: string, cliente: CrearClienteDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  eliminarCliente: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },

  // Listar órdenes por cliente
  listarOrdenesPorCliente: async (idCliente: string): Promise<ResponseDTO<any[]>> => {
    const response = await api.get(`/clientes/${idCliente}/ordenes`);
    return response.data;
  },

  // Listar servicios y repuestos por vehículo del cliente
  listarServiciosPorVehiculo: async (idCliente: string, placaVehiculo: string): Promise<ResponseDTO<any[]>> => {
    const response = await api.get(`/clientes/${idCliente}/vehiculos/${placaVehiculo}/servicios-repuestos`);
    return response.data;
  },
};