const jwt = require('jsonwebtoken');
const privateKey = require('../auth/privateKey')
const connection = require("../db/db");
let session = require('express-session')
const apiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
  
// admin
const auth = (...myRole)=>{
return asyncHandler(async (req,res,next) => {
  const authorizationHeader = req.headers.authorization
  
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return next(new apiError(message), 401) 
  }
    
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, privateKey, async (error, decodedToken) => {
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return next(new apiError(message), 401)
    }
    
  
    const userId = decodedToken.userId
    req.session.userId = userId
    req.session.userRole = decodedToken.userRole 
    console.log(req.session.userRole,req.session.userId)

    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } else {
      
        const result  = await connection.query("SELECT role FROM users WHERE id=?",[userId])
            const role = decodedToken.userRole
            
           
            
              if(!myRole.includes(role)) {
                return next(new apiError("vous n'etes pas autorisé a éffectué cette tache"), 404) 
                    
              }
              next() 
             
              
       

            
          
    
          }
        })

      })
}



module.exports = {auth}