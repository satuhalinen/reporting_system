const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite3");

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

app.get("/monthly-working-hours/:endYear/:years_back", (req, res) => {
  let endYear = req.params.endYear;
  const yearsBack = req.params.years_back;
  let startYear = Number(endYear) - Number(yearsBack);
  endYear = endYear.toString();
  startYear = startYear.toString();
  db.all(
    "SELECT CAST(strftime('%Y', date) AS INTEGER) AS year, CAST(strftime('%m', date) AS INTEGER) AS month, SUM(hours) AS total_hours FROM worklog_worklog WHERE (strftime('%Y', date) between ? AND ?) AND (deleted = 0) GROUP BY year, month ORDER BY year, month",
    [startYear, endYear],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.get("/billability-working-hours/:endYear/:years_back", (req, res) => {
  let endYear = req.params.endYear;
  const yearsBack = req.params.years_back;
  let startYear = Number(endYear) - Number(yearsBack);
  endYear = endYear.toString();
  startYear = startYear.toString();
  db.all(
    "SELECT CAST(strftime('%Y', date) AS INTEGER) AS year, CAST(strftime('%m', date) AS INTEGER) AS month, SUM(hours) AS total_hours, billable FROM worklog_worklog WHERE (strftime('%Y', date) between ? AND ?) AND (deleted = 0) GROUP BY year, month, billable ORDER BY year, month",
    [startYear, endYear],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.get("/salary", (req, res) => {
  db.all(
    "SELECT date FROM payday_payday WHERE deleted = 0 ORDER BY date DESC",
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.get("/salary_report/:selected_date", (req, res) => {
  const selectedDate = req.params.selected_date;
  db.all(
    "SELECT tuntikirjaus_employee.lastname, tuntikirjaus_employee.firstname, workphase_workphase.report_name, SUM(worklog_worklog.worker_hours) AS hours FROM worklog_worklog JOIN payday_payday ON worklog_worklog.payday_id = payday_payday.id JOIN workphase_workphase ON worklog_worklog.workphase_id = workphase_workphase.id JOIN tuntikirjaus_employee ON worklog_worklog.employee_id = tuntikirjaus_employee.id WHERE payday_payday.date= ? GROUP BY tuntikirjaus_employee.id, workphase_workphase.report_name ORDER BY tuntikirjaus_employee.lastname, tuntikirjaus_employee.firstname",
    [selectedDate],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
