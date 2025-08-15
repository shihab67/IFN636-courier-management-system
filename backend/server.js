const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const upload = require("./config/multer");

dotenv.config();
const app = express();

// CORS setup
app.use(
	cors({
		origin: "http://3.27.245.23/:3000",
		methods: "GET,POST,PUT,DELETE,PATCH",
		credentials: true,
	})
);

// Body parsing
app.use(express.json()); // for JSON payloads
app.use(express.urlencoded({ extended: false })); // for form data
app.use(cookieParser());

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", upload.any(), require("./routes/authRoutes"));
app.use("/api/users", upload.any(), require("./routes/userRoutes"));
app.use("/api/delivery", upload.any(), require("./routes/deliveryRoutes"));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Server start
if (require.main === module) {
	connectDB();
	const PORT = process.env.PORT || 5001;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
