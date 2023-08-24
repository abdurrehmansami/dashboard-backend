const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");

const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";

// Middlewares
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello! The App Is Working");
// });

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  // res.send(result);
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "Something Went Wrong.." });
    }
    res.send({ result, auth: token });
  });
  // res.send(user);
});
app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "Something Went Wrong.." });
        }
        res.send({ user, auth: token });
      });
      // res.send(user);
    } else {
      res.send({ result: "No User Found" });
    }
  } else {
    res.send({ result: "No User Found" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});
app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Products Found" });
  }
});

app.delete("/product/:id", async (req, res) => {
  let result = await Product.findByIdAndDelete(req.params.id);

  if (!result) {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
// UPDATE
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (!result) {
    return res.status(500).json({
      success: false,
      message: "Record Not Found",
    });
  }
  res.send(result);
  res.status(200).json({
    success: true,
    message: "Record Found",
  });
});
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      // { price: { $regex: (req.params.key) } },
    ],
  });
  res.send(result);
});
app.listen(5000);
