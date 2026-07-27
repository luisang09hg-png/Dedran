# 🚀 Guía de Despliegue en Vercel - Proyecto Dedran

Este documento proporciona instrucciones claras para desplegar Dedran en Vercel con configuración automática.

---

## ✅ Verificación de Compatibilidad

El proyecto ha sido configurado para ser **100% compatible con Vercel**. Se han verificado/ajustado:

### 1. **vite.config.js** ✓
- ✅ Rutas relativas por defecto (sin base paths de GitHub Pages)
- ✅ `outDir: 'dist'` configurado para producción
- ✅ Sourcemaps deshabilitados en producción para menor tamaño

### 2. **vercel.json** ✓
- ✅ SPA routing correctamente configurado
- ✅ Todas las rutas `/(.*)` redirigen a `/index.html`
- ✅ Variables de entorno especificadas
- ✅ Directorio de salida configurado en `dist`

### 3. **src/lib/supabase.js** ✓
- ✅ Variables de entorno usan `import.meta.env.VITE_*`
- ✅ Comprobaciones defensivas para evitar crashes
- ✅ Mensajes de error claros si faltan variables de entorno

### 4. **.env.example** ✓
- ✅ Documentación clara de todas las variables necesarias
- ✅ Instrucciones paso a paso para obtener cada clave

---

## 📋 Variables de Entorno Requeridas

Debes configurar las siguientes variables en **Vercel Dashboard** → **Settings** → **Environment Variables**:

### Variables REQUERIDAS (Cliente/Frontend):

| Variable | Valor | Dónde obtenerla |
|----------|-------|-----------------|
| `VITE_SUPABASE_URL` | `https://yourproject.supabase.co` | [Supabase Dashboard](https://supabase.com) → Settings → API keys → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Tu clave anónima | [Supabase Dashboard](https://supabase.com) → Settings → API keys → Public (anon key) |

### Variables OPCIONALES (Servidor):

| Variable | Valor | Notas |
|----------|-------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Tu clave de rol de servicio | Solo si usas operaciones admin en backend |

---

## 🔧 Pasos para Desplegar en Vercel

### Opción A: Desde la Web (Recomendado)

1. **Conectar el repositorio**
   - Accede a [vercel.com](https://vercel.com)
   - Haz clic en "Add New..." → "Project"
   - Selecciona el repositorio `luisang09hg-png/Dedran`
   - Vercel detectará automáticamente Vite

2. **Configurar variables de entorno**
   - En la página del proyecto → Settings → Environment Variables
   - Añade:
     - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = Tu clave anónima de Supabase
   - Asegúrate de que estén activas para `Production`

3. **Desplegar**
   - Haz click en "Deploy"
   - Vercel ejecutará automáticamente:
     - `npm run build` (construye el proyecto)
     - Sirve desde la carpeta `dist`
   - En ~1-2 minutos, tu app estará en vivo

### Opción B: Despliegue Automático (CI/CD)

Cada vez que hagas `push` a `main`:
- Vercel detectará automáticamente los cambios
- Ejecutará el build
- Desplegará la nueva versión
- Tu sitio se actualizará sin intervención manual

---

## 🧪 Verificación Post-Despliegue

Después de desplegar, verifica que todo funciona correctamente:

### ✓ Pruebas Básicas

1. **Página carga sin errores**
   - Abre tu URL de Vercel
   - Verifica que no haya errores en la consola (F12 → Console)

2. **Navegación SPA funciona**
   - Navega entre páginas
   - Las URLs deben cambiar sin recargar la página
   - Los botones atrás/adelante deben funcionar

3. **Autenticación de Supabase**
   - Intenta registrarte
   - Intenta iniciar sesión
   - Verifica que los datos se guardan en Supabase

4. **Consola sin mensajes críticos**
   - No debe haber errores rojos
   - Si ves `[Dedran] Missing Supabase...` en naranja = variables de entorno no configuradas

### 🔍 Debugging

Si encuentras problemas:

1. **Pantalla en blanco o negra**
   - Verifica las variables de entorno en Vercel Settings
   - Revisa la consola del navegador (F12) para errores
   - Comprueba que `dist/index.html` existe en el build

2. **Errores de autenticación**
   - Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son correctas
   - Asegúrate de que la URL no tiene barra `/` al final
   - Comprueba que la clave anónima no está expirada en Supabase

3. **Rutas rompen después de refrescar**
   - `vercel.json` ya está configurado correctamente
   - Si persiste, verifica que `rewrites` está en lugar

---

## 📂 Estructura de Archivos

```
dedran/
├── dist/                  ← Se genera en build, servido por Vercel
├── src/
│   ├── lib/supabase.js   ← Configurado con checks defensivos
│   ├── main.jsx          ← Punto de entrada
│   └── ...
├── vite.config.js        ← Configurado para producción
├── vercel.json           ← Configuración de Vercel (SPA routing)
├── .env.example          ← Referencia de variables (NO incluir valores reales)
└── package.json          ← Scripts: build, dev, preview
```

---

## 🎯 Comandos Útiles (Localmente)

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# Abre http://localhost:5173

# Build para producción
npm run build
# Genera dist/

# Previsualizar build localmente
npm run preview
# Abre http://localhost:4173

# Linting
npm run lint
```

---

## 🛡️ Seguridad y Mejores Prácticas

✅ **Hecho correctamente:**
- Las variables frontend (VITE_*) están en `.env.example` sin valores
- Las claves de Supabase se configuran en Vercel, NO en el código
- Comprobaciones defensivas evitan crashes por variables faltantes

⚠️ **NUNCA hagas esto:**
- ❌ Commits con `.env.local` o valores reales
- ❌ Exponer `SUPABASE_SERVICE_ROLE_KEY` en el frontend
- ❌ Hardcodear URLs o claves en el código

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de build en Vercel: Project → Deployments → [Tu deploy] → Build Logs
2. Verifica las variables de entorno en Project Settings
3. Consola del navegador (F12 → Console) para errores de cliente
4. Supabase Dashboard para verificar la conexión

---

**Última actualización:** 2024  
**Proyecto:** Dedran  
**Plataforma:** Vercel + Supabase
