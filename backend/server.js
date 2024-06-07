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

app.get("/working-hours", (req, res) => {
  db.all(
    "SELECT tuntikirjaus_employee.firstname, tuntikirjaus_employee.lastname, worklog_worklog.hours FROM tuntikirjaus_employee JOIN worklog_worklog ON tuntikirjaus_employee.id = worklog_worklog.employee_id",
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.get("/monthly-working-hours", (req, res) => {
  db.all(
    "SELECT strftime('%Y', date) AS year, strftime('%m', date) AS month, SUM(worker_hours) AS total_hours FROM worklog_worklog GROUP BY year, month ORDER BY year, month",
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.listen(port);
