require("dotenv").config();

const JWT_SECRET = `${process.env.JWT_SECRET}` || "super-strong-secret";

module.exports = { JWT_SECRET };
