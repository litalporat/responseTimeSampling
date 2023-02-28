const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen("3000", () => {
  console.log("Server is runnig on port 3000");
});
