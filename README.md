# 🌌 CryptoWatch

**CryptoWatch** es un moderno dashboard de criptomonedas en tiempo real, construido para monitorear el pulso financiero de los activos digitales más populares usando la API WebSocket de Binance. 

Este proyecto fue **creado por Jehison Bustamante** como una demostración técnica de interfaces de alto rendimiento, manejo de estado complejo y diseño premium.

**🚀 [Ver en Vercel →](https://cryptowatch-lake.vercel.app)** | **Deploy automático desde GitHub**

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
- **🎨 Diseño UI/UX Premium**: Implementado puramente con Tailwind CSS v4, ofreciendo transiciones suaves, modo oscuro por defecto y un diseño tipo mosaico súper responsivo (Grilla dinámica de 3x2 a 1x1).
- **⚡ Optimizado para Vercel**: Desplegado automáticamente desde GitHub con preview deployments para cada PR.

---

## 🛠️ Tecnologías Adentro

- **[Next.js 16.1 (React 19)](https://nextjs.org/)**: Framework core y enrutador optimizado.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos y animaciones `postcss`.
- **[Recharts](https://recharts.org/en-US/)**: Gráficas sparkline ultra-rápidas en formato SVG.
- **[TypeScript](https://www.typescriptlang.org/)**: Seguridad de tipos a lo largo de los hooks y componentes.
- **[Binance WebSocket API](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md)**: Proveedor de datos de latencia cero.
- **[Vercel](https://vercel.com)**: Plataforma de deploy con CI/CD automático.

---

## 🚀 Cómo correr el proyecto localmente

Este es un proyecto [Next.js](https://nextjs.org/). Primero, asegúrate de tener `Node.js 18+` instalado.

### Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/JehisonBustamante/cryptowatch.git
   cd cryptowatch
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Levanta el entorno de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts Disponibles

- `npm run dev` - Levanta servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm start` - Corre el servidor de producción
- `npm run lint` - Ejecuta ESLint

---

## 🌐 Despliegue en Vercel

Esta aplicación está optimizada para desplegar en **Vercel** con deploy automático desde GitHub.

### Deploy Automático (Recomendado)

1. Sube el código a un repositorio de GitHub
2. Ve a [https://vercel.com](https://vercel.com)
3. Conecta tu repositorio GitHub
4. Vercel detectará Next.js automáticamente
5. ¡Listo! Cada push a `main` desplegará automáticamente

### URL de Ejemplo
```
https://cryptowatch-xxxxx.vercel.app
```

**Características en Vercel:**
- ✅ Preview deployments para cada PR
- ✅ Deploy automático en cada push
- ✅ Certificado SSL automático
- ✅ CDN global
- ✅ Analytics en tiempo real

---

## 📁 Estructura del Proyecto

```
cryptowatch/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Componente principal (dashboard)
│   │   ├── layout.tsx        # Layout raíz
│   │   └── globals.css       # Estilos globales (Tailwind v4)
│   └── hooks/
│       └── useBinance.ts     # Hook para WebSocket de Binance
├── public/                   # Assets estáticos
├── next.config.ts            # Configuración de Next.js
├── tailwind.config.ts        # Configuración de Tailwind
├── tsconfig.json             # Configuración de TypeScript
└── package.json              # Dependencias
```

---

## 👨‍💻 Autor

Creado y diseñado con pasión por **Jehison Bustamante**.
- 💼 [LinkedIn](www.linkedin.com/in/jehison-bustamante-molina-8b410521a)
- 🐙 [GitHub](https://github.com/JehisonBustamante)
- 📧 Email: [EMAIL_ADDRESS](jayjehisonbustamante@gmail.com)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o una pull request para sugerir mejoras.

---

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Binance API Docs](https://binance-docs.github.io/apidocs/)
- [Vercel Docs](https://vercel.com/docs)
- [React 19 Docs](https://react.dev)
