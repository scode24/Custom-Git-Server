const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/GitRoutes");
require("dotenv").config();

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes
app.use("/cgitapp", router);

// Connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
