const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongStr="mongodb+srv://qrkhata:qrkhata123@cluster0.gpex6ct.mongodb.net/?appName=Cluster0"
const path = require("path"); 
const app = express();
app.use(cors());
app.use(express.json());


app.use("/public", express.static(path.join(__dirname,"public")));
app.use("/Logos", express.static(path.join(__dirname,"Logos")));

app.use((req, res, next) => {
  if (req.headers.host === "qrkhata.com") {
    return res.redirect(301, "https://www.qrkhata.com" + req.originalUrl);
  }
  next();
});

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"qrkhata.html"));
});

// MongoDB connection
mongoose.connect(mongStr)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("Mongo Error:", err));

// Schema
const WaitlistSchema = new mongoose.Schema({
  mobile: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});
const Waitlist = mongoose.model("Waitlist", WaitlistSchema);

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "qrkhata.html"));
});

// API route
app.post("/api/join", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ message: "Invalid mobile number" });
  }

  try {
    const exists = await Waitlist.findOne({ mobile });
    if (exists) {
      return res.status(409).json({
        message: "🚀 You already joined QR Khata!"
      });
    }

    await Waitlist.create({ mobile });

    res.json({
      message: "🎉 Welcome! You are now a QR Khata Founding Member"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("QR Khata running on http://localhost:3000");
});