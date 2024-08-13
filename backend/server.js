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

app.get("/working-hours", validateToken, (req, res) => {
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

app.get(
  "/monthly-working-hours/:endYear/:years_back",
  validateToken,
  async (req, res) => {
    const uid = req.user.uid;
    const userRecord = await getAuth().getUser(uid);
    try {
      if (userRecord.customClaims["Kaikki tunnit"]) {
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
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get(
  "/billability-working-hours/:endYear/:years_back",
  validateToken,
  async (req, res) => {
    const uid = req.user.uid;
    const userRecord = await getAuth().getUser(uid);
    try {
      if (userRecord.customClaims["Laskutettavat tunnit"]) {
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
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get("/salary", validateToken, async (req, res) => {
  const uid = req.user.uid;
  const userRecord = await getAuth().getUser(uid);
  try {
    if (userRecord.customClaims["Palkka"]) {
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
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/salary_report/:selected_date", validateToken, async (req, res) => {
  const selectedDate = req.params.selected_date;
  const uid = req.user.uid;
  const userRecord = await getAuth().getUser(uid);
  try {
    if (userRecord.customClaims["Palkka"]) {
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
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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

app.post("/users", validateToken, (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
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

app.get("/users", validateToken, (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const listAllUsers = async (nextPageToken) => {
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
  };
  listAllUsers();
});

async function deleteAuthUser(id) {
  const userRecord = await getAuth().deleteUser(id);
  return userRecord;
}

async function deleteDatabaseUser(id) {
  const res = await firebaseDb.collection("users").doc(id).delete();
  return res;
}

app.delete("/users/:id", validateToken, (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;
  deleteAuthUser(id);
  deleteDatabaseUser(id);
  res.json(id);
});

app.get("/users/:id", validateToken, async (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id;

  async function getNames(id) {
    const nameRef = firebaseDb.collection("users").doc(id);
    const doc = await nameRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      return doc.data();
    }
  }

  async function getEmail(id) {
    try {
      const userRecord = await getAuth().getUser(id);
      return userRecord.email;
    } catch (error) {
      console.log("Error fetching user data:", error);
      return null;
    }
  }
  const email = await getEmail(id);
  const names = await getNames(id);
  const data = { ...names, email };
  res.json(data);
});

app.post("/users/:id", validateToken, (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const uid = req.params.id;
  const email = req.body.email;
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;

  async function modifyUser(email, lastname, firstname) {
    const userRecord = await getAuth().updateUser(uid, {
      email: email,
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

  modifyUser(email, lastname, firstname)
    .then(() => {
      res.status(201).json({ message: "Käyttäjää muokattu!" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Virhe!" });
    });
});

app.post("/users/:id/change-password", validateToken, (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const uid = req.params.id;
  const password = req.body.password;

  async function changePassword(password) {
    const userRecord = await getAuth().updateUser(uid, {
      password: password,
    });
    return { userRecord };
  }

  changePassword(password)
    .then(() => {
      res.status(201).json({ message: "Käyttäjän salasana tallennettu" });
    })
    .catch(() => {
      res.status(500).json({ message: "Virhe!" });
    });
});

async function validateToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
app.post("/users/:id/permissions", validateToken, async (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uid = req.params.id;
  const userRecord = await getAuth().getUser(req.user.uid);
  const checkboxes = req.body.checkboxes;
  const reports = [
    "Kaikki tunnit kumulatiivinen",
    "Kaikki tunnit",
    "Laskutettavat tunnit",
    "Palkka",
  ];
  const customClaimsReports = {};
  let customClaims = {};
  reports.forEach((item) => {
    if (checkboxes.includes(item)) {
      customClaimsReports[item] = true;
    } else {
      customClaimsReports[item] = false;
    }
  });

  if (userRecord.customClaims.admin) {
    const adminClaims = userRecord.customClaims;
    customClaims = { ...adminClaims, ...customClaimsReports };
  } else {
    customClaims = { ...customClaimsReports };
  }

  await getAuth().setCustomUserClaims(uid, customClaims);
  res.status(201).json({ message: "Käyttäjän käyttöoikeudet tallennettu" });
});

app.get("/users/:id/permissions", validateToken, async (req, res) => {
  if (req.user.admin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const uid = req.params.id;
  const userRecord = await getAuth().getUser(uid);
  const customClaims = userRecord.customClaims;
  res.json(customClaims);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
