export interface Usuario {
    
    id: number;
    nombreApellidos: string;
    correo: string;
    rolAdminId: number;
    rolDescripcion: string;
    clave: string;
    esActivo:number;
}