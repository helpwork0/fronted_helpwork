# HelpWork — Frontend

Interfaz web de HelpWork construida con **React 18 + TypeScript + Vite**, animaciones con
**Framer Motion** y estilos con **Tailwind CSS**. Está preparada para conectarse a un backend
(Express) sin tener que reescribir componentes.

---

## 1. Cómo ejecutarlo

Necesitas **Node.js 18 o superior**. Verifica con `node -v`.

```bash
# 1. Entrar a la carpeta
cd helpwork-frontend

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Copiar las variables de entorno
cp .env.example .env      # en Windows:  copy .env.example .env

# 4. Levantar el servidor de desarrollo
npm run dev
```

Se abre solo en **http://localhost:5173**.

| Comando           | Qué hace                                                        |
|-------------------|-----------------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con recarga en caliente                   |
| `npm run build`   | Compila a `dist/` listo para producción                          |
| `npm run preview` | Sirve `dist/` para probar la versión compilada                   |
| `npm run lint`    | Revisa que no haya errores de TypeScript                         |

### Rutas para probar

| Ruta                  | Pantalla                                        |
|-----------------------|-------------------------------------------------|
| `/`                   | Landing completa con todas las animaciones      |
| `/iniciar-sesion`     | Login (con la guía de la mascota)               |
| `/registro/rol`       | Selección de rol                                |
| `/registro`           | Registro en 3 pasos                             |
| `/app/solicitante`    | Panel del solicitante                           |
| `/app/helpworker`     | Panel del HelpWorker                            |
| `/app/matching`       | Resultados del matching inteligente             |

---

## 2. Estructura del proyecto

La regla es simple: **`components/` es genérico y reutilizable; `features/` es específico
de una parte del producto.** Si un componente lo usarían dos features distintas, va en
`components/`.

```
src/
├── app/                     Arranque de la aplicación
│   ├── router.tsx           Todas las rutas y los menús de cada panel
│   ├── providers.tsx        Proveedores globales (aquí se apilan los nuevos)
│   └── ScrollToTop.tsx      Vuelve arriba al cambiar de página
│
├── config/
│   └── site.config.ts       Rutas, enlaces de navegación y textos fijos
│
├── types/index.ts           Tipos del dominio (User, ServiceRequest, MatchCandidate…)
│
├── lib/
│   ├── cn.ts                Utilidad para combinar clases de Tailwind
│   ├── api/http.ts          Cliente HTTP único (fetch + token + errores)
│   ├── api/endpoints.ts     Catálogo de rutas del backend
│   └── motion/variants.ts   Curvas y variantes de animación compartidas
│
├── hooks/                   Lógica reutilizable
│   ├── useScrollY.ts        Detecta si ya se hizo scroll (para la barra)
│   ├── useElementRect.ts    Sigue un elemento en pantalla (para el tour)
│   └── useLockBodyScroll.ts Bloquea el scroll en modales
│
├── components/              Piezas genéricas, sin lógica de negocio
│   ├── ui/                  Button, Card, Input, Badge, Toggle, Container…
│   ├── motion/              Reveal, WordsReveal, Marquee, Parallax
│   ├── mascot/              Mascot (poses) y MascotChat (conversación)
│   ├── layout/              Navbar, Footer, Logo, PublicLayout, DashboardLayout
│   └── onboarding/          Guías interactivas (una por pantalla)
│
├── features/                Cada carpeta = una parte del producto
│   ├── marketing/           Landing: sections/ + pages/
│   ├── auth/                Login, registro, rol y sesión
│   ├── messages/            Mensajería: contexto, desplegable y mini chats
│   └── dashboard/           Paneles y matching
│
├── data/mock.ts             Datos de prueba (se borran al conectar el backend)
└── styles/index.css         Variables, capa base y clases .glass
```

**Por qué esta estructura escala:** agregar una sección nueva a la landing es crear un
archivo en `features/marketing/sections/` y añadirlo a `HomePage.tsx`. Agregar una pantalla
privada es crear la página y una línea en `router.tsx`. Nada más se toca.

---

## 3. Las animaciones y de dónde salen

### Hero animado (referencia: Cofounder)
`features/marketing/sections/Hero.tsx` mueve tres capas a la vez:

