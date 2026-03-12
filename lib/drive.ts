import { google } from "googleapis";

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

export interface VideoMetadata {
  id: string;
  name: string;
  mimeType?: string | null;
  size?: string;
  createdTime?: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

export async function getVideoMetadata(
  id: string
): Promise<VideoMetadata | null> {
  try {
    const auth = getServiceAccountClient();
    const drive = google.drive({ version: "v3", auth });

    const { data } = await drive.files.get({
      fileId: id,
      fields: "id, name, mimeType, size, createdTime, thumbnailLink, webContentLink",
    });

    return {
      id: data.id!,
      name: data.name!,
      mimeType: data.mimeType ?? null,
      size: data.size ?? undefined,
      createdTime: data.createdTime ?? undefined,
      thumbnailLink: data.thumbnailLink ?? undefined,
      webContentLink: data.webContentLink ?? undefined,
    };
  } catch {
    return null;
  }
}
