import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // temporary for dev only

//// Signing up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    /// Check if email or username already exists in the database
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or username already taken" });
    }

    // Create user (password stored as plain text, per your request)
    const user = await prisma.user.create({
      data: { username, email, password }
    });

    /// Generate JWT
    const token = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/// Loggin in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /// Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    /// Looks up the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    /// Create JWT
    const token = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Succesfully logged in!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