1. **Titular palabra por palabra.** Cada palabra vive dentro de un contenedor con
   `overflow-hidden` y sube desde debajo de su propia línea, con 60 ms de diferencia entre
   una y otra. Está en `components/motion/WordsReveal.tsx`.
2. **Parallax de fondo.** `useScroll` + `useTransform` desplazan y escalan el paisaje más
   lento que el contenido, y el texto se desvanece al bajar. Da sensación de profundidad.
3. **Conversación que se despliega sola.** `components/mascot/MascotChat.tsx` va soltando
   los mensajes uno a uno con un indicador de "escribiendo…" entre ellos, y reinicia el
   ciclo en bucle. En la referencia lo hace una computadora; aquí lo hace el hámster.

La **barra de pilares** inferior entra desde abajo y sus cuatro items aparecen escalonados
(120 ms de diferencia). Es cristal esmerilado, igual que la barra superior.

### Barra superior esmerilada (efecto iOS)
`components/layout/Navbar.tsx` + la clase `.glass` de `styles/index.css`.
Arriba del todo es transparente y se funde con el hero. Al pasar de 28 px de scroll aplica
`backdrop-blur-xl` + `backdrop-saturate-150` + fondo blanco al 65 %. La saturación es lo que
da el aspecto de "vidrio esmerilado" y no de simple transparencia.

### Aparición al hacer scroll (referencia: Augen)
`components/motion/Reveal.tsx` envuelve cualquier bloque y lo hace entrar cuando aparece en
pantalla: sube 28 px, se desvanece desde 0 y pierde un desenfoque de 6 px. Se dispara una
sola vez (`once: true`) para que el scroll hacia arriba no parpadee.

Los **botones** (`components/ui/Button.tsx`) son píldoras que se elevan 2 px al pasar el
mouse y tienen un destello diagonal (*sheen*) que los recorre.

### Dimensiones
El hero está calculado para caber completo en una pantalla de 720 px de alto, contando
con el escalado de Windows al 125 % (que reduce el viewport real a unos 1536 px).
El titular usa `clamp(1.95rem, 3.4vw, 3.2rem)`: el techo de 3.2rem evita que se
desborde en monitores grandes.

Un detalle del interlineado: la animación palabra por palabra necesita
`overflow-hidden` en cada palabra, y eso infla la altura de línea. Se compensa con
`pb-[0.14em] -mb-[0.14em]` en `WordsReveal.tsx` — se reserva espacio para las colas
de las letras y luego se descuenta. Si tocas ese componente, no quites ese par.

### Tipografía
- Títulos: **Plus Jakarta Sans** (700–800), geométrica y compacta.
- Texto: **Inter** (400–500).

Se cargan desde Google Fonts en `index.html` y se declaran en `tailwind.config.js` como
`font-display` y `font-sans`.

### Accesibilidad
`styles/index.css` respeta `prefers-reduced-motion`: si el usuario tiene desactivadas las
animaciones en su sistema operativo, todo se muestra estático.

---

## 4. Las guías de la mascota

Helpy acompaña al usuario en **todas** las pantallas, no solo en el inicio de sesión.
Todo vive en `components/onboarding/`.

```
onboarding/
├── tours/                  Un archivo por pantalla (el guion)
│   ├── home.tour.ts        índice de todas las guías en index.ts
│   ├── login.tour.ts
│   ├── role.tour.ts
│   ├── register.tour.ts
│   ├── seeker.tour.ts
│   ├── worker.tour.ts
│   └── matching.tour.ts
├── tour.types.ts           Forma de un paso
├── TourProvider.tsx        Contexto global
├── TourOverlay.tsx         La capa visual (oscurecido + foco + globo)
├── useAutoTour.ts          Lanza la guía en la primera visita
└── MascotGuideButton.tsx   Botón flotante para relanzarla
```

### Cómo se comporta

- **Primera visita a una pantalla** → la guía arranca sola a los 850 ms (el tiempo
  que tarda la pantalla en terminar de entrar).
- **Visitas siguientes** → no molesta. Queda disponible en el botón flotante del
  hámster, abajo a la derecha, que relanza la guía de la pantalla en la que estés.
