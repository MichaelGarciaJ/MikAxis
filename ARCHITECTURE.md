# Architectural Design: MikAxis

## Tech Stack
- **Frontend:** React.js + TypeScript (Vite)
- **Routing:** React Router Dom (v6+)
- **Estilos:** CSS puro / Tailwind CSS (Estructura Grid y Flexbox)

## Theme & UI (Cinematic Dark)
### Tema Global (MikAxis)
- Background: `#0F172A`
- Card Background: `#1E293B`
- Accent Color: `#38BDF8` (Sky Blue)
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`

### Tema ReelMemo (Cinematic Dark Red)
- Background: `#1A1110`
- Surface: `#121318`
- Primary: `#FFB4AA` (Rosa/Rojo Claro)
- On Primary: `#561E18`
- Secondary: `#E2C46D` (Dorado)
- On Secondary: `#3C2F00`
- Surface Variant: `#534341`
- On Surface Variant: `#D8C2BE`
- Outline: `#A08C8A`
- **Diseño de Chips (Filtros y Categorías Activas):** Los chips seleccionados (activos) utilizan el color `Secondary` (`var(--rm-secondary)`) de fondo, con texto en `On Secondary` (`var(--rm-on-secondary)`), reflejando un estado resaltado en dorado/amarillo oscuro.
- **Diseño de Chips (Géneros):** Los chips estáticos de géneros (Categorías en detalles) también utilizan el color `Secondary` (`var(--rm-secondary)`) de fondo y texto en `On Secondary` (`var(--rm-on-secondary)`), con un `border-radius: 16px` para efecto píldora suave.

## Componentes Compartidos Principales
Para asegurar la norma DRY (Don't Repeat Yourself), ReelMemo utiliza una biblioteca de componentes modulares en `/src/modules/reelmemo/components/`:
- **`RmChip`**: Representa el botón en forma de píldora (ej: "Películas", "Series", "Géneros"). Solo se usa para botones o etiquetas visuales.
- **`RmDialog`**: Representa el panel flotante (modal) que aparece por encima de la pantalla (ej: Al seleccionar "Todo ▼" o "Categorías ▼"). No es lo mismo que un Chip; de hecho, un Chip puede disparar un Dialog al hacerle clic.
- **`MediaCard` / `MediaGrid`**: Tarjetas estándar que envuelven las carátulas y se conectan mediante `Link` a los detalles de cada obra, incorporando badges (iconos) del tipo de contenido.

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
    /profile      # Módulo de perfil de usuario (vista, configuración y cuenta)
    /reelmemo     # Módulo de gestión de cine y series (con TMDB y Firestore, tema cinemático oscuro)

## Coding Standards & Guidelines
1. **TypeScript Mínimo de Errores:** Todos los archivos deben compilar sin errores de tipos. El uso de `any` está prohibido salvo excepciones muy justificadas, en su lugar se deben declarar `interfaces` o `types`.
2. **Documentación JSDoc:** Todas las funciones, hooks y componentes principales deben contar con un comentario de bloque `/** ... */` explicando su propósito y parámetros.
3. **Responsive Design:** Las vistas siempre deben ser usables en navegadores de escritorio y dispositivos móviles, verificando los media queries (e.g., `@media (max-width: 640px)`).
4. **Nomenclatura Única Global (Kebab-Case):** Se debe utilizar estrictamente `kebab-case` para TODOS los nombres de archivos y carpetas de todo el proyecto MikAxis (ej: `auth-page.tsx`, `media-card.tsx`, `components/`). Evitar el uso de `PascalCase` o `camelCase` en los nombres de archivos (con la excepción de `App.tsx` y `main.tsx` en la raíz). Los nombres de los componentes exportados en React dentro del código se mantienen en `PascalCase` (ej: `export const MediaCard`).
5. **Cero Variables o Importaciones sin uso:** Está terminantemente prohibido declarar variables, componentes o importar librerías que no se estén utilizando en el archivo. Si se deja de usar un elemento (ej: `MediaGrid`), debe eliminarse inmediatamente la importación. Todo el código debe estar limpio y justificado.