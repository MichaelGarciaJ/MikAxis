import React, { useState } from 'react';

interface Props {
  onSubmit: (email: string, pass: string) => void;
  isLoading: boolean;
  onForgotClick: () => void;
}

/**
 * Componente puro del formulario de Login.
 */
export const LoginCard: React.FC<Props> = ({ onSubmit, isLoading, onForgotClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="tu@correo.com"
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="••••••••"
          required 
        />
      </div>

      <button 
        type="button" 
        className="forgot-password" 
        onClick={onForgotClick}
        disabled={isLoading}
      >
        ¿Olvidaste tu contraseña?
      </button>

      <button type="submit" className="login-button" disabled={isLoading}>
        {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};
