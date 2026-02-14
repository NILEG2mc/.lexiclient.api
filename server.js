const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Database!"))
    .catch(err => console.error("Database Connection Failed:", err));

// 2. Define the User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// 3. The Login Route (For your Client)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({ status: "success", message: "Welcome back!" });
    } else {
        res.status(401).json({ status: "error", message: "Invalid username or password." });
    }
});

// 4. Register Route (So you can actually create an account)
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ status: "success", message: "User registered!" });
    } catch (err) {
        res.status(400).json({ status: "error", message: "Username already taken." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Lexi Server running on port ${PORT}`));
