# -*- coding: utf-8 -*-
from http.server import BaseHTTPRequestHandler, HTTPServer
from GramsMethod import GramsMethod
from NeuralMethod import NeuralMethod
from AlphabetMethod import AlphabetMethod
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
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(PythonTextServer, self).end_headers()

    def getResponce(self, files): 
        responce = ""

        grams_method = GramsMethod("docs/english.html", "docs/franch.html")
        responce += "Grams method:\n"
        for file in files:
            responce += "language of " + file + ": " + grams_method.get_language(self.filePath(file)) + "\n"

        alphabet_method = AlphabetMethod("docs/english.html", "docs/franch.html")
        responce += "Alphabet method:\n"
        for file in files:
            responce += "language of " + file + ": " + alphabet_method.get_language(self.filePath(file)) + "\n"

        responce += "Neural method:\n"
        for file in files:
            responce += "language of " + file + ": " + NeuralMethod(self.filePath(file)).get_result + "\n"

        return json.dumps(responce, ensure_ascii=False)
    
    def filePath(self, file):
        return "docs/" + file


if __name__ == '__main__':
    webServer = HTTPServer((hostName, serverPort), PythonTextServer)
    print('Server started http://%s:%s' % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print('Server stopped.')
