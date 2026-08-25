async function run() {
  const url = "https://drive.google.com/uc?export=download&id=1HmArJE69J6gyPQcktIMzfxhNW68YPLHNOYy5ANFoyZY";
  const res = await fetch(url);
  console.log("Status:", res.status);
  console.log("Headers:", Array.from(res.headers.entries()));
  const text = await res.text();
  console.log("Body length:", text.length);
  console.log("Body preview:", text.substring(0, 500));
}
run();
