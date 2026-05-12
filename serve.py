import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Fallback to index.html for SPA routing
        if not os.path.exists(os.path.join(DIRECTORY, self.path.lstrip('/'))):
            self.path = '/index.html'
        return super().do_GET()

print(f"Starting server at http://localhost:{PORT}")
print("Make sure you have run 'npm run build' first if you have Node.js.")
print("If you don't have Node.js, ensure the 'dist' folder exists.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
