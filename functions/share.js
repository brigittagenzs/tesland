export async function onRequest(context) {
  const { searchParams, pathname } = new URL(context.request.url);
  const GITHUB_URL = "https://raw.githubusercontent.com/brigittagenzs/tesland/refs/heads/main/domains.txt";

  // --- DATA MEDIA (Pisah-pisah agar acak total) ---
  const NAMES = ["Kira", "Luna", "Bella", "Siska", "Angel", "Vanya", "Mika", "Ziva", "Sherly", "Erika"];
  const PHOTOS = [
    "https://pub-static.fotor.com/assets/projects/pages/d5afed05-cf3f-42a8-9993-4ea6793f06e0/fotor-03ca073663a846c483f9828551a37c05.jpg",
    "https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-long-brown-hair_231208-1111.jpg",
    "https://img.freepik.com/free-photo/young-lady-with-luxury-accessories_144627-10651.jpg",
    "https://img.freepik.com/free-photo/beautiful-woman-portrait-outdoor_23-2148722136.jpg"
  ];
  const VIDEOS = ["https://fcc3da89-72f5-49f4-9043-9878b66838f5.selcdn.net/webroot/8/video.mp4"];
  const PHRASES = ["is waiting you come on touch", "is ready for you, touch here", "is online now, let's talk", "is waiting your call, touch to join"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Ambil URL tujuan dari parameter ?url=
  const destination = searchParams.get('url');

  // 1. API UNTUK GENERATOR (Ambil domain acak dari GitHub)
  if (searchParams.get('get_random') === 'true') {
    try {
      const res = await fetch(GITHUB_URL);
      const text = await res.text();
      const domains = text.split('\n').map(d => d.trim()).filter(d => d !== "");
      return new Response(JSON.stringify({ domain: pick(domains) }), {
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Gagal" }), { status: 500 });
    }
  }

  // Jika tidak ada parameter URL, arahkan ke Google (mencegah loop)
  if (!destination) {
    return Response.redirect("https://www.google.com", 302);
  }

  // 2. TAMPILAN LANDING PAGE (/landing)
  if (pathname.includes('/landing')) {
    const name = pick(NAMES);
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${name}</title>
          <style>
              body { margin: 0; background: black; color: white; font-family: sans-serif; overflow: hidden; }
              video { position: fixed; min-width: 100%; min-height: 100%; z-index: -1; filter: brightness(0.4); object-fit: cover; top:0; left:0; }
              .content { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; background: rgba(0,0,0,0.3); }
              img { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #ff007f; margin-bottom: 20px; object-fit: cover; box-shadow: 0 0 20px rgba(255,0,127,0.5); }
              h1 { font-size: 2.5em; margin: 0; text-shadow: 2px 2px 5px rgba(0,0,0,0.5); }
              p { font-size: 1.2em; margin: 10px 0 30px 0; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }
              .btn { background: #ff007f; color: white; padding: 18px 60px; border-radius: 40px; text-decoration: none; font-weight: bold; font-size: 1.5em; animation: pulse 1s infinite; display: inline-block; }
              @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
          </style>
      </head>
      <body>
          <video autoplay muted loop playsinline><source src="${pick(VIDEOS)}" type="video/mp4"></video>
          <div class="content">
              <img src="${pick(PHOTOS)}">
              <h1>${name}</h1>
              <p>${name} ${pick(PHRASES)}</p>
              <a href="${destination}" class="btn">TOUCH ME</a>
          </div>
      </body>
      </html>`, { headers: { "content-type": "text/html" } });
  }

  // 3. TAMPILAN PREVIEW MEDSOS (DEFAULT)
  const namePreview = pick(NAMES);
  const title = `${namePreview} ${Math.random() > 0.5 ? 'is live now' : 'is ready now'}`;
  const desc = `${Math.floor(Math.random() * 900000 + 10000).toLocaleString('id-ID')} girls ready`;
  const photoPreview = pick(PHOTOS);
  const landingUrl = `${new URL(context.request.url).origin}/landing?url=${encodeURIComponent(destination)}`;

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${photoPreview}">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:image" content="${photoPreview}">
      <meta http-equiv="refresh" content="0; url=${landingUrl}">
    </head>
    <body><script>window.location.href="${landingUrl}"</script></body>
    </html>`, { headers: { "content-type": "text/html" } });
}
