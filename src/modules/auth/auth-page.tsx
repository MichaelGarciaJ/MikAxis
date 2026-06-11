import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from './components/login-card';
import { RegisterCard } from './components/register-card';
import { ForgotPassword } from './components/forgot-password';
import { GoogleAuthButton } from './components/google-auth-button';
import { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } from '../../data/service/user-service';
import './auth-page.css';

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await loginWithEmail(email, pass);
      navigate('/');
    } catch (err: any) {
      console.error('Error en autenticación:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await registerWithEmail(email, pass, name);
      navigate('/');
    } catch (err: any) {
      console.error('Error en registro:', err);
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error('Error con Google Auth:', err);
      setError('Error al iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await resetPassword(email);
      setSuccessMessage('Correo de restablecimiento enviado con éxito. Revisa tu bandeja de entrada.');
      setView('login');
    } catch (err: any) {
      console.error('Error al restablecer contraseña:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No hay ningún usuario registrado con este correo.');
      } else {
        setError('Error al intentar enviar el correo de restablecimiento.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (err: any) => {
    if (err.code === 'auth/email-already-in-use') {
      setError('El correo electrónico ya está registrado.');
    } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      setError('Credenciales incorrectas o el usuario no existe.');
    } else if (err.code === 'auth/weak-password') {
      setError('La contraseña debe tener al menos 6 caracteres.');
    } else {
      setError('Ha ocurrido un error. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in">
        <div className="login-header">
          <svg className="login-logo-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L20 20M4 20L20 4" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
          </svg>
          <h1 className="login-title">Mik<span className="accent">Axis</span></h1>
          <p className="login-subtitle">
            {view === 'register' ? 'Crea tu Cuenta' : 
             view === 'forgot' ? 'Recuperar Contraseña' : 
             'Acceso Autorizado Requerido'}
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {successMessage && <div className="login-success">{successMessage}</div>}

        {view === 'login' && (
          <LoginCard 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            onForgotClick={() => { setView('forgot'); setError(''); setSuccessMessage(''); }} 
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
            onCancel={() => { setView('login'); setError(''); setSuccessMessage(''); }} 
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
                onClick={() => {
                  setView(view === 'register' ? 'login' : 'register');
                  setError('');
                  setSuccessMessage('');
                }}
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
