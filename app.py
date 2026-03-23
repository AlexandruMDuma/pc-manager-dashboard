"""
PC Manager Dashboard — Python HTTP Server

Serves the dashboard static files and provides JSON API endpoints
for CSV data. No external dependencies required.

Usage:
    python app.py
    Then open http://localhost:8080/pc-manager-dashboard.html
"""

import http.server
import socketserver
import json
import csv
import os
import sys
from urllib.parse import urlparse

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'dashboard')
DATA_DIR = os.path.join(BASE_DIR, 'test-data')


def read_csv(filename):
    filepath = os.path.join(DATA_DIR, filename)
    rows = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def normalize_profiles(rows):
    result = []
    for row in rows:
        result.append({
            'fmno': row.get('FMNO', ''),
            'full_name': row.get('Full Name', ''),
            'manager_fmno': row.get('Manager FMNO', ''),
            'manager_delegate_fmno': row.get('Manager Delegate FMNO', ''),
            'impact_level': row.get('Impact Level', ''),
            'region': row.get('Region', ''),
            'path': row.get('Path', ''),
        })
    return result


def normalize_requests(rows):
    result = []
    for row in rows:
        result.append({
            'request_id': row.get('Request ID', ''),
            'fmno': row.get('FMNO', ''),
            'request_date': row.get('Request Date', ''),
            'requester_fmno': row.get('Requester FMNO', ''),
            'requester_name': row.get('Requester Name', ''),
            'request_made_by': row.get('Request Made By', ''),
            'request_made_to': row.get('Request Made To', ''),
            'request_status': row.get('Request Status', ''),
            'shared_with_manager': row.get('Shared With Manager', ''),
            'request_month': row.get('Request Month', ''),
        })
    return result


def normalize_responses(rows):
    result = []
    for row in rows:
        result.append({
            'request_id': row.get('Request ID', ''),
            'response_id': row.get('Response ID', ''),
            'fmno': row.get('FMNO', ''),
            'response_date': row.get('Response Date', ''),
            'response_month': row.get('Response Month', ''),
            'topic': row.get('Topic', ''),
            'question_1': row.get('Question 1', ''),
            'answer_1': row.get('Answer 1', ''),
            'question_2': row.get('Question 2', ''),
            'answer_2': row.get('Answer 2', ''),
            'question_3': row.get('Question 3', ''),
            'answer_3': row.get('Answer 3', ''),
        })
    return result


CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
}


class DashboardHandler(http.server.BaseHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/profiles':
            self.send_json(normalize_profiles(read_csv('profiles.csv')))
        elif path == '/api/requests':
            self.send_json(normalize_requests(read_csv('fbn_requests.csv')))
        elif path == '/api/responses':
            self.send_json(normalize_responses(read_csv('fbn_responses.csv')))
        elif path == '/':
            self.send_redirect('/pc-manager-dashboard.html')
        else:
            self.serve_static(path)

    def send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_redirect(self, location):
        self.send_response(302)
        self.send_header('Location', location)
        self.end_headers()

    def serve_static(self, path):
        path = path.lstrip('/')
        filepath = os.path.join(STATIC_DIR, path)
        filepath = os.path.normpath(filepath)

        if not filepath.startswith(os.path.normpath(STATIC_DIR)):
            self.send_error(403)
            return

        if not os.path.isfile(filepath):
            self.send_error(404)
            return

        ext = os.path.splitext(filepath)[1].lower()
        content_type = CONTENT_TYPES.get(ext, 'application/octet-stream')

        with open(filepath, 'rb') as f:
            body = f.read()

        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        sys.stderr.write('[%s] %s\n' % (self.log_date_time_string(), format % args))


class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


def main():
    server = ThreadedHTTPServer(('0.0.0.0', PORT), DashboardHandler)
    print('PC Manager Dashboard running at http://localhost:%d' % PORT)
    print('Open http://localhost:%d/pc-manager-dashboard.html' % PORT)
    print('Press Ctrl+C to stop.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down.')
        server.server_close()


if __name__ == '__main__':
    main()
