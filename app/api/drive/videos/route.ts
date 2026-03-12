import { google } from "googleapis";
import { NextResponse } from "next/server";

const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
];

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

export async function GET() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    return NextResponse.json(
      { error: "GOOGLE_DRIVE_FOLDER_ID no configurado" },
      { status: 500 }
    );
  }

  try {
    const auth = getServiceAccountClient();
    const drive = google.drive({ version: "v3", auth });

    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and (${VIDEO_MIME_TYPES.map((m) => `mimeType='${m}'`).join(" or ")}) and trashed = false`,
      fields: "files(id, name, mimeType, size, createdTime, thumbnailLink, webContentLink)",
      orderBy: "createdTime desc",
      pageSize: 50,
    });

    const files = (data.files || []).map((f) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size,
      createdTime: f.createdTime,
      thumbnailLink: f.thumbnailLink,
      webContentLink: f.webContentLink,
    }));

    return NextResponse.json({ files });
  } catch (err) {
    console.error("Drive API error:", err);
    return NextResponse.json(
      { error: "Error al listar videos de Drive" },
      { status: 500 }
    );
  }
}
