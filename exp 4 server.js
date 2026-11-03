const http = require("http");

const server = http.createServer((request, response) => {

    response.write("Hello! Server is connected.");
    response.end();

});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});