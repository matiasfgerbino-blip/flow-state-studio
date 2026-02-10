
# 🧠 FocusHz — App de Concentración con Frecuencias Binaurales y Pomodoro

## Visión General
Una aplicación web de productividad y concentración inspirada en brain.fm, con diseño oscuro futurista, empático y tranquilizador. Combina frecuencias binaurales generadas en el navegador con un sistema Pomodoro flexible y gestión de objetivos.

---

## Diseño Visual
- **Tema oscuro** con acentos naranjas/ámbar (similar a la referencia)
- **Tipografía limpia y grande** para el timer central
- **Fondo de partículas flotantes** animadas durante el modo concentración (estilo cosmos/nebulosa)
- Transiciones suaves entre estados (setup → concentración → descanso)
- Diseño responsive (desktop y mobile)

---

## Páginas y Flujo

### 1. Pantalla Principal — Setup
- **Selector de frecuencia binaural**: Alpha, Beta, Theta, Delta, Gamma — cada una con descripción de su uso (concentración, relajación, creatividad, etc.)
- **Configuración del Pomodoro**: duración de trabajo y descanso personalizables (sliders o inputs numéricos)
- **Número de pomodoros** a completar en la sesión
- Botón "Comenzar sesión"

### 2. Pantalla de Objetivo (antes de iniciar)
- Formulario para escribir el **objetivo principal** de la sesión
- Sección para agregar **subobjetivos** (checklist) que se irán completando durante los pomodoros
- Botón "Iniciar concentración"

### 3. Modo Concentración (pantalla completa inmersiva)
- **Fondo animado** con partículas flotantes moviéndose suavemente
- **Timer central grande** con cuenta regresiva (estilo de la referencia, con borde circular/punteado naranja)
- **Indicador de pomodoro actual**: "Pomodoro 2 de 4"
- **Barra de progreso** visual de los pomodoros completados (dashmarks naranjas como en la referencia)
- **Objetivo principal** visible de forma sutil
- **Subobjetivos** como checklist lateral que se pueden ir marcando sin salir del modo concentración
- **Controles**: Pausar, Reiniciar, Saltar
- **Tiempo total acumulado** de enfoque visible ("Focus time: 3h 50m")
- La música binaural seleccionada suena de fondo con control de volumen

### 4. Modo Descanso
- Cambio visual sutil (partículas más lentas, colores más fríos/tenues)
- Timer de descanso con cuenta regresiva
- Mensaje motivacional o resumen de progreso
- Transición automática al siguiente pomodoro

### 5. Pantalla de Resumen (al finalizar la sesión)
- Pomodoros completados vs. planificados
- Tiempo total de concentración
- Subobjetivos completados vs. totales
- Opción de iniciar nueva sesión

---

## Funcionalidades Clave

### 🎵 Reproductor de Frecuencias Binaurales
- Generadas con **Web Audio API** directamente en el navegador (sin backend)
- Frecuencias disponibles: Alpha (10Hz), Beta (20Hz), Theta (6Hz), Delta (2Hz), Gamma (40Hz)
- Control de volumen
- Descripción de cada frecuencia y para qué sirve

### ⏱️ Sistema Pomodoro Flexible
- Duración de trabajo configurable (ej: 25, 30, 45, 60 min)
- Duración de descanso configurable (ej: 5, 10, 15 min)
- Descanso largo configurable (cada X pomodoros)
- Notificación sonora al cambiar de fase

### 🎯 Gestión de Objetivos
- Objetivo principal obligatorio antes de iniciar
- Subobjetivos opcionales como checklist
- Se pueden marcar como completados durante la sesión
- Progreso visible en todo momento

### 💾 Persistencia con localStorage
- Guardar configuración preferida de pomodoro
- Guardar historial de sesiones recientes
- Recordar última frecuencia usada

---

## Alcance Inicial (MVP)
Todo lo anterior se implementa como una aplicación frontend pura, sin backend, con datos guardados en localStorage. La música se genera con Web Audio API creando tonos binaurales en tiempo real.
