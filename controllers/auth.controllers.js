const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");


// connextion
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const admin = await db.query("SELECT * FROM admin WHERE username=?", [username]);

  if (!admin[0]) {
    const message = "L'utilisateur demandée n'existe pas";
    return next(new apiError(message), 404);
  }


  const isPasswordValid = await bcrypt.compare(password, admin[0].password);

  if (!isPasswordValid) {
    const message = "Email ou mot de passe  est incorrecte.";
    return res.status(404).json({ message });
  } else {
    // jwt
    const token = jwt.sign(
      {
        adminId: admin[0].id,
       
        adminUsername: admin[0].username,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

       
    const message = `L'utilisateur a été connecté avec succès`;
    return res.json({ message, data: admin, token });
  }
});

// verifier token (autorisation)
const authorisation = (...myRole) => {
  return asyncHandler(async (req, res, next) => {
    // recuperation si le token existe dans header
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
      return next(new apiError(message), 401);
    }

    // recupération token et le vérifier
    const token = authorizationHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (error, decodedToken) => {
        if (error) {
          const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
          return res.status(401).json({ message, data: error });
        }
        const adminId = decodedToken.adminId;

        const currentUser = await db.query("SELECT * FROM admin WHERE id=?", [
          adminId,
        ]);
        if (!currentUser[0]) {
          const message = `L'utilisateur n'existe pas pour ce token.`;
          return next(new apiError(message), 401);
        }

       
        if (!myRole.includes(currentUser[0].type)) {
          return next(
            new apiError("vous n'etes pas autorisé a éffectué cette tache"),
            403
          );
        }
        next();
      }
    );
  });
};

module.exports = {
  login,
  authorisation,
};
