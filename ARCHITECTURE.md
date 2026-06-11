# Architectural Design: MikAxis

## Tech Stack
- **Frontend:** React.js + TypeScript (Vite)
- **Routing:** React Router Dom (v6+)
- **Estilos:** CSS puro / Tailwind CSS (Estructura Grid y Flexbox)

## Theme & UI (Cinematic Dark)
- Background: `#0F172A`
- Card Background: `#1E293B`
- Accent Color: `#38BDF8` (Sky Blue)
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`

## Folder Structure
/src
  /components     # Elementos globales (Navbar, ProtectedRoute)
  /data           # Capa de Datos Globales
    /entity       # Definición estricta de TypeScript para modelos (ej: user.ts)
    /service      # Lógica pura del SDK de servicios (ej: user-service.ts)
  /modules        # Funcionalidades aisladas y estructuradas
    /auth         # Módulo de Autenticación
      /components # Componentes visuales puros (login-card.tsx, register-card.tsx, etc.)
      auth-page.tsx # Vista contenedora principal
    /dashboard    # Pantalla de inicio con el menú de módulos
    /reelmemo     # Futuro módulo de cine