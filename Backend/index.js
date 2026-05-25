const https = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const DbConnection = require("./dbConnection/db");
const todoRoutes = require("./routes/todo-routes");

DbConnection();

const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});
