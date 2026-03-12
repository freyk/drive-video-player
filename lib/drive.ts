import { google } from "googleapis";

export interface DriveFolderConfig {
  id: string;
  name: string;
}

/** Lista de carpetas permitidas desde env (orden determina el orden en la UI). */
export function getDriveFoldersConfig(): DriveFolderConfig[] {
  const foldersJson = process.env.GOOGLE_DRIVE_FOLDERS;
  if (foldersJson) {
    try {
      const parsed = JSON.parse(foldersJson) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (f): f is { id: string; name?: string } =>
              f != null && typeof (f as { id?: string }).id === "string"
          )
          .map((f) => ({
            id: f.id,
            name: typeof f.name === "string" && f.name.trim() ? f.name.trim() : f.id,
          }));
      }
    } catch {
      // ignore invalid JSON
    }
  }
  const singleId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (singleId) {
    return [{ id: singleId, name: "Mis videos" }];
  }
  return [];
}

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

/** Recorre recursivamente y devuelve los IDs de la carpeta y todas sus subcarpetas. */
export async function getAllFolderIdsRecursive(
  rootIds: string[]
): Promise<string[]> {
  const result = new Set<string>(rootIds);

  async function addDescendants(parentId: string): Promise<void> {
    const children = await listSubfolders(parentId);
    for (const child of children) {
      if (result.has(child.id)) continue;
      result.add(child.id);
      await addDescendants(child.id);
    }
  }

  for (const rootId of rootIds) {
    await addDescendants(rootId);
  }

  return Array.from(result);
}

/** Lista subcarpetas directas de una carpeta (para árbol en el sidebar). */
export async function listSubfolders(
  parentId: string
): Promise<DriveFolderConfig[]> {
  try {
    const auth = getServiceAccountClient();
    const drive = google.drive({ version: "v3", auth });

    const { data } = await drive.files.list({
      q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
      orderBy: "name",
      pageSize: 100,
    });

    return (data.files || []).map((f) => ({
      id: f.id!,
      name: f.name ?? f.id!,
    }));
  } catch {
    return [];
  }
}

/** Devuelve nombre (y id) de una carpeta por ID (para títulos cuando es subcarpeta). */
export async function getFolderInfo(
  id: string
): Promise<DriveFolderConfig | null> {
  try {
    const auth = getServiceAccountClient();
    const drive = google.drive({ version: "v3", auth });

    const { data } = await drive.files.get({
      fileId: id,
      fields: "id, name, mimeType",
    });

    if (data.mimeType !== "application/vnd.google-apps.folder") {
      return null;
    }

    return { id: data.id!, name: data.name ?? data.id! };
  } catch {
    return null;
  }
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
