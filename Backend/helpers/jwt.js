const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const SECRET = "This is Secret"

const generateToken = (payload) =>{
   const token = jwt.sign(payload,SECRET)
   return token
}

const verifyToken = (token)=>{
   // ketika verifikasi, jwt veifi akan melempar error
   const payload = jwt.verify(token, SECRET)
   return payload
}

const generateSecretKey = ()=>{
   const keyLength = 64; // Choose an appropriate key length (e.g., 64 bytes for a 512-bit key)
   const buffer = crypto.randomBytes(keyLength);
   return buffer.toString('hex')
 }

 const getUserIdFromToken = (token, secretKey) => {
   try {
     const decodedToken = jwt.verify(token, secretKey)
     return decodedToken.userId;
   } catch (err) {
     console.error('Token verification error:', err.message)
     return null;
   }
 }

module.exports = {
   generateToken,
   verifyToken,
   generateSecretKey,
   getUserIdFromToken
}