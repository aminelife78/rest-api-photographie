



const db = require("../db/db");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const bcrypt = require("bcrypt");

// recuperer admin
const getAdmin = asyncHandler(async (req, res) => {
  const admin = await db.query("SELECT * FROM admin");

  res.status(200).json({ data: admin });
});


// creer un admin
const createAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO admin (username,password) VALUES (?,?)", [
    username,
    hash,
  ]);
  res.status(201).json({ message: "admin bien ajouter" });
});

// modifier un admin
const updateAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const User = await db.query("SELECT * FROM admin WHERE id=?", [id]);

  if (!User[0]) {
    return next(new apiError(`pas de admin pour ce id ${id}`, 400));
  }
  const hash = await bcrypt.hash(password, 10);
  await db.query("UPDATE admin SET username=?,password=? WHERE id=?", [
    username,
    hash,
    id,
  ]);
  res.status(200).json({ message: `le admin avec id ${id} est bien modifier` });
});

// exporte crud les admin
module.exports = {
  createAdmin,
  updateAdmin,
  getAdmin
};
