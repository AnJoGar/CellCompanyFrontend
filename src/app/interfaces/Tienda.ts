export interface Tienda {
  id: number;
  nombreTienda: string;
  direccion: string;
  nombreEncargado: string;
  cedulaEncargado: string;
  telefono: string;
  fechaRegistro: Date | string;
  comentario:string;
  valorComision:number;

}