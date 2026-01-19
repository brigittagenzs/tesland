export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  
  // URL Raw GitHub Anda (Pastikan isinya daftar domain tanpa https://)
  const GITHUB_DOMAINS_URL = "https://raw.githubusercontent.com/username/repo/main/domains.txt";

  // Ambil Data dari URL
  const title = searchParams.get('title') || "Klik untuk melihat";
  const image = searchParams.get('img') || "";
  const destination = searchParams.get('url') || "https://google.com";

  // --- LOGIKA RANDOM DESKRIPSI ---
  // Menghasilkan angka acak antara 10.000 - 1.000.000
  const randomCount = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
  // Format angka agar ada pemisah ribuan (contoh: 125.400)
  const formattedCount = randomCount.toLocaleString('id-ID');
  
  const randomSuffix = Math.random() > 0.5 ? "online girls" : "girls ready";
  const description = `${formattedCount} ${randomSuffix}`;
  // -------------------------------

  // Handle request untuk ambil domain acak (untuk index.html)
  if (searchParams.get('get_random') === 'true') {
    try {
      const response = await fetch(GITHUB_DOMAINS_URL);
      const text = await response.text();
      const domains = text.split('\n').filter(d => d.trim() !== "");
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      return new Response(JSON.stringify({ domain: randomDomain.trim() }), {
        headers: { "content-type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Gagal ambil domain" }), { status: 500 });
    }
  }

  // Render Halaman Preview untuk Bot Medsos
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
    <body>
      <p>Redirecting to ${title}... Jika tidak berpindah, <a href="${destination}">klik di sini</a>.</p>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
}