- El botón "Iniciar sesión" de la barra fuerza la guía del login aunque ya se haya
  visto, porque es el punto de entrada de quien llega perdido.
- Se navega con **← → Esc** y se puede saltar en cualquier momento.

### Las guías del panel van con la cuenta, no con la sesión

Las guías de dentro de la app (`solicitante`, `helpworker`, `matching`) corren
**una sola vez por cuenta**, sin importar si la persona llegó registrándose o
iniciando sesión: la primera vez que pisa la pantalla, se explica.

Las de los paneles empiezan explicando **cómo funciona la plataforma** (el modelo
en cuatro pasos y cómo se protege el pago) y solo después señalan la interfaz.
Ese orden es a propósito: quien entra por primera vez necesita entender el modelo
antes que los botones.

Eso funciona porque en `localStorage` viven tres claves separadas:

| Clave | Qué guarda | ¿Se borra al cerrar sesión? |
|---|---|---|
| `helpwork:sesion` | quién está dentro ahora | **sí** |
| `helpwork:cuentas` | cuentas creadas en este navegador y su `esCuentaNueva` | no |
| `helpwork:tours-vistos:<ámbito>` | guías ya vistas | no |

El ámbito es `anon` para las guías públicas (landing, login, registro) y el id del
usuario para las del panel. Por eso cerrar sesión y volver a entrar no repite nada,
pero si otra persona entra en el mismo navegador sí recibe las suyas.

Para volver a verlas todas mientras pruebas, el menú de usuario tiene la opción
**"Volver a ver las guías"**, o desde código:

```ts
import { reiniciarGuias } from '@/components/onboarding/useAutoTour'
```

### Añadir un paso a una guía existente

1. Pon `data-tour="mi-elemento"` en el JSX del elemento a resaltar.
2. Agrega el objeto en el archivo correspondiente de `tours/`:

```ts
{
  target: '[data-tour="mi-elemento"]',
  titulo: 'Título corto',
  texto: 'Explicación en una o dos frases.',
  pose: 'guia',          // saludo | guia | libro | laptop
  placement: 'bottom',   // top | bottom | left | right
}
```

Un paso con `target: null` no resalta nada: se muestra centrado. Sirve para
la bienvenida.

### Crear una guía para una pantalla nueva

1. Crea `tours/miPantalla.tour.ts` exportando un array de `TourStep`.
2. Regístralo en `tours/index.ts` dentro del objeto `TOURS`.
3. En la página, dos líneas:

```tsx
useAutoTour('miPantalla')                    // arranca en la primera visita
<MascotGuideButton tourId="miPantalla" />    // botón flotante para repetirla
```

En las pantallas privadas el botón flotante ya lo pone `DashboardLayout`: solo hay
que añadir la ruta al mapa `TOUR_POR_RUTA` de ese archivo.

## 4b. Mensajería y estética de cristal

### Los mini chats
`features/messages/` tiene tres piezas:

| Archivo | Qué hace |
|---|---|
| `MessagesContext.tsx` | El estado: conversaciones, no leídos, chats abiertos |
| `MessagesMenu.tsx` | El icono de la barra con el contador y la lista desplegable |
| `ChatDock.tsx` | Las ventanitas ancladas abajo a la derecha |

Está en un contexto porque tres lugares distintos necesitan el mismo dato:
el contador del icono, el contador del menú lateral y los mensajes de cada
ventana. Sin contexto habría que pasar props por media aplicación.

Se abren hasta **tres chats a la vez**, se pueden minimizar, y al enviar un
mensaje llega una respuesta simulada tras un segundo. Eso último es solo para
la maqueta: cuando exista el backend, ese `setTimeout` de `enviar()` lo
reemplaza un WebSocket o un *polling*.

### La estética de cristal
Los paneles usan la clase `.panel` (definida en `styles/index.css`): fondo
blanco al 65 %, desenfoque y saturación aumentada.

Un detalle que conviene entender: **el cristal necesita algo detrás**. Sobre un
fondo blanco liso el desenfoque no tiene nada que desenfocar y el efecto no se
ve. Por eso `DashboardLayout` lleva la clase `.ambiente`, que pinta dos manchas
de color muy difusas (azul arriba a la derecha, violeta abajo a la izquierda)
bajo todo el contenido. Si quitas `.ambiente`, los paneles se ven planos.

