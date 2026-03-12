import { getDriveFoldersConfig, getAllFolderIdsRecursive } from "@/lib/drive";
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

export async function GET(request: Request) {
  const folders = getDriveFoldersConfig();
  if (folders.length === 0) {
    return NextResponse.json(
      { error: "No hay carpetas configuradas (GOOGLE_DRIVE_FOLDER_ID o GOOGLE_DRIVE_FOLDERS)" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const folderIdParam = searchParams.get("folderId");
  const folderIdsToQuery = folderIdParam
    ? [folderIdParam]
    : await getAllFolderIdsRecursive(folders.map((f) => f.id));

  try {
    const auth = getServiceAccountClient();
    const drive = google.drive({ version: "v3", auth });

    type DriveFile = {
      id: string;
      name: string;
      mimeType?: string | null;
      size?: string;
      createdTime?: string;
      thumbnailLink?: string;
      webContentLink?: string;
      folderId?: string;
    };

    const allFiles: DriveFile[] = [];

    for (const folderId of folderIdsToQuery) {
      const { data } = await drive.files.list({
        q: `'${folderId}' in parents and (${VIDEO_MIME_TYPES.map((m) => `mimeType='${m}'`).join(" or ")}) and trashed = false`,
        fields: "files(id, name, mimeType, size, createdTime, thumbnailLink, webContentLink)",
        orderBy: "createdTime desc",
        pageSize: 100,
      });

      const rawFiles = (data.files || []).filter(
        (f): f is typeof f & { id: string; name: string } =>
          typeof f.id === "string" && typeof f.name === "string"
      );
      const files = rawFiles.map(
        (f): DriveFile => ({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType ?? undefined,
          size: f.size ?? undefined,
          createdTime: f.createdTime ?? undefined,
          thumbnailLink: f.thumbnailLink ?? undefined,
          webContentLink: f.webContentLink ?? undefined,
          folderId,
        })
      );
      allFiles.push(...files);
    }

    allFiles.sort(
      (a, b) =>
        (b.createdTime ? new Date(b.createdTime).getTime() : 0) -
        (a.createdTime ? new Date(a.createdTime).getTime() : 0)
    );

    return NextResponse.json({
      files: allFiles.map(({ folderId: _, ...f }) => f),
    });
  } catch (err) {
    console.error("Drive API error:", err);
    return NextResponse.json(
      { error: "Error al listar videos de Drive" },
      { status: 500 }
    );
  }
}
