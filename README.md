# Video Player — Google Drive

App en React y Next.js para reproducir videos desde una carpeta de tu Google Drive, con una interfaz similar a Loom.

## Características

- No requiere que los usuarios inicien sesión
- La app usa una **cuenta de servicio** de Google para leer la carpeta
- Listado de videos de una carpeta de Drive configurada
- Reproducción en modal con player HTML5
- Interfaz limpia tipo Loom: sidebar, grid de tarjetas, reproductor en modal

## Configuración

### 1. Variables de entorno

Copia el ejemplo y rellena los valores:

```bash
cp .env.local.example .env.local
```

- **GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL** y **GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY**: credenciales de la cuenta de servicio (ver abajo).
- **GOOGLE_DRIVE_FOLDER_ID**: ID de la carpeta de Drive donde están los videos. Lo ves en la URL al abrir la carpeta: `https://drive.google.com/drive/folders/ESTE_ES_EL_ID`

### 2. Google Cloud Console (cuenta de servicio)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto (o usa uno existente).
2. Activa **Google Drive API**: en “APIs y servicios” → “Biblioteca” → busca “Google Drive API” → Activar.
3. Ve a “IAM y administración” → “Cuentas de servicio” → “Crear cuenta de servicio”.
4. Crea la cuenta (rol mínimo “Lector” suele ser suficiente) y, en la pestaña “Claves”, crea una **clave JSON**.
5. Copia el `client_email` y el `private_key` del JSON a:
   - `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (sustituyendo saltos de línea por `\n` como en `.env.local.example`).

### 3. Carpeta de Drive

- Crea una carpeta en Google Drive (o usa una existente) y sube ahí los videos.
- Comparte la carpeta con el **email de la cuenta de servicio** como “Lector”.
- Abre la carpeta en el navegador y copia el ID de la URL en `GOOGLE_DRIVE_FOLDER_ID`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Cualquier persona que entre verá los videos de la carpeta configurada (no necesitan iniciar sesión).

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **googleapis** (Drive API con cuenta de servicio)
- **Tailwind CSS 4**
