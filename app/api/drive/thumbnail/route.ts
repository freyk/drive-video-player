import { google } from "googleapis";
import { NextResponse } from "next/server";

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

  try {
    const auth = getServiceAccountClient();
    const access_token = await auth.getAccessToken();

    if (!access_token) {
      return new Response("No se pudo obtener un token de acceso", {
        status: 500,
      });
    }

    const drive = google.drive({ version: "v3", auth });
    const { data } = await drive.files.get({
      fileId: id,
      fields: "thumbnailLink",
    });

    const thumbnailLink = data.thumbnailLink;
    if (!thumbnailLink) {
      return new NextResponse("Sin miniatura", { status: 404 });
    }

    let thumbRes = await fetch(thumbnailLink, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Algunas URLs de miniatura pueden ser públicas; si falla con auth, intentar sin ella
    if (!thumbRes.ok && thumbRes.status === 403) {
      thumbRes = await fetch(thumbnailLink);
    }

    if (!thumbRes.ok || !thumbRes.body) {
      return new NextResponse("Error al obtener la miniatura", {
        status: thumbRes.status || 500,
      });
    }

    const contentType =
      thumbRes.headers.get("content-type") ?? "image/jpeg";

    return new Response(thumbRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Thumbnail error:", err);
    return new NextResponse("Error al obtener la miniatura", { status: 500 });
  }
}
