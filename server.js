const app = require("./src/app");
const http = require("http");
const Server = http.createServer(app) ;

const PORT = process.env.PORT ||9000;

//running on port
Server.listen(PORT,()=>{
    console.log(`listening on: http://localhost:${PORT}`);
})