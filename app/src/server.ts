import HttpServer from 'http-server';

const PORT = 8001;
const server = HttpServer.createServer({
    root: './app/'
});
console.log(`Listening on port ${PORT}.`) ;
server.listen(PORT, 'localhost');

export default server;