export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  
  // Link Raw GitHub yang Anda berikan
  const GITHUB_DOMAINS_URL = "https://raw.githubusercontent.com/brigittagenzs/tesland/refs/heads/main/domains.txt";

  const title = searchParams.get('title') || "Klik untuk melihat";
  const image = searchParams.get('img') || "";
  const destination = searchParams.get('url') || "https://google.com";

  // LOGIKA RANDOM DESKRIPSI (10.000 - 1.000.000)
  const randomCount = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
  const formattedCount = randomCount.toLocaleString('id-ID');
  const randomSuffix = Math.random() > 0.5 ? "online girls" : "girls ready";
  const description = `${formattedCount} ${randomSuffix}`;

  // Fitur ambil domain acak untuk halaman depan
  if (searchParams.get('get_random') === 'true') {
    try {
      const response = await fetch(GITHUB_DOMAINS_URL);
      const text = await response.text();
      // Pisahkan baris, hapus spasi kosong
      const domains = text.split('\n').map(d => d.trim()).filter(d => d !== "");
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      
      return new Response(JSON.stringify({ domain: randomDomain }), {
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Gagal mengambil daftar domain" }), { status: 500 });
    }
  }

  // HTML untuk Bot Media Sosial (Preview)
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:type" content="website">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:url" content="${destination}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <meta http-equiv="refresh" content="0; url=${destination}">
      <script>window.location.href = "${destination}";</script>
    </head>
    <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
      <p>Mengarahkan ke halaman... <br><a href="${destination}">Klik di sini jika tidak otomatis</a></p>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
}
