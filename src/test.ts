import jwt from "jsonwebtoken";

// Define your secret key. This should ideally be stored securely.
const secretKey = "your_secret_key";

// Define the payload for the token
const payload = {
	// Add any data you want to include in the token
	userId: "exampleUserId",
};

// Define options for token expiration (10 hours from now)
const options: jwt.SignOptions = {
	expiresIn: "10h",
};

// Generate the token
const token = jwt.sign(payload, secretKey, options);

console.log("Generated Token:", token);
