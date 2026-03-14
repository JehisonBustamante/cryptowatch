# 🌌 CryptoWatch

**CryptoWatch** es un moderno dashboard de criptomonedas en tiempo real, construido para monitorear el pulso financiero de los activos digitales más populares usando la API WebSocket de Binance. 

Este proyecto fue **creado por Jehison Bustamante** como una demostración técnica de interfaces de alto rendimiento, manejo de estado complejo y diseño premium.

---

## ⚡ Características Principales (Features)

- **📈 Precios en Tiempo Real (WebSockets)**: Conexión directa al Stream Combinado de Binance para mostrar los precios tick a tick sin depender de solicitudes REST.
- **✨ Animaciones Reactivas ("Blinks")**: Los precios "parpadean" sutilmente en púrpura (alza) o rojo (baja) cada vez que el mercado se mueve, dando una sensación de aplicación "viva".
- **📊 Sparklines Reactivos**: Cada tarjeta muestra un mini-gráfico (construido con `recharts`) que dibuja el historial de los últimos 30 ticks de precio para visualizar la tendencia micro-segundo a segundo sin sobrecargar el DOM.
- **⭐ Persistencia de Preferencias**: Integración ligera de `localStorage` para marcar y guardar tus monedas favoritas, re-cargándolas instantáneamente entre sesiones.
- **🛡️ Resiliencia de Conexión (Edge Cases)**: 
  - Manejo inteligente de desconexiones y caídas de Wi-Fi con auto-reconexión (`auto-reconnect fallback`).
  - Indicador visual perimetral de estado de conexión (En Vivo / Reconectando).
  - Estado visual de "Skeletons" al cargar, y filtros de escala de grises al detectar pérdida de conectividad.
- **🎨 Diseño UI/UX Premium**: Implementado puramente con Tailwind CSS, ofreciendo transiciones suaves, modo oscuro por defecto y un diseño tipo mosaico súper responsivo (Grilla dinámica de 3x2 a 1x1).

---

## 🛠️ Tecnologías Adentro

- **[Next.js 16 (React 19)](https://nextjs.org/)**: Framework core y enrutador.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos y animaciones `postcss`.
- **[Recharts](https://recharts.org/en-US/)**: Para las gráficas sparkline ultra-rápidas en formato SVG.
- **[TypeScript](https://www.typescriptlang.org/)**: Seguridad de tipos a lo largo de los hooks y componentes.
- **[Binance WebSocket API](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md)**: Proveedor de datos de latencia cero.

---

## 🚀 Cómo correr el proyecto localmente

Este es un proyecto [Next.js](https://nextjs.org/). Primero, asegúrate de tener `Node.js` instalado.

1. Clona este repositorio o descarga el código.
2. Abre la terminal en el directorio del proyecto y ejecuta la instalación de dependencias:
   ```bash
   npm install
   ```
3. Levanta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la magia.

---

## 👨‍💻 Autor

Creado y diseñado con pasión por **Jehison Bustamante**.
- [LinkedIn](#) *(Enlaza tu perfil aquí)*
- [GitHub](#) *(Enlaza tu perfil aquí)*
