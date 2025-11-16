import api from './api';

export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  idPropietario: string;
}

export interface CrearVehiculoDTO {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
}

export interface ResponseDTO<T> {
  error: boolean;
  mensaje: T;
}

export const vehiculosService = {
  crearVehiculo: async (idCliente: string, vehiculo: CrearVehiculoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.post(`/vehiculos/${idCliente}/clientes`, vehiculo);
    return response.data;
  },

  obtenerVehiculo: async (id: string): Promise<ResponseDTO<Vehiculo>> => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  },

  actualizarVehiculo: async (id: string, idCliente: string, vehiculo: CrearVehiculoDTO): Promise<ResponseDTO<string>> => {
    const response = await api.put(`/vehiculos/${id}/clientes/${idCliente}`, vehiculo);
    return response.data;
  },

  eliminarVehiculo: async (id: string): Promise<ResponseDTO<string>> => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },

  listarVehiculos: async (): Promise<ResponseDTO<Vehiculo[]>> => {
    const response = await api.get('/vehiculos');
    return response.data;
  },
};