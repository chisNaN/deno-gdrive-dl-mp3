// main.ts

import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  const fileId = url.searchParams.get("id");

  if (!fileId) {
    return new Response("Missing file id", { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const driveRes = await fetch(driveUrl, {
      method: "GET",
      redirect: "follow",
    });

    if (!driveRes.ok) {
      return new Response("Failed to fetch file", { status: 502 });
    }

    // 👇 important pour audio
    const headers = new Headers();
    headers.set("Content-Type", driveRes.headers.get("content-type") || "audio/mpeg");

    return new Response(driveRes.body, {
      status: 200,
      headers,
    });

  } catch (err) {
    return new Response("Error fetching file", { status: 500 });
  }
});
