# -*- coding: utf-8 -*-
from http.server import BaseHTTPRequestHandler, HTTPServer
from TextParser import getModel
import json

hostName = 'localhost'
serverPort = 8080


class PythonTextServer(BaseHTTPRequestHandler):
    def do_POST(self):
        contentLength = int(self.headers['Content-Length'])
        postData = self.rfile.read(contentLength)

        jsonRequest = json.loads(postData.decode('utf-8'))
        jsonResponce = getModel(jsonRequest['Text'])

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()  
        self.wfile.write(bytes(jsonResponce, 'utf-8'))


if __name__ == '__main__':
    webServer = HTTPServer((hostName, serverPort), PythonTextServer)
    print('Server started http://%s:%s' % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print('Server stopped.')
