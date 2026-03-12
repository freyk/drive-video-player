import { getVideoMetadata } from "@/lib/drive";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    const video = await getVideoMetadata(id);
    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(video);
  } catch (err) {
    console.error("Drive API error (video):", err);
    return NextResponse.json(
      { error: "Error fetching video" },
      { status: 500 }
    );
  }
}
