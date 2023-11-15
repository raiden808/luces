const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors()); // Enable CORS for all routes

app.use(express.json());

// Replace with your MongoDB URI

const mongoURI = "";
// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a schema and model
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("items", ItemSchema);

// CRUD operations
// Create
app.post("/items", (req, res) => {
  console.log("Items Created:", req.body);
  const newItem = new Item(req.body);
  newItem.save().then((item) => res.json(item));
});

// Read
app.get("/items", (req, res) => {
  Item.find().then((items) => res.json(items));
});

// Update
app.put("/items/:id", (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((item) =>
    res.json(item)
  );
});

// Delete
app.delete("/items/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id).then(() => res.json({ success: true }));
});

/**
 * User Section
 */

// User Schema
const userCollection = mongoose.connection.collection("user");

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Account is: ", req.body);

  const data = await userCollection.findOne({
    /* your query */
    username: username,
  });

  if (data.password === password) {
    // In real applications, use bcrypt to hash and compare passwords
    res.send("Login successful!");
  } else {
    res.status(401).send("Login failed: Incorrect password");
  }
});

// Start the server
const port = 3000;

app.use(express.static('public'));
app.listen(port, () => console.log(`Server running on port ${port}`));
