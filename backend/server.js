// import express from "express";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import verifyToken from "./middleware/auth.js";
// import showRouter from "./routes/show.js";
// import searchRouter from "./routes/search.js"; // 👈 add this

// const app = express();

// app.use("/api", searchRouter);
// // ---------- MIDDLEWARE ----------
// app.use(express.json());

// // allow frontend (Vite) to talk to this API
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// // ---------- AUTH DEMO ----------
// app.post("/auth/login", (req, res) => {
//   try {
//     const user = { id: 1, email: "tester@example.com", role: "tester" };
//     const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", {
//       expiresIn: "1h",
//     });
//     return res.json({ token, user });
//   } catch (e) {
//     console.error("LOGIN_ERROR:", e);
//     return res.status(500).json({ success: false, error: "Login failed" });
//   }
// });

// // Health check
// app.get("/health", (_req, res) => res.json({ ok: true }));

// // Protected probe
// app.get("/private/ping", verifyToken, (req, res) => {
//   res.json({ ok: true, user: req.user ?? null });
// });

// // ---------- ROUTES ----------

// // Protected shows API
// app.use("/shows", verifyToken, showRouter);

// // PUBLIC search API for now (no auth)
// app.use("/api", searchRouter); // router has GET /search

// // ---------- START SERVER ----------
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`API on http://localhost:${PORT}`);
// });


// // backend/server.js
// import express from "express";
// import cors from "cors";
// import jwt from "jsonwebtoken";

// import verifyToken from "./middleware/auth.js";
// import showRouter from "./routes/show.js";
// import searchRouter from "./routes/search.js";

// const app = express();

// // ---------- GLOBAL MIDDLEWARE (must come BEFORE routes) ----------
// app.use(
//   cors({
//     // For dev, you can be specific:
//     // origin: "http://localhost:5174",

//     // Or, to keep it simple while you debug, allow all:
//     origin: "*",
//   })
// );

// app.use(express.json());

// // ---------- AUTH DEMO ----------
// app.post("/auth/login", (req, res) => {
//   try {
//     const user = { id: 1, email: "tester@example.com", role: "tester" };
//     const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", {
//       expiresIn: "1h",
//     });
//     return res.json({ token, user });
//   } catch (e) {
//     console.error("LOGIN_ERROR:", e);
//     return res.status(500).json({ success: false, error: "Login failed" });
//   }
// });

// // ---------- HEALTH ----------
// app.get("/health", (_req, res) => res.json({ ok: true }));

// // ---------- PROTECTED PROBE ----------
// app.get("/private/ping", verifyToken, (req, res) => {
//   res.json({ ok: true, user: req.user ?? null });
// });

// // ---------- ROUTES ----------

// // Protected shows API
// app.use("/shows", verifyToken, showRouter);

// // PUBLIC search API (no auth for now)
// app.use("/api", searchRouter);   // <-- ONLY HERE, once, AFTER cors + json

// // ---------- START SERVER ----------
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`API on http://localhost:${PORT}`);
// });

// // backend/server.js
// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import jwt from "jsonwebtoken";

// import verifyToken from "./middleware/auth.js";
// import showRouter from "./routes/show.js";
// import searchRouter from "./routes/search.js";

// const app = express();

// // ---------- CORS + JSON FIRST ----------
// app.use(
//   cors({
//     origin: "*", // ✅ allow all origins for local dev (5173, 5174, etc.)
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());

// // Small log so we KNOW this file is the one running
// app.use((req, _res, next) => {
//   console.log("Incoming:", req.method, req.url);
//   next();
// });

// // ---------- AUTH DEMO (optional) ----------

// app.post("/auth/login", (req, res) => {
//   try {
//     const user = { id: 1, email: "tester@example.com", role: "tester" };
//     const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", {
//       expiresIn: "1h",
//     });
//     return res.json({ token, user });
//   } catch (e) {
//     console.error("LOGIN_ERROR:", e);
//     return res.status(500).json({ success: false, error: "Login failed" });
//   }
// });

// // Health check
// app.get("/health", (_req, res) => res.json({ ok: true }));

// // Protected probe
// app.get("/private/ping", verifyToken, (req, res) => {
//   res.json({ ok: true, user: req.user ?? null });
// });

// // ---------- ROUTES ----------

// // Protected shows API
// app.use("/shows", verifyToken, showRouter);

// // PUBLIC search API (no auth)
// app.use("/api", searchRouter); // ✅ /api/search lives here

// // ---------- START SERVER ----------
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`API on http://localhost:${PORT}`);
// });


// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

import verifyToken from "./middleware/auth.js";
import showRouter from "./routes/show.js";
import searchRouter from "./routes/search.js";

const app = express();

// ---------- GLOBAL MIDDLEWARE ----------

// Allow frontend (Vite) & others to call this API
app.use(
  cors({
    origin: "*", // ok for local dev; tighten later for production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON bodies
app.use(express.json());

// Tiny logger so you can see requests in the terminal
app.use((req, _res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ---------- AUTH DEMO ROUTES (OPTIONAL) ----------

app.post("/auth/login", (_req, res) => {
  try {
    const user = { id: 1, email: "tester@example.com", role: "tester" };
    const token = jwt.sign(user, process.env.JWT_SECRET || "dev_secret", {
      expiresIn: "1h",
    });
    res.json({ token, user });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Simple protected example
app.get("/private/ping", verifyToken, (req, res) => {
  res.json({ ok: true, user: req.user ?? null });
});

// ---------- MAIN ROUTES ----------

// Protected shows API
app.use("/shows", verifyToken, showRouter);

// Public search API (this is where /api/search lives)
app.use("/api", searchRouter);

// ---------- START SERVER ----------

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
