import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getResourceBySlug } from "@/lib/data/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ResourceRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function contentDisposition(fileName: string, download: boolean) {
  const disposition = download ? "attachment" : "inline";
  const fallbackName = fileName.replace(/[^A-Za-z0-9._-]/g, "_");
  const encodedName = encodeURIComponent(fileName);

  return `${disposition}; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`;
}

export async function GET(request: Request, { params }: ResourceRouteContext) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Resource downloads are temporarily unavailable." },
      { status: 500 }
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to open this resource." },
      { status: 401 }
    );
  }

  const filePath = path.join(process.cwd(), "resources", resource.fileName);
  const file = await readFile(filePath);
  const url = new URL(request.url);

  return new NextResponse(file, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": contentDisposition(resource.fileName, url.searchParams.has("download")),
      "Content-Type": "application/pdf",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
