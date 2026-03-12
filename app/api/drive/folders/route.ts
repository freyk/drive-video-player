import { getDriveFoldersConfig, listSubfolders } from "@/lib/drive";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");

  if (parentId) {
    const subfolders = await listSubfolders(parentId);
    return NextResponse.json({ folders: subfolders });
  }

  const folders = getDriveFoldersConfig();
  if (folders.length === 0) {
    return NextResponse.json(
      { error: "No folders configured (GOOGLE_DRIVE_FOLDER_ID or GOOGLE_DRIVE_FOLDERS)" },
      { status: 500 }
    );
  }
  return NextResponse.json({ folders });
}
