import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase utilizando las variables de entorno proporcionadas por Vite.
// Vite expone las variables a través del objeto `import.meta.env`.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa la aplicación de Firebase con la configuración proporcionada.
// Esto permite interactuar con los servicios de Firebase para este proyecto en particular.
const app = initializeApp(firebaseConfig);

// Inicializa y obtiene la instancia del servicio de Autenticación.
// Lo usaremos para el login y para el muro de privacidad (ProtectedRoute).
export const auth = getAuth(app);

// Inicializa y obtiene la instancia de la base de datos Firestore.
// Firestore será utilizado para almacenar y consultar datos (ej. ReelMemo).
export const db = getFirestore(app);
