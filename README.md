# MikAxis

MikAxis es una plataforma web moderna e integrada, diseñada para agrupar múltiples módulos y herramientas bajo un ecosistema único con una estética unificada. Actualmente, el módulo principal alojado en MikAxis es **ReelMemo**, un gestor cinemático personal sincronizado en la nube.

**Live Demo:** [https://reelmemo-ad062.web.app](https://reelmemo-ad062.web.app)

## Características Principales

*   **Ecosistema Unificado:** Un Dashboard (Panel de Control) diseñado con *Glassmorphism* que sirve como puerta de enlace a diferentes aplicaciones modulares.
*   **Módulo ReelMemo:** 
    *   Exploración de películas y series con información detallada, cast y episodios.
    *   Integración nativa con TMDB (The Movie Database).
    *   Gestión de Biblioteca Personal (Seguimiento de "Vistos") con sincronización en tiempo real.
*   **Autenticación y Perfiles:** 
    *   Registro clásico y acceso instantáneo con **Google Auth**.
    *   Módulo de perfil completo con galería de avatares (incluidos avatares generados por IA).
    *   Sincronización total de la foto de perfil y nombre de usuario con la App móvil de ReelMemo.
*   **Diseño Cinematic Dark:** Interfaz de usuario con esquemas de color oscuros (vibrant colors, smooth gradients, micro-animations) optimizada tanto para escritorio como para móviles.

## Tecnologías (Tech Stack)

*   **Frontend:** React.js + TypeScript
*   **Empaquetador:** Vite
*   **Enrutamiento:** React Router DOM (v6+)
*   **Base de Datos & Auth:** Firebase (Firestore, Authentication, Hosting)
*   **Estilos:** CSS puro (CSS Variables, Flexbox, CSS Grid)
*   **Iconografía:** Lucide React

## Instalación y Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/MichaelGarciaJ/MikAxis.git
    cd MikAxis
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Firebase y TMDB:
    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
    EXPO_PUBLIC_TMDB_API_KEY=tu_tmdb_key
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## Arquitectura y Normas

El proyecto sigue lineamientos estrictos de código limpio definidos en [ARCHITECTURE.md](./ARCHITECTURE.md):
*   Nomenclatura global en `kebab-case`.
*   Diseño Responsivo Obligatorio.
*   Cero "any" tolerado en TypeScript.

---
*Desarrollado y diseñado con ❤️ para ofrecer la mejor experiencia visual e interactiva.*
