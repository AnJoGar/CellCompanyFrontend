export interface ProductoBodega {
    id: number;
    tiendaId:number;
    tipoProducto: string;
    codigo: string;       // Automático (Generado por la API)
    marca: string;
    modelo: string;
    imei?: string;
    serie?: string;
    color?: string;
    tamano?: string;
    estado: string;
    precioCompra: number;
    precioVenta?: number;
    
    // --- Campos Calculados por la API ---
    fechaIngreso: string; // Proviene de FechaRegistro en el Backend
    diasEnBodega: number; // La API lo calcula al vuelo, no lo envíes en el POST
}