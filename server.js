const fs = require('fs')


const path = require('path');
// dlw2ty a2der azweb option 2ny anzl ssl certifacte
const https = require('https')
const express = require('express');
const helmet = require('helmet');
const PORT = 3000
const app = express();

app.use(helmet())

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public','index.html' ))
})

app.get('/secret',(req,res)=>{
  res.send('Hello World')
})

https.createServer({
  key:fs.readFileSync('key.pem'),
  cert:fs.readFileSync('cert.pem'),
},app).listen(PORT,()=>{
  console.log(`Listening on port ${PORT}...`)
})