export async function onRequest(context) {
  const { searchParams, pathname } = new URL(context.request.url);
  const GITHUB_URL = "https://raw.githubusercontent.com/brigittagenzs/tesland/refs/heads/main/domains.txt";

  // Data Terpisah
  const NAMES = ["Kira", "Luna", "Bella", "Siska", "Angel", "Vanya"];
  const PHOTOS = [
    "https://pub-static.fotor.com/assets/projects/pages/d5afed05-cf3f-42a8-9993-4ea6793f06e0/fotor-03ca073663a846c483f9828551a37c05.jpg",
    "https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-long-brown-hair_231208-1111.jpg"
  ];
  const VIDEOS = ["https://fcc3da89-72f5-49f4-9043-9878b66838f5.selcdn.net/webroot/8/video.mp4"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const destination = searchParams.get('url') || "https://google.com";

  // API AMBIL DOMAIN RANDOM
  if (searchParams.get('get_random') === 'true') {
    const res = await fetch(GITHUB_URL);
    const text = await res.text();
    const domains = text.split('\n').map(d => d.trim()).filter(d => d !== "");
    return new Response(JSON.stringify({ domain: pick(domains) }), {
      headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // LOGIKA ROUTING
  if (pathname.includes('/landing')) {
    // Tampilan Landing Page
    const name = pick(NAMES);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { margin: 0; background: black; color: white; font-family: sans-serif; overflow: hidden; }
              video { position: fixed; min-width: 100%; min-height: 100%; z-index: -1; filter: brightness(0.4); object-fit: cover; }
              .content { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
              img { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #ff007f; margin-bottom: 20px; }
              .btn { background: #ff007f; color: white; padding: 15px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; animation: pulse 1s infinite; }
              @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
          </style>
      </head>
      <body>
          <video autoplay muted loop playsinline><source src="${pick(VIDEOS)}" type="video/mp4"></video>
          <div class="content">
              <img src="${pick(PHOTOS)}">
              <h1>${name}</h1>
              <p>${name} is waiting you come on touch</p>
              <a href="${destination}" class="btn">TOUCH ME</a>
          </div>
      </body>
      </html>`, { headers: { "content-type": "text/html" } });
  }

  // Tampilan Preview Sosmed (Default)
  const namePreview = pick(NAMES);
  const title = `${namePreview} ${Math.random() > 0.5 ? 'is live now' : 'is ready now'}`;
  const desc = `${Math.floor(Math.random() * 900000 + 10000).toLocaleString('id-ID')} girls ready`;
  const landingUrl = `${new URL(context.request.url).origin}/landing?url=${encodeURIComponent(destination)}`;

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${pick(PHOTOS)}">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
      <meta http-equiv="refresh" content="0; url=${landingUrl}">
    </head>
    <body><script>window.location.href="${landingUrl}"</script></body>
    </html>`, { headers: { "content-type": "text/html" } });
}
