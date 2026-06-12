import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { updateUsername, resetPassword, deleteUserAccount } from '../../data/service/user-service';
import { Edit2, Lock, LogOut, Trash2 } from 'lucide-react';
import './ProfileHome.css';

/**
 * Interfaz para los datos del usuario en Firestore
 */
interface UserData {
  nombreUsuario?: string;
  fotoUsuario?: string;
  creado?: { seconds: number };
}

/**
 * Componente principal del Perfil de Usuario.
 * Permite visualizar datos, editar el nombre, cambiar contraseña y eliminar la cuenta.
 */
export default function ProfileHome() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States for name edit
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'usuarios', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setNewName(docSnap.data().nombreUsuario || currentUser.displayName || '');
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Maneja la actualización del nombre de usuario en Firebase y Firestore.
   * @param e - Evento del formulario
   */
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    try {
      await updateUsername(user.uid, newName);
      setUserData({ ...userData, nombreUsuario: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  /**
   * Maneja el envío de correo para restablecer la contraseña.
   */
  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      alert('Se ha enviado un enlace a tu correo para restablecer tu contraseña.');
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert('Error al enviar el correo de recuperación.');
    }
  };

  /**
   * Maneja la eliminación permanente de la cuenta del usuario.
   */
  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta PERMANENTEMENTE? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;
    
    try {
      await deleteUserAccount(user.uid);
      navigate('/login');
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      const isRecentLoginRequired = error && typeof error === 'object' && 'code' in error && (error as {code: string}).code === 'auth/requires-recent-login';
      
      if (isRecentLoginRequired) {
        alert("Por motivos de seguridad, debes cerrar sesión y volver a iniciarla para eliminar tu cuenta.");
      } else {
        alert("No se pudo eliminar la cuenta. Inténtalo más tarde.");
      }
    }
  };

  /**
   * Cierra la sesión activa del usuario.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  /**
   * Obtiene la inicial del nombre para mostrar en el avatar por defecto.
   * @param name - Nombre del usuario
   * @returns La inicial en mayúscula
   */
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (loading) {
    return <div className="profile-loading">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="profile-loading">No autorizado.</div>;
  }

  const profilePic = userData?.fotoUsuario || user.photoURL || '';
  const displayName = userData?.nombreUsuario || user.displayName || 'Usuario';
  const creationDate = userData?.creado ? new Date(userData.creado.seconds * 1000).toLocaleDateString('es-ES') : 'Desconocida';

  return (
    <div className="profile-home container animate-fade-in">
      <header className="profile-header">
        <h1 className="profile-title">Mi <span className="title-accent">Perfil</span></h1>
        <p className="profile-subtitle">Gestiona tu información personal y ajustes de cuenta</p>
      </header>

      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{getInitials(displayName)}</div>
            )}
          </div>
          <div className="profile-info">
            {isEditingName ? (
              <form className="edit-name-form" onSubmit={handleUpdateName}>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="edit-name-input"
                  autoFocus
                />
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={() => setIsEditingName(false)}>Cancelar</button>
              </form>
            ) : (
              <div className="name-display">
                <h2>{displayName}</h2>
                <button className="btn-icon" onClick={() => setIsEditingName(true)} aria-label="Editar nombre">
                  <Edit2 size={18} />
                </button>
              </div>
            )}
            <p className="user-email">{user.email}</p>
            <p className="user-date">Miembro desde: {creationDate}</p>
          </div>
        </div>

        <div className="profile-sections">
          <section className="settings-section">
            <h3 className="section-title">Ajustes de Seguridad</h3>
            <div className="settings-list">
              <button className="settings-item" onClick={handleResetPassword}>
                <Lock size={20} />
                <span>Cambiar contraseña</span>
                <span className="arrow">›</span>
              </button>
            </div>
          </section>

          <section className="settings-section danger-zone">
            <h3 className="section-title text-danger">Zona Peligrosa</h3>
            <div className="settings-list">
              <button className="settings-item item-logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
              <button className="settings-item item-delete" onClick={handleDeleteAccount}>
                <Trash2 size={20} />
                <span>Eliminar Cuenta Permanentemente</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
