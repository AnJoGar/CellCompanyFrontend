export interface ForgotPasswordDTO {
    correo: string;
}

export interface ResetPasswordDTO {
    token: string;
    nuevaClave: string;
}