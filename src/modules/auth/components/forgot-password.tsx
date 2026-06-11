import React, { useState } from 'react';

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
        <input 
          type="email" 
          id="reset-email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="tu@correo.com"
          required 
        />
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
