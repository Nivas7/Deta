export const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  console.log("Please add the Mongo URI to .env");
  process.exit(1);
}

export const JWT_SECRET = process.env["JWT_SECRET"];

if (!JWT_SECRET) {
  console.log("Please add the JWT secret to .env");
  process.exit(1);
}
