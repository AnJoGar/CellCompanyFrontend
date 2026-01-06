export interface ProductoBodega {
    id: number;
    tiendaId:number;
    tipoProducto: string;
    propietarioDelProducto:string;
    codigo: string;       // Automático (Generado por la API)
    marca: string;
    modelo: string;
    imei?: string;
    imeI2?: string;
    serie?: string;
    color?: string;
    tamano?: string;
    estado: string;
    precioCompra: number;
    precioVentaCredito?: number;
    precioVentaContado?:number;
    observaciones?:string;
    
    // --- Campos Calculados por la API ---
    fechaIngreso: string; // Proviene de FechaRegistro en el Backend
    diasEnBodega: number; // La API lo calcula al vuelo, no lo envíes en el POST
}