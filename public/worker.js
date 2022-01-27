importScripts("./index.js");

num = 1;
async function* activate(urls, event) {
  for (const url of urls) {
    num++;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`skipping ${response.status} response for ${url}`);
      } else if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0" ||
        !response.body
      ) {
        console.warn(`skipping empty response for ${url}`);
      } else {
        const client = await clients.get(event.clientId);
        if (!client) return;
        client.postMessage({ num, all: urls.length });
        yield response
      }
    } catch (err) {
      console.error(err);
    }
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const [name] = url.pathname.match("/api/twitter") || [,];
  if (name) {
    return event.respondWith(event.request
      .text()
      .then((data) => {
        const target = JSON.parse(data);
        const result = downloadZip(activate(target, event));
        return result;
      })
      .catch((err) => new Response(err.message, { status: 500 })));
  }
});
