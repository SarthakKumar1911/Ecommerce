const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

//Database connection
const mongoURL = process.env.mongoURL;
const mongopath = "e-commerce";
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL + mongopath);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};
connectDB();

//APi Creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Schema for creating Product
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Create an endpoint for adding products using admin panel
app.post("/addproduct", async (req, res) => {
  let id,
    products = await Product.find({});

  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else id = 1;

  // Create a new product instance
  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  // Save the new product to the database
  await product.save();
  // Send a success response
  res.json({
    success: true,
    name: req.body.name,
    description: req.body.description,
  });
});

// Create an endpoint for removing products using admin panel
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// endpoint for getting all products data
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// endpoint for getting latest products data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(0).slice(-8);
  res.send(arr);
});

// endpoint for getting womens products data
app.get("/popularinmen", async (req, res) => {
  let products = await Product.find({ category: "men" });
  let arr = products.splice(0, 4);
  res.send(arr);
});

// endpoint for getting related products data
app.post("/relatedproducts", async (req, res) => {
  const products = await Product.find({ category: req.body.category });
  const arr = products.slice(0, 4);
  res.send(arr);
});

// MiddleWare to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  } else {
    try {
      const data = jwt.verify(token, process.env.secret);
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

// Create an endpoint for saving the product in cart
app.post("/addtocart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// Create an endpoint for removing the product in cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// Create an endpoint for getting cartdata of user
app.post("/getcart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Schema for creating user model
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now() },
});

//Create an endpoint at ip/auth for regestring the user & sending auth-token
app.post("/signup", async (req, res) => {
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: success,
      errors: "existing user found with this email",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  //to use jwt authentication
  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, process.env.secret);
  success = true;
  res.json({ success, token });
});

// Create an endpoint at ip/login for login the user and giving auth-token
app.post("/login", async (req, res) => {
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const token = jwt.sign(data, process.env.secret);
      res.json({ success, token });
    } else {
      return res.status(400).json({
        success: success,
        errors: "please try with correct email/password",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "please try with correct email/password",
    });
  }
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  else {
    console.log("Server is running on port " + PORT);
  }
});
