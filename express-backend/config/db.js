const mongoose = require("mongoose");

// ✅ MongoDB Connection URL
const mongoURI = "mongodb+srv://dhineshdine18:rN1BHJM48P8tobub@clusteralamo.sm5fw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAlamo";

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ Connected to MongoDB successfully!");
});

db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

module.exports = db;
