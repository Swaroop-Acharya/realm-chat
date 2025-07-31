
const express = require('express');
const { createServer } = require('node:http');

const hostName = '127.0.0.1';
const port = 8000;


const app = express();
const server = createServer(app);

app.get('/',(req,res)=>{
  res.send("Ping pon");
});

server.listen(port,hostName,()=>{
  console.log(`Server is up and running at http://${hostName}:${port}/`);
});
