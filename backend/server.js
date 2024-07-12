const { initializeApp, cert } = require("firebase-admin/app");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const serviceAccount = require("./serviceAccountKey.json");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
app.use(cors());
app.use(express.json());
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db.sqlite3");

initializeApp({
  credential: cert(serviceAccount),
});
const firebaseDb = getFirestore();

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

app.get("/salary_report", (req, res) => {
  db.all(
    "SELECT tuntikirjaus_employee.lastname, tuntikirjaus_employee.firstname, workphase_workphase.report_name, SUM(worklog_worklog.worker_hours) FROM worklog_worklog JOIN payday_payday ON worklog_worklog.payday_id = payday_payday.id JOIN workphase_workphase ON worklog_worklog.workphase_id = workphase_workphase.id JOIN tuntikirjaus_employee ON worklog_worklog.employee_id = tuntikirjaus_employee.id GROUP BY tuntikirjaus_employee.id, workphase_workphase.report_name ORDER BY tuntikirjaus_employee.lastname, tuntikirjaus_employee.firstname",
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    }
  );
});

async function addUser(email, password, lastname, firstname) {
  const userRecord = await getAuth().createUser({
    email: email,
    password: password,
  });

  const data = {
    firstname: firstname,
    lastname: lastname,
  };

  const res = await firebaseDb
    .collection("users")
    .doc(userRecord.uid)
    .set(data);
  return { userRecord, res };
}

app.post("/add-user", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  addUser(email, password, lastname, firstname)
    .then(() => {
      res.status(201).json({ message: "Käyttäjä luotu!" });
    })
    .catch(() => {
      res.status(500).json({ message: "Virhe!" });
    });
});

app.get("/user-list", (req, res) => {
  const listAllUsers = async (nextPageToken) => {
    try {
      const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
      const records = listUsersResult.users.map((userRecord) =>
        userRecord.toJSON()
      );
      const emails = records.map((record) => ({
        uid: record.uid,
        email: record.email,
      }));

      const usersRef = firebaseDb.collection("users");
      const snapshot = await usersRef.get();
      const names = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      const transformedUsers = names.map((user) => ({
        id: user.id,
        firstname: user.data.firstname,
        lastname: user.data.lastname,
      }));

      const emailsNamesWithIds = [];

      for (let i = 0; i < transformedUsers.length; i++) {
        const name = transformedUsers[i];
        let emailObj = null;
        for (let j = 0; j < emails.length; j++) {
          if (emails[j].uid === name.id) {
            emailObj = emails[j];
            break;
          }
        }

        const newEmailsNamesWithIds = {
          ...name,
          email: emailObj ? emailObj.email : null,
        };

        emailsNamesWithIds.push(newEmailsNamesWithIds);
      }

      res.json(emailsNamesWithIds);

      if (listUsersResult.pageToken) {
        listAllUsers(listUsersResult.pageToken);
      }
    } catch (error) {
      console.log("Error listing users:", error);
    }
  };
  listAllUsers();
});

async function deleteUser(id) {
  const userRecord = await getAuth()
    .deleteUser(id)
    .then(() => {
      console.log("Successfully deleted user");
    })
    .catch((error) => {
      console.log("Error deleting user:", error);
    });
  return userRecord;
}

app.delete("/user-list/:uid", (req, res) => {
  const uid = req.params.uid;
  deleteUser(uid);
  res.json(uid);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
