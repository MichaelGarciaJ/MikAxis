import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { UserEntity } from '../entity/user';

/**
 * Registra un usuario nuevo y guarda su documento en Firestore.
 */
export const registerWithEmail = async (email: string, pass: string, name: string): Promise<UserEntity> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  const newUser: UserEntity = {
    correo: user.email,
    nombreUsuario: name,
    fotoUsuario: "",
    idUsuario: user.uid,
    isApproved: false,
    creado: new Date()
  };

  await setDoc(doc(db, 'usuarios', user.uid), newUser);
  return newUser;
};

/**
 * Inicia sesión con correo y contraseña.
 */
export const loginWithEmail = async (email: string, pass: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

/**
 * Inicia sesión con Google, creando el documento en Firestore si no existe.
 */
export const loginWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, 'usuarios', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    const newUser: UserEntity = {
      correo: user.email,
      nombreUsuario: user.displayName || "",
      fotoUsuario: "",
      idUsuario: user.uid,
      isApproved: false,
      creado: new Date()
    };
    await setDoc(userDocRef, newUser);
  }
};

/**
 * Envía un correo de restablecimiento de contraseña.
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Actualiza el nombre de usuario.
 */
export const updateUsername = async (userId: string, newName: string): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, { displayName: newName });
  }
  const userRef = doc(db, 'usuarios', userId);
  await updateDoc(userRef, { nombreUsuario: newName });
};

/**
 * Actualiza el avatar del usuario.
 */
export const updateAvatar = async (userId: string, newAvatarUrl: string): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await updateProfile(user, { photoURL: newAvatarUrl });
  }
  const userRef = doc(db, 'usuarios', userId);
  await updateDoc(userRef, { fotoUsuario: newAvatarUrl });
};

/**
 * Elimina la cuenta del usuario.
 */
export const deleteUserAccount = async (userId: string): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await user.delete();
  }
  await deleteDoc(doc(db, 'usuarios', userId));
};
