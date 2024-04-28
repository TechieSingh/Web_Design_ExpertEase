import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // Check if there is an Authorization header
  if (!authHeader)
    return res.status(401).send({ message: "No token provided" });

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1]; // Assuming the header is "Bearer TOKEN"

  // If there is no token in the header, send an unauthorized status
  if (!token) return res.status(401).send({ message: "No token provided" });

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid token" }); // Token is not valid

    // If the token is valid, add the user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

export default authenticateToken;
