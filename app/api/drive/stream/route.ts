import { google } from "googleapis";

export const runtime = "nodejs";

function getServiceAccountClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!clientEmail || !privateKey) {
    throw new Error("Credenciales de servicio de Google no configuradas");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Falta parámetro id", { status: 400 });
  }

  const auth = getServiceAccountClient();
  const access_token = await auth.getAccessToken();

  if (!access_token) {
    return new Response("No se pudo obtener un token de acceso", {
      status: 500,
    });
  }

  // Reenviar Range al API de Drive para streaming parcial (carga progresiva y seek)
  const rangeHeader = request.headers.get("range");
  const driveHeaders: HeadersInit = {
    Authorization: `Bearer ${access_token}`,
  };
  if (rangeHeader) {
    driveHeaders["Range"] = rangeHeader;
  }

  const driveRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    { headers: driveHeaders }
  );

  if (!driveRes.ok || !driveRes.body) {
    const text = await driveRes.text().catch(() => "Error al obtener el video");
    return new Response(text, { status: driveRes.status || 500 });
  }

  const contentType =
    driveRes.headers.get("content-type") ?? "video/mp4";

  const isPartialContent = driveRes.status === 206;
  const contentRange = driveRes.headers.get("content-range");

  const responseHeaders: HeadersInit = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-cache",
  };
  if (isPartialContent && contentRange) {
    responseHeaders["Content-Range"] = contentRange;
  }

  return new Response(driveRes.body, {
    status: driveRes.status,
    headers: responseHeaders,
  });
}

