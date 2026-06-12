import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <div className="input-wrapper">
          <Mail className="input-icon" size={20} />
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="tu@correo.com"
            required 
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <div className="input-wrapper">
          <Lock className="input-icon" size={20} />
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            className="has-toggle"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
          <button 
            type="button" 
            className="password-toggle" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
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
