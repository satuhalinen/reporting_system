const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite3");

app.get("/", (req, res) => {
  db.all("SELECT * FROM worklog_worklog", (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
