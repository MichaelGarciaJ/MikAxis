# Task Board: MikAxis

## Todo

## In Progress

## Done
- [x] Desplegar la aplicación web MikAxis en Firebase Hosting.
- [x] Implementar selector de avatares con lista dinámica (import.meta.glob) y estilos de cuadrícula responsiva, incluyendo opciones de logos de MikAxis y ReelMemo.
- [x] Unificar diseño del logotipo (crear componente Logo, sincronizar favicon y refactorizar auth y navbar).
- [x] Refactorizar la Biblioteca (Vistos) para que el chip 'Todo' funcione como un desplegable (modal) idéntico a Categorías.
- [x] Añadir botón 'X' en Detalles para cerrar todas las ventanas anidadas y volver directamente al Home.
- [x] Optimizar la cuadrícula (`MediaGrid`) en dispositivos móviles para mostrar siempre 3 columnas en lugar de 1.
- [x] Crear un sistema global de Notificaciones (`ToastProvider`) para todo MikAxis que informe de errores, éxitos y esperas de forma elegante.
- [x] Añadir sinopsis (resumen) y duración (minutos) en la lista de episodios de la vista Detalles.
- [x] Reemplazar la flecha de regreso al Dashboard en el encabezado principal por un icono intuitivo (`LayoutDashboard`).
- [x] Rediseñar MediaCard: Añadir icono de TV/Cine arriba a la derecha, eliminar acciones onHover y hacer toda la tarjeta clickeable hacia Detalles.
- [x] Extraer modal en un componente reutilizable (`RmDialog`) y limpiar imports muertos/no definidos en todo el proyecto pasando TypeScript Exhaustivo.
- [x] Refactorizar la vista "Home" para que los carruseles filtren y cambien sus datos según el chip seleccionado (Películas/Series/Todo).
- [x] Mejorar el diseño del "AppDialog" de Categorías para que se vea premium y estilizado como en la app móvil.
- [x] Refactorizar la vista "Detalles" para incluir Pestañas (Reparto, Similares, Episodios) como en la versión original.
- [x] Sincronizar el comportamiento exacto de Firestore de ReelMemo (tracking de episodios, watchedEpisodes) en `media-service.ts` de MikAxis.
- [x] Correcciones de Fidelidad ReelMemo (Home, Vistos, Detalles y Firestore).
- [x] Mejorar Home: Añadir cartel destacado (estilo Netflix) y chip de "Categorías".
- [x] Arreglar Vistos (Library): Eliminar lupa duplicada e implementar la funcionalidad del filtro (películas/series) adaptado a Web.
- [x] Mejorar la Biblioteca añadiendo los chips o filtros exactos de la app móvil.
- [x] Arreglar el espacio/apartado azul (layout) para que el tema oscuro de ReelMemo cubra toda la pantalla correctamente.
- [x] Implementar el "Home" de ReelMemo con sus respectivos carruseles (Tendencias, Mejor valoradas, etc.).
- [x] Crear un sistema de pestañas/navegación interna para ReelMemo (Home, Búsqueda, Biblioteca).
- [x] Renombrar archivos antiguos (`DashboardHome.tsx`, `ProfileHome.tsx`, etc.) a formato `kebab-case` para cumplir con la nueva regla de arquitectura.
- [x] Añadir botón de retroceso (volver al dashboard) a ReelMemoPage.
- [x] Actualizar App.tsx para que importe y renderice ReelMemoPage.
- [x] Eliminar archivos antiguos: ReelMemoHome.tsx y ReelMemoHome.css.
- [x] Validar fidelidad de diseño entre ReelMemo web y la app móvil original.
- [x] Creación de nuevo módulo `profile` basado en la lógica de ReelMemo.
- [x] Mejora de Navbar: Remover enlaces redundantes e integrar menú desplegable de perfil.
- [x] Rediseño del Dashboard: Eliminar tarjetas superiores para destacar grid de módulos, quitar 'Fase' y aplicar diseño de tarjetas Premium (Glassmorphism, resplandor, hover 3D).
- [x] Purga de seguridad: borrar repo remoto y local `.git` para proteger claves.
- [x] Reconstrucción de arquitectura limpia y nombres kebab-case (estándar ReelMemo).
- [x] Migración completa a TypeScript.
- [x] Refactorización modular del módulo Auth con arquitectura limpia.
- [x] Añadir alternancia entre Login y Registro.
- [x] Lógica de registro y flujo de aprobación en Firestore (isApproved: false) con vista persistente en Muro de Privacidad.
- [x] Integrar Botón de inicio de sesión con Google profesional.
- [x] Implementar funcionalidad de recuperación de contraseña.
- [x] Eliminar imports no utilizados (React) y limpiar ESLint warnings.
- [x] Configuración inicial Firebase, .env y Muro de Privacidad (ProtectedRoute).
- [x] Creación de Login.jsx con diseño Cinematic Dark.
- [x] Definición de alcance y stack tecnológico.
- [x] Inicializar repositorio Git local en carpeta `MikAxis`.
- [x] Crear repositorio remoto privado en GitHub llamado `MikAxis` usando GitHub CLI (`gh`).
- [x] Crear proyecto React con Vite dentro de la estructura.
- [x] Configurar variables de entorno y estilos globales con la paleta de colores.
- [x] Diseñar el componente DashboardHome (Index con tarjetas de navegación).