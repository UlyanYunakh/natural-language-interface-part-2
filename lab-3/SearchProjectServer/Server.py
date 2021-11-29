# -*- coding: utf-8 -*-
from http.server import BaseHTTPRequestHandler, HTTPServer
from TFIDF import summarize as ftidfSummarize
from ML import summarize as mlSummarize
import json

hostName = 'localhost'
serverPort = 8080


class PythonTextServer(BaseHTTPRequestHandler):
    def do_POST(self):
        contentLength = int(self.headers['Content-Length'])
        postData = self.rfile.read(contentLength)

        jsonRequest = json.loads(postData.decode('utf-8'))
        jsonResponce = self.getResponce(jsonRequest['files'])
        print(jsonResponce)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(jsonResponce, 'utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header(
            'Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(PythonTextServer, self).end_headers()

    def getResponce(self, files):
        responce = ""
        responce += "TF-IDF method:\n"
        for file in files:
            responce += ftidfSummarize(file["name"], file["data"], file["lang"]) + "\n"

        responce += "\nML method:\n"
        for file in files:
            responce += mlSummarize(file["name"], file["data"], file["lang"]) + "\n"

        return json.dumps(responce, ensure_ascii=False)


if __name__ == '__main__':
    webServer = HTTPServer((hostName, serverPort), PythonTextServer)
    print('Server started http://%s:%s' % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print('Server stopped.')
