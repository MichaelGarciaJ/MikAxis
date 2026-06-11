/**
 * Interfaz estricta de TypeScript para el usuario de Firestore.
 */
export interface UserEntity {
  idUsuario: string;
  correo: string | null;
  nombreUsuario: string;
  fotoUsuario: string;
  isApproved: boolean;
  creado: Date | any;
  rol?: string;
  modulosPermitidos?: string[];
}
