# UADAV Santa Fe — web institucional y herramientas

La portada `index.html` deriva del diseño de `index3.html`. `index3.html` redirige a la portada.

## Incluido
- Web pública: comunicados, afiliación, acción gremial, agenda, cursos, beneficios, autoridades y contacto.
- `admin.html`: editar contenido, ordenar publicaciones, importar/exportar JSON, guardar borrador y publicar con API autenticada.
- `placas.html`: PNG 4:5, 9:16, 1:1 y 16:9, foto local, logo, encuadre, zoom, textos y color. Sin fuentes de noticias, conexiones a Agencia Beat ni publicación automática.
- `credenciales.html`: generador original conservado; no constituye verificación oficial del padrón.

## Publicación en Cloudflare Pages
1. Conectar este repositorio a un proyecto Pages. Seleccionar rama final aprobada. Framework: ninguno; sin comando de compilación; directorio de salida: `/` (raíz).
2. Crear un namespace KV y vincularlo como `UADAV_CONTENT` en Pages, tanto en producción como en preview si se usará allí.
3. Crear el secreto `ADMIN_TOKEN` con un valor aleatorio largo (32 bytes o más). Nunca guardarlo en GitHub. Configurar por separado preview y producción.
4. Volver a desplegar para que Functions reciba el binding y secreto.
5. Abrir `/admin.html`, introducir la clave, conectar, completar datos oficiales y publicar. El token solo vive en el campo de esta sesión; no se guarda en localStorage.
6. Conectar `www.uadavsantafe.com.ar` desde Dominios personalizados de Pages y reemplazar la redirección vigente a Linktree, después de verificar la nueva web.

El acceso mediante clave compartida es una primera etapa. Para varias personas conviene Cloudflare Access con identidades y roles. El panel puede ser visitado sin clave, pero la API no permite leer ni publicar el contenido administrativo sin ella. Los contenidos institucionales publicados son públicos.

## Límites y pendientes
- KV tiene consistencia eventual. La revisión evita algunas sobrescrituras, pero no es un bloqueo atómico. Usar un editor a la vez; para edición concurrente migrar a D1/Durable Objects.
- No hay padrón en línea, recepción de denuncias, consulta de credenciales, verificación de inspectores, pagos ni envío masivo a afiliados. Se muestran canales de contacto, sin simular envíos exitosos.
- Video/MP4 e IA no incluidos: el ZIP original solo traía un laboratorio de escenas. No hay gastos de IA ni claves externas.
- Los datos de contacto se dejan vacíos hasta confirmación. La afiliación enlaza al Linktree existente.
- Borradores, plantillas y fotos de placas no se sincronizan; el contenido publicado sí se guarda en KV.
- El generador de carnets se conserva para mejora posterior y no está conectado al admin ni al padrón. No ingresar datos reales en entornos de demostración compartidos.
- Tailwind y fuentes/iconos del diseño original usan CDN; futura mejora: compilación CSS local.

## Limpieza y respaldo
Se retiraron Modo Peregrino, UADAV Stream, sus archivos de reproducción, landings anteriores, paneles de demostración inseguros y los dos sistemas locales de gestión. Todo permanece recuperable en el historial anterior al cambio (`8fc7b729b0e6b2c7bebd5dce1b7756f79efe0ad3`). Los datos localStorage de los sistemas anteriores NO están en Git: exportarlos desde el navegador donde fueron cargados antes de cambiar de dominio o borrar almacenamiento.

## Desarrollo
Para revisar solo HTML: `python -m http.server 8000`. El panel funcionará como borrador y la portada usará `assets/content.json`.
Para Functions/KV usar Wrangler Pages con el binding y el secreto configurados. Nunca cargar secretos en el repositorio.
