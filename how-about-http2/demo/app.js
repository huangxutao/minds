const fs = require('fs');
const http = require('http');
const http2 = require('http2');

const options= {
  key: fs.readFileSync('ssl/private.pem'),
  cert: fs.readFileSync('ssl/file.crt')
};

const static = {
  style: fs.readFileSync('static/style.css'),
  script: fs.readFileSync('static/script.js'),
  html: fs.readFileSync('static/index.html')
};

/**
 * HTTP/1 Server
 */
const app1 = http.createServer((req, res) => {
  if(req.url === '/static/style.css') {
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(static.style);
  } else if(req.url === '/static/script.js') {
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    res.end(static.script);
  } else if(req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(static.html);
  } else {
    res.writeHead(404);
    res.end();
  }

  console.log(`HTTP/1 ${req.method}: ${req.url}`);
});

/**
 * HTTP/2 Server with Server Push
 */
const app2 = http2.createServer(options, (req, res) => {
  let push_style = res.push('/static/style.css', {
    status: 200,
    method: 'GET',
    request: {
      accept: '*/*'
    },
    response: {
      'Content-Type': 'text/css'
    }
  });

  let push_script = res.push('/static/script.js', {
    status: 200,
    method: 'GET',
    request: {
      accept: '*/*'
    },
    response: {
      'Content-Type': 'application/javascript'
    }
  });

  push_style.end(static.style);
  push_script.end(static.script);

  if(req.url === '/') {
    res.end(static.html);
  } else {
    res.writeHead(404);
    res.end();
  }
  console.log(`HTTP/2 ${req.method}: ${req.url}`);
});

/**
 * Start Servers
 */
app1.listen(3001, () => {
  console.log('HTTP/1 server running at 3001 port ...\n------------------------------------------');
});

app2.listen(3002, () => {
  console.log('HTTP/2 servr running at 3002 port ...\n------------------------------------------');
});