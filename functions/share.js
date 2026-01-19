export async function onRequest(context) {
  const { searchParams, pathname } = new URL(context.request.url);
  const GITHUB_DOMAINS_URL = "https://raw.githubusercontent.com/brigittagenzs/tesland/refs/heads/main/domains.txt";

  // --- ARRAY ACAK (Tambahkan link Anda di sini) ---
  const NAMES = ["Kira", "Luna", "Bella", "Siska", "Angel", "Vanya", "Mika", "Chika", "Sherly", "Ziva"];
  
  const PROFILE_PHOTOS = [
    "https://pub-static.fotor.com/assets/projects/pages/d5afed05-cf3f-42a8-9993-4ea6793f06e0/fotor-03ca073663a846c483f9828551a37c05.jpg",
    "https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-long-brown-hair_231208-1111.jpg",
    "https://img.freepik.com/free-photo/young-lady-with-luxury-accessories_144627-10651.jpg"
  ];

  const VIDEOS = [
    "https://fcc3da89-72f5-49f4-9043-9878b66838f5.selcdn.net/webroot/8/video.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4" 
  ];

  const PHRASES = [
    "is waiting for you. Come on, touch",
    "wants to chat. Tap",
    "is ready for you. Click",
    "is here. Let's go!"
  ];

  // --- FUNGSI PENGACAK ---
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  const randomName = pick(NAMES);
  const randomPhoto = pick(PROFILE_PHOTOS);
  const randomVideo = pick(VIDEOS);
  const randomPhrase = pick(PHRASES);
  const titleStatus = Math.random() > 0.5 ? "is live now" : "is ready now";
  
  const finalTitle = `${randomName} ${titleStatus}`;
  const randomCount = Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000;
  const description = `${randomCount.toLocaleString('id-ID')} girls ready`;

  const destination = searchParams.get('url') || "https://google.com";

  // API Internal untuk ambil domain acak dari GitHub
  if (searchParams.get('get_random') === 'true') {
    try {
      const response = await fetch(GITHUB_DOMAINS_URL);
      const text = await response.text();
      const domains = text.split('\n').map(d => d.trim()).filter(d => d !== "");
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      return new Response(JSON.stringify({ domain: randomDomain }), {
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Gagal" }), { status: 500 });
    }
  }

  // --- TAMPILAN LANDING PAGE ---
  if (pathname === '/landing') {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { margin: 0; overflow: hidden; font-family: sans-serif; background: black; color: white; }
              video { position: fixed; right: 0; bottom: 0; min-width: 100%; min-height: 100%; z-index: -1; filter: brightness(0.4) blur(1px); object-fit: cover; }
              .ui { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
              img { width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ff007f; margin-bottom: 15px; object-fit: cover; }
              .btn { background: #ff007f; color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1.2em; animation: pulse 1.5s infinite; }
              @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
          </style>
      </head>
      <body>
          <video autoplay muted loop playsinline><source src="${randomVideo}" type="video/mp4"></video>
          <div class="ui">
              <img src="${randomPhoto}">
              <h1>${randomName}</h1>
              <p>${randomName} ${randomPhrase}</p>
              <a href="${destination}" class="btn">TOUCH TO START</a>
          </div>
      </body>
      </html>
    `, { headers: { "content-type": "text/html" } });
  }

  // --- TAMPILAN PREVIEW UNTUK SOSMED ---
  const landingUrl = `${new URL(context.request.url).origin}/landing?url=${encodeURIComponent(destination)}`;
  
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${finalTitle}</title>
      <meta property="og:title" content="${finalTitle}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${randomPhoto}">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
      <meta http-equiv="refresh" content="0; url=${landingUrl}">
      <script>window.location.href = "${landingUrl}";</script>
    </head>
    <body></body>
    </html>
  `, { headers: { "content-type": "text/html" } });
}
