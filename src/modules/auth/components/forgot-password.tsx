import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface Props {
  onReset: (email: string) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export const ForgotPassword: React.FC<Props> = ({ onReset, isLoading, onCancel }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReset(email);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
        Ingresa tu correo para recibir un enlace de restablecimiento.
      </p>
      <div className="form-group">
        <label htmlFor="reset-email">Correo Electrónico</label>
        <div className="input-wrapper">
          <Mail className="input-icon" size={20} />
          <input 
            type="email" 
            id="reset-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="tu@correo.com"
            required 
          />
        </div>
      </div>
      <button type="submit" className="login-button" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Restablecer Contraseña'}
      </button>
      <button 
        type="button" 
        className="forgot-password" 
        onClick={onCancel} 
        style={{marginTop: '16px', textAlign: 'center', width: '100%', display: 'block'}}
      >
        Volver al Inicio de Sesión
      </button>
    </form>
  );
};
