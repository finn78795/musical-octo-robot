// This script runs in the background and fixes the "White Screen"
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Only proxy requests that are NOT for our own GitHub files
    if (!url.host.includes(location.host) && url.protocol.startsWith('http')) {
        const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(event.request.url);
        
        event.respondWith(
            fetch(proxyUrl).then(response => {
                // We strip the security headers that cause the crash
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Access-Control-Allow-Origin', '*');
                newHeaders.delete('Content-Security-Policy');
                newHeaders.delete('X-Frame-Options');

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            })
        );
    }
});
