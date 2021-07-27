#!/usr/bin/python
# taken from http://www.piware.de/2011/01/creating-an-https-server-in-python/
# generate server.xml with the following command:
#    openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
# run as follows:
#    python simple-https-server.py
# then in your browser, visit:
#    https://localhost:4443
#
# openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes

import sys
import BaseHTTPServer, SimpleHTTPServer
import ssl
import os

certFile = os.path.join(os.path.dirname(__file__), 'server.pem')
httpd = BaseHTTPServer.HTTPServer(('192.168.1.135', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile=certFile, server_side=True)

if len(sys.argv) > 1:
    os.chdir(sys.argv[1])

print('Serving on https://127.0.0.1:4443')
httpd.serve_forever()