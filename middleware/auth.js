const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// create new user 
router.post("/register", [
  check("firstname").notEmpty().isString().isLength({ min: 4, max: 12 }),
  check("lastname").notEmpty().isString().isLength({ min: 4, max: 12 }),
  check("username").notEmpty().isString().isLength({ min: 4, max: 8 }),
  check("email").notEmpty().isEmail(),
  check("password").notEmpty().isString().isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // check if user already exists
  const userExists = await User.exists({ firstname: req.body.firstname, lastName: req.body.lastname, username: req.body.username, email: req.body.email });
  if (userExists) res.status(400).send("user already exists!");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new User
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    // save user
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// login with user (returns jwt  token with _id of mongo doc)
router.post("/login", [
  check("username").notEmpty().isLength({ min: 4, max: 8 }),
  check("password").notEmpty().isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // check if user already exists
  const userExists = await User.exists({ username: req.body.username });
  if (!userExists) res.status(400).send("user not found!");

  const user = await User.findOne({ username: req.body.username })

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Your name or password is wrong!");

  // Create and assing token
  const token = jwt.sign(
    {
      _id: user.id
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).send(token);
})

// get user by id
router.get("/", (req, res) => {
  res.send("Get user by id");
})

// get all users
router.get("/all", (req, res) => {
  res.send("Get all users");
})

// update user by id
router.patch("/", (req, res) => {
  res.send("update user")
})

// delete user by id
router.delete("/", (req, res) => {
  res.send("delete user by id");
})

// delete all users (dev)
router.delete("/all", (req, res) => {
  res.send("delete all users")
})

module.exports = router;