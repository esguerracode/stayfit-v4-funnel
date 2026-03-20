const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

http.createServer((req, res) => {
    let filePath = '.' + decodeURI(req.url); // decode exactly
    if (filePath == './') filePath = './stayfit_landing.html';
    
    // avoid query string mess
    filePath = filePath.split('?')[0];

    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.jpeg': contentType = 'image/jpeg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('<h1>404 File Not Found: ' + filePath + '</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(PORT, () => {
    console.log('Servidor ultra-rapido iniciado con exito en http://localhost:' + PORT + '/stayfit_landing.html');
});
