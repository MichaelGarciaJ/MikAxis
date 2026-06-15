import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from './components/login-card';
import { RegisterCard } from './components/register-card';
import { ForgotPassword } from './components/forgot-password';
import { GoogleAuthButton } from './components/google-auth-button';
import { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } from '../../data/service/user-service';
import { Logo } from '../../components/logo';
import { useToast } from '../../components/toast-context';
import './auth-page.css';

/**
 * Componente principal de la vista de Autenticación.
 * Maneja los formularios de Login, Registro y Recuperación de contraseña.
 */
export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  /**
   * Intenta iniciar sesión usando correo y contraseña.
   */
  const handleLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await loginWithEmail(email, pass);
      showToast('Sesión iniciada con éxito', 'success');
      navigate('/');
    } catch (err) {
      console.error('Error en autenticación:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Intenta crear una nueva cuenta usando correo, contraseña y nombre.
   */
  const handleRegister = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    try {
      await registerWithEmail(email, pass, name);
      showToast('Cuenta creada con éxito', 'success');
      navigate('/');
    } catch (err) {
      console.error('Error en registro:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ejecuta el flujo de inicio de sesión de Google a través de un popup.
   */
  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      showToast('Autenticado con Google', 'success');
      navigate('/');
    } catch (err) {
      console.error('Error con Google Auth:', err);
      showToast('Error al iniciar sesión con Google.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envía un enlace de recuperación de contraseña al correo dado.
   */
  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await resetPassword(email);
      showToast('Correo de restablecimiento enviado con éxito. Revisa tu bandeja de entrada.', 'success');
      setView('login');
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      const error = err as { code?: string };
      if (error.code === 'auth/user-not-found') {
        showToast('No hay ningún usuario registrado con este correo.', 'error');
      } else {
        showToast('Error al intentar enviar el correo de restablecimiento.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Procesa los errores de autenticación devueltos por Firebase para
   * convertirlos en mensajes amigables para el usuario.
   * @param err - El error crudo lanzado por Firebase.
   */
  const handleAuthError = (err: unknown) => {
    const error = err as { code?: string };
    if (error.code === 'auth/email-already-in-use') {
      showToast('El correo electrónico ya está registrado.', 'error');
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      showToast('Credenciales incorrectas o el usuario no existe.', 'error');
    } else if (error.code === 'auth/weak-password') {
      showToast('La contraseña debe tener al menos 6 caracteres.', 'error');
    } else {
      showToast('Ha ocurrido un error. Por favor, intenta de nuevo.', 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in">
        <div className="login-header">
          <Logo className="login-logo-icon" width={40} height={40} />
          <h1 className="login-title">Mik<span className="accent">Axis</span></h1>
          <p className="login-subtitle">
            {view === 'register' ? 'Crea tu Cuenta' : 
             view === 'forgot' ? 'Recuperar Contraseña' : 
             'Acceso Autorizado Requerido'}
          </p>
        </div>

        {view === 'login' && (
          <LoginCard 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            onForgotClick={() => setView('forgot')} 
          />
        )}

        {view === 'register' && (
          <RegisterCard 
            onSubmit={handleRegister} 
            isLoading={isLoading} 
          />
        )}

        {view === 'forgot' && (
          <ForgotPassword 
            onReset={handleResetPassword} 
            isLoading={isLoading} 
            onCancel={() => setView('login')} 
          />
        )}

        {view !== 'forgot' && (
          <>
            <div className="divider">O</div>

            <GoogleAuthButton 
              onClick={handleGoogle} 
              disabled={isLoading} 
            />

            <div className="toggle-mode">
              {view === 'register' ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
              <button 
                type="button" 
                onClick={() => setView(view === 'register' ? 'login' : 'register')}
                disabled={isLoading}
              >
                {view === 'register' ? 'Inicia Sesión aquí' : 'Regístrate aquí'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
