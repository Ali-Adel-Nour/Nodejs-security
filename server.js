const fs = require('fs')


const path = require('path');
// dlw2ty a2der azweb option 2ny anzl ssl certifacte
const https = require('https')
const express = require('express');
const helmet = require('helmet');
const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')
require('dotenv').config()
const PORT = 3000

const config = {
  CLIENT_ID : process.env.CLIENT_ID,
  CLIENT_SECERT: process.env.CLIENT_SECERT,
}

const AUTH_OPTIONS = {

    callbackURL:'/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret:config.CLIENT_SECRET,
  }

  function verifyCallback(accessToken,refreshToken,profile,done){
    console.log('Google Profile',profile)
    done(null,profile)
  }

passport.use(new Strategy(AUTH_OPTIONS,verifyCallback))

const app = express();

app.use(helmet())
app.use(passport.initialize());

function checkLoggedIn(req,res,next) {
  const isLoggedIn = true
  if(!isLoggedIn) {
    return res.status(401).json({
      error: 'You must log in!',
    });
  }
  next();
}

app.get('/auth/google',(req,res) => {})
app.get('/auth/google/callback',passport.authenticate('google',{
  failureRedirect: '/failure',
  successRedirect: '/',
  session:false,
}),(req,res) => {
  console.log('Google called us back!')
})

app.get('/auth/logout',(req,res) =>{})

app.get('/secret',checkLoggedIn,(req,res)=>{
  res.send('The value is 7')
})

app.get('/failure',(req,res)=>{
 return res.send('Failed to log in !')
})

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, 'public','index.html' ))
})



https.createServer({
  key:fs.readFileSync('key.pem'),
  cert:fs.readFileSync('cert.pem'),
},app).listen(PORT,()=>{
  console.log(`Listening on port ${PORT}...`)
})