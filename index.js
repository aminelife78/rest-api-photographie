/*** Import des modules nécessaires */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
var cors = require("cors");
const apiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMidlleware");
dotenv.config({ path: "config.env" });

/*** Initialisation de l'API */
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

let session = require("express-session");

app.use(
  session({
    secret: "keyboard-cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

dotenv.config({ path: "config.env" });

if (process.env.NODE_ENV === "undefined") {
  app.use(morgan("dev"));
}



/*** Import des modules de routage */
const authentificationRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");
const routeCategories = require("./routes/categories.routes");
const routeGalerie = require("./routes/galerie.routes");
const routeTarifs = require("./routes/tarifs.routes");



/*** Mise en place du routage */
app.use("/api/v1/auth", authentificationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", routeCategories);
app.use("/api/v1/galerie", routeGalerie);
app.use("/api/v1/tarifs", routeTarifs);


// create l'erreur avec apiError
app.all("*", (req, res, next) => {
  next(new apiError(`can't find this route${req.originalUrl}`, 400));
});

// global error handiling middleware for express
app.use(globalError);

/*Start serveur*/
const port = process.env.PORT;
app.listen(port, () => console.log(`http://localhost:${port}`));

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection error: ${err.name} ${err.message}`);
});
