// ===============================
// WiseMove Backend
// ===============================

// Fix MongoDB SRV/DNS resolution
const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

// Load environment variables
require("dotenv").config();

// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Enquiry model
const Enquiry = require("./models/Enquiry");

// Create Express app
const app = express();


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// MongoDB Connection
// ===============================

if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is missing from .env");
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}


// ===============================
// Home / Health Check
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WiseMove backend is running"
  });
});


// ===============================
// CREATE ENQUIRY
// POST /api/enquiries
// ===============================

app.post("/api/enquiries", async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      message
    } = req.body;

    // Required field validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      company: company || "",
      phone: phone || "",
      message
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      enquiry
    });

  } catch (error) {
    console.error("Create enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry.",
      error: error.message
    });
  }
});


// ===============================
// GET ALL ENQUIRIES
// GET /api/enquiries
// ===============================

app.get("/api/enquiries", async (req, res) => {
  try {
    const enquiries = await Enquiry
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      enquiries
    });

  } catch (error) {
    console.error("Get enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries.",
      error: error.message
    });
  }
});


// ===============================
// GET ONE ENQUIRY
// GET /api/enquiries/:id
// ===============================

app.get("/api/enquiries/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found."
      });
    }

    res.json({
      success: true,
      enquiry
    });

  } catch (error) {
    console.error("Get single enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry.",
      error: error.message
    });
  }
});


// ===============================
// UPDATE ENQUIRY
// PUT /api/enquiries/:id
// ===============================

app.put("/api/enquiries/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      message,
      status
    } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        company,
        phone,
        message,
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found."
      });
    }

    res.json({
      success: true,
      message: "Enquiry updated successfully.",
      enquiry
    });

  } catch (error) {
    console.error("Update enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update enquiry.",
      error: error.message
    });
  }
});


// ===============================
// DELETE ENQUIRY
// DELETE /api/enquiries/:id
// ===============================

app.delete("/api/enquiries/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found."
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully."
    });

  } catch (error) {
    console.error("Delete enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry.",
      error: error.message
    });
  }
});


// ===============================
// 404 ROUTE
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found."
  });
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `WiseMove backend running on http://localhost:${PORT}`
    );
  });
}

module.exports = app;