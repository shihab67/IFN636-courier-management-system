const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure public/uploads exists
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname.replace(
			/\s+/g,
			"_"
		)}`;
		cb(null, uniqueName);
	},
});

const upload = multer({ storage });

module.exports = upload;