Para el texto secundario está `.texto-suave`: peso ligero y algo de
espaciado entre letras, que es lo que da el aire elegante.

## 4c. Modo demostración

`src/config/demo.config.ts` tiene una sola constante:

```ts
export const MODO_DEMO = true
```

Con eso en `true`, **cada recarga arranca desde cero**: se borra la sesión, las
cuentas guardadas y el registro de guías vistas. El recorrido que ve el cliente
es siempre el mismo:

> landing → guía de bienvenida (13 pasos) → registro → panel → guía del panel

Sin esto, la segunda vez que abrieras la página entrarías con la sesión ya
abierta y el cliente no vería ni la landing ni las guías.

La limpieza ocurre en `app/bootstrap.ts`, que se llama en `main.tsx` **antes**
de renderizar. Por eso no hay parpadeo de "estaba dentro y ahora salí".

Durante la demostración la sesión funciona con normalidad: puedes registrarte,
navegar y cerrar sesión. Solo se pierde al recargar.

En el menú de usuario aparece además **"Reiniciar demostración"**, útil para
volver al principio sin tocar la consola.

**Antes de publicar de verdad, ponlo en `false`.** En producción la gente espera
que su sesión siga abierta al volver.

## 5. Conectar el backend

Todo el frontend habla con la API por un único archivo: **`lib/api/http.ts`**. Cuando el
backend esté listo:

**Paso 1.** Pon la URL real en `.env`:
```
VITE_API_URL=http://localhost:4000/api
```

**Paso 2.** Declara el endpoint en `lib/api/endpoints.ts`.

**Paso 3.** Reemplaza el mock por la llamada real. Ejemplo con los planes:

```ts
// antes
import { PLANES } from '@/data/mock'

// después
const [planes, setPlanes] = useState<Plan[]>([])
useEffect(() => {
  http.get<Plan[]>(ENDPOINTS.planes.list).then(setPlanes)
}, [])
```

**El componente no cambia**, porque `data/mock.ts` ya devuelve exactamente los tipos de
`types/index.ts`. Esos tipos son el contrato: si el backend devuelve eso, todo encaja.

Para el token de sesión, tras el login:
```ts
const { token } = await http.post(ENDPOINTS.auth.login, form)
setAuthToken(token)   // desde ese momento va en la cabecera Authorization
```

Si el backend corre en otro puerto y hay problemas de CORS, descomenta el `proxy` en
`vite.config.ts`.

---

## 6. Pendientes conocidos

- **Sesión de mentira.** `features/auth/AuthContext.tsx` guarda todo en `localStorage`
  y no valida contraseñas: cualquier correo entra. Sirve como andamio — cuando exista el
  backend hay que reemplazar el cuerpo de `login` y `registrar` por las llamadas reales, y
  `esCuentaNueva` debería venir de la API (un campo tipo `onboarding_completado`) para que
  la guía siga a la cuenta y no al navegador.
- **Rutas privadas.** `app/RutaPrivada.tsx` ya bloquea `/app/*` sin sesión. Si necesitas
  enseñar los paneles sin registrarte, pon `EXIGIR_SESION = false` en ese archivo.
- **Imágenes de la mascota.** Las de `public/assets/mascota/` se recortaron de la maqueta
  separando el fondo por color (el pelaje es cálido, el fondo frío). Tienen transparencia
  real, pero rondan los 220 px de ancho: en pantallas Retina se verán algo blandas. Para
  producción conviene exportarlas en alta resolución. Si mantienes los nombres de archivo
  no hay que tocar código; si los cambias, actualiza `MASCOT_POSES` en
  `components/mascot/Mascot.tsx`.
- **Avatares.** Vienen de `pravatar.cc` (servicio de prueba). Reemplazar por las URLs reales.
- **Formularios.** Solo tienen validación nativa de HTML. Para reglas más finas, conviene
  añadir `react-hook-form` + `zod`.
- **Pagos.** Fuera de alcance en esta fase; la sección de precios es solo visual.
