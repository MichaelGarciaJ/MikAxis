import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * ProtectedRoute es un componente contenedor que actúa como un "Muro de Privacidad".
 * Su función es verificar el estado de autenticación del usuario a través de Firebase Auth.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {JSX.Element} props.children - Los componentes hijos a renderizar si el usuario está autenticado.
 * @returns {JSX.Element} - Retorna a los hijos si hay usuario, redirige a /login de lo contrario.
 */
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isApproved, setIsApproved] = useState(true);

  useEffect(() => {
    // onAuthStateChanged establece un listener (observador) que se activa
    // cada vez que el estado de autenticación cambia (login, logout).
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Verificar si el usuario está aprobado en Firestore
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.isApproved === false) {
              setIsApproved(false);
            } else {
              setIsApproved(true);
            }
          } else {
            // Por seguridad, si no hay documento asumimos false
            setIsApproved(false);
          }
        } catch (error) {
          console.error("Error al verificar la aprobación del usuario:", error);
          setIsApproved(false);
        }
      } else {
        setIsApproved(true);
      }
      
      setUser(currentUser);
      setLoading(false); // Una vez verificado, quitamos el estado de carga
    });

    // Función de limpieza: desuscribe el listener cuando el componente se desmonta.
    return () => unsubscribe();
  }, []);

  // Si aún estamos verificando la autenticación, podemos mostrar una pantalla de carga.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>
        Cargando...
      </div>
    );
  }

  // Si no hay un usuario autenticado, redirigir a login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no está aprobado, mostrar vista persistente
  if (!isApproved) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: 'var(--bg-color)', 
        color: 'var(--text-primary)', 
        textAlign: 'center', 
        padding: '20px' 
      }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '16px', fontSize: '28px' }}>Acceso Restringido</h2>
        <p style={{ maxWidth: '400px', lineHeight: '1.6', fontSize: '16px', color: 'var(--text-secondary)' }}>
          Acceso autorizado requerido. Tu cuenta está en lista de espera para ser aprobada por el administrador.
        </p>
        <button 
          onClick={() => signOut(auth)} 
          style={{ 
            marginTop: '32px', 
            padding: '12px 24px', 
            backgroundColor: 'transparent', 
            color: 'var(--accent-color)', 
            border: '1px solid var(--accent-color)', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'var(--accent-color)';
            e.target.style.color = '#0F172A';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--accent-color)';
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si hay usuario autenticado y está aprobado, renderizamos el contenido protegido.
  return children;
}
