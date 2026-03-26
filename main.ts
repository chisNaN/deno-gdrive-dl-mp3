// main.ts

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const fileId = url.searchParams.get("id");

  if (!fileId) {
    return new Response("Missing file id", { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const driveRes = await fetch(driveUrl, {
      redirect: "follow",
    });

    if (!driveRes.ok) {
      return new Response("Failed to fetch file", { status: 502 });
    }

    const headers = new Headers(driveRes.headers);
    headers.set("Access-Control-Allow-Origin", "*"); // 🔥 utile pour ton frontend

    return new Response(driveRes.body, {
      status: driveRes.status,
      headers,
    });

  } catch (err) {
    return new Response("Error fetching file", { status: 500 });
  }
});
