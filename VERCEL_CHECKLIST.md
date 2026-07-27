# ✅ Checklist Rápido - Despliegue en Vercel

Copia y pega este checklist para asegurar que todo está listo antes de desplegar.

---

## 🔐 PASO 1: Configurar Variables de Entorno en Vercel

En **Vercel Dashboard → [Tu Proyecto] → Settings → Environment Variables**, añade:

- [ ] `VITE_SUPABASE_URL` = `https://your-project.supabase.co` (de Supabase Dashboard → Settings → API keys)
- [ ] `VITE_SUPABASE_ANON_KEY` = Tu clave anónima (de Supabase Dashboard → Settings → API keys → Public)
- [ ] Marcadas como habilitadas para **Production** ✓

**Cómo obtener estas claves:**
1. Accede a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Settings → API keys
4. Copia Project URL y Public (anon key)
5. Pega en Vercel

---

## 📦 PASO 2: Verificar Configuración del Proyecto (Ya Hecho ✅)

Estos archivos ya están configurados correctamente:

- [x] **vite.config.js**
  - ✅ Rutas relativas (sin base paths)
  - ✅ `outDir: 'dist'` para producción
  - ✅ Sourcemaps deshabilitados

- [x] **vercel.json**
  - ✅ SPA routing (`/(.*) → /index.html`)
  - ✅ `outputDirectory: "dist"`
  - ✅ `buildCommand: "npm run build"`

- [x] **src/lib/supabase.js**
  - ✅ Usa `import.meta.env.VITE_*`
  - ✅ Comprobaciones defensivas de variables
  - ✅ Manejo de errores sin crashes

- [x] **.env.example**
  - ✅ Documentación clara
  - ✅ Sin valores sensibles

---

## 🚀 PASO 3: Despliegue

### Opción A: Despliegue Manual (Una sola vez)

```bash
# 1. Conecta el repo a Vercel (si no lo has hecho)
# Accede a vercel.com y selecciona "Add New → Project"

# 2. Selecciona luisang09hg-png/Dedran

# 3. En "Environment Variables", añade las 2 variables de Supabase

# 4. Click en "Deploy"
```

### Opción B: Despliegue Automático (Recomendado)

Una vez conectado, cada `git push` a `main` desplegará automáticamente:

```bash
git add .
git commit -m "Configure Dedran for Vercel deployment"
git push origin main
```

---

## 🧪 PASO 4: Verificar Despliegue

Después de desplegar, verifica en **Vercel Dashboard**:

- [ ] Build Status: ✅ Success (verde)
- [ ] Domains: Tu URL está activa (ej: dedran.vercel.app)
- [ ] Click en la URL para abrir tu app

En **Tu App** (después de abrir):

- [ ] Página carga sin errores (sin pantalla blanca/negra)
- [ ] Consola (F12) no tiene errores rojos
- [ ] Puedes navegar entre páginas
- [ ] El formulario de login funciona
- [ ] Los datos se guardan en Supabase

---

## ⚡ Comandos de Emergencia (Si algo falla)

### Ver logs de build
```
Vercel Dashboard → [Tu Proyecto] → Deployments → [Último Deploy] → Build Logs
```

### Redeploy sin cambios
```
Vercel Dashboard → [Tu Proyecto] → Deployments → [Último Deploy] → → Redeploy
```

### Rollback a versión anterior
```
Vercel Dashboard → [Tu Proyecto] → Deployments → [Versión Anterior] → Promote to Production
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| **Pantalla blanca/negra** | Verifica variables en Vercel Settings |
| **Errores de autenticación** | Comprueba VITE_SUPABASE_URL sin `/` al final |
| **Rutas rompen al refrescar** | vercel.json ya está configurado, limpia caché |
| **"Missing env vars" en consola** | Falta configurar variables en Vercel, ve a Settings |
| **Build falla** | Verifica Build Logs en Vercel Dashboard |

---

## ✨ Listo

Una vez completes todos los ☑️ anteriores, tu app estará **100% funcionando en Vercel**.

**Tiempo estimado:** 5-10 minutos ⏱️

---

**Último checklist completado:** [Tu fecha]  
**Versión del proyecto:** Dedran v1.0  
**Plataforma:** Vercel + Supabase
