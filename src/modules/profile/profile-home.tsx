import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { updateUsername, resetPassword, deleteUserAccount, updateAvatar } from '../../data/service/user-service';
import { Edit2, Lock, LogOut, Trash2, Camera } from 'lucide-react';
import { useToast } from '../../components/toast-context';
import { Logo } from '../../components/logo';
import './profile-home.css';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  // Cargamos la lista dinámicamente desde la carpeta public en tiempo de compilación
  const avatarModules = import.meta.glob('/public/avatars/*.{png,jpg,jpeg}', { eager: true });
  const avatarsList = Object.keys(avatarModules).map(key => key.replace('/public', ''));
  
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      showToast('Se ha enviado un enlace a tu correo para restablecer tu contraseña.', 'success');
    } catch (error) {
      console.error("Error sending reset email:", error);
      showToast('Error al enviar el correo de recuperación.', 'error');
    }
  };

  /**
   * Maneja la eliminación permanente de la cuenta del usuario.
   */
  const handleDeleteAccount = async () => {
    if (!user) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteUserAccount(user.uid);
      navigate('/login');
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      const isRecentLoginRequired = error && typeof error === 'object' && 'code' in error && (error as {code: string}).code === 'auth/requires-recent-login';
      
      if (isRecentLoginRequired) {
        showToast("Por seguridad, cierra sesión y vuelve a iniciarla para eliminar tu cuenta.", "warning", 5000);
      } else {
        showToast("No se pudo eliminar la cuenta. Inténtalo más tarde.", "error");
      }
    } finally {
      setShowDeleteModal(false);
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
   * Actualiza la foto de perfil con un avatar local.
   */
  const handleSelectAvatar = async (avatarUrl: string) => {
    if (!user) return;
    try {
      await updateAvatar(user.uid, avatarUrl);
      if (userData) {
        setUserData({ ...userData, fotoUsuario: avatarUrl });
      }
      setShowAvatarModal(false);
      showToast('Foto de perfil actualizada.', 'success');
    } catch (error) {
      console.error("Error updating avatar:", error);
      showToast('Error al actualizar la foto de perfil.', 'error');
    }
  };

  if (loading) {
    return <div className="profile-loading">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="profile-loading">No autorizado.</div>;
  }

  const profilePic = userData?.fotoUsuario || '';
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
          <div className="profile-avatar-large" onClick={() => setShowAvatarModal(true)} style={{ cursor: 'pointer', position: 'relative' }}>
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder" style={{ background: 'transparent' }}><Logo width={64} height={64} /></div>
            )}
            <div className="avatar-edit-overlay">
              <Camera size={28} />
            </div>
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

      {showDeleteModal && (
        <div className="profile-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <h3 className="profile-modal-title">¿Eliminar cuenta?</h3>
            <p className="profile-modal-desc">
              Esta acción es <strong>irreversible</strong> y perderás todos tus datos permanentemente.
            </p>
            <div className="profile-modal-actions">
              <button className="profile-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="profile-btn-danger" onClick={confirmDeleteAccount}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {showAvatarModal && (
        <div className="profile-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3 className="profile-modal-title">Elige un Avatar</h3>
            <p className="profile-modal-desc" style={{ marginBottom: '10px' }}>
              Selecciona una foto de perfil de nuestra galería.
            </p>
            
            <div className="avatar-grid">
              {/* Option to clear avatar and use MikAxis logo */}
              <div 
                className={`avatar-option ${profilePic === '' ? 'selected' : ''}`}
                style={{ background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleSelectAvatar('')}
                title="Usar Logo de MikAxis"
              >
                <Logo width={40} height={40} />
              </div>

              {/* Option to use ReelMemo logo */}
              <div 
                className={`avatar-option ${profilePic === '/reelmemo-logo.png' ? 'selected' : ''}`}
                style={{ background: '#1A1110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleSelectAvatar('/reelmemo-logo.png')}
                title="Usar Logo de ReelMemo"
              >
                <img src="/reelmemo-logo.png" alt="ReelMemo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </div>

              {avatarsList.map((avatar, index) => (
                <img 
                  key={index}
                  src={avatar} 
                  alt={`Avatar ${index + 1}`} 
                  className={`avatar-option ${profilePic === avatar ? 'selected' : ''}`}
                  onClick={() => handleSelectAvatar(avatar)}
                />
              ))}
            </div>

            <div className="profile-modal-actions" style={{ justifyContent: 'center', marginTop: '10px' }}>
              <button className="profile-btn-cancel" style={{ width: '100%' }} onClick={() => setShowAvatarModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
