import { getVideoMetadata } from "@/lib/drive";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta parámetro id" },
      { status: 400 }
    );
  }

  try {
    const video = await getVideoMetadata(id);
    if (!video) {
      return NextResponse.json(
        { error: "Video no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(video);
  } catch (err) {
    console.error("Drive API error (video):", err);
    return NextResponse.json(
      { error: "Error al obtener el video" },
      { status: 500 }
    );
  }
}
