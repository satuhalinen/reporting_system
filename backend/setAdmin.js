// file for setting admin privileges to a user (run: "node setAdmin.js uid")

const { getAuth } = require("firebase-admin/auth");
const { initializeApp, cert } = require("firebase-admin/app");

const serviceAccount = require("./serviceAccountKey.json");
initializeApp({
  credential: cert(serviceAccount),
});

async function setAdmin(id) {
  const userRecord = await getAuth().setCustomUserClaims(id, { admin: true });
  return userRecord;
}

const args = process.argv.slice(2);
const id = args[0];

if (!id) {
  console.error("Please provide a user ID.");
  process.exit(1);
}

setAdmin(id)
  .then(() => {
    console.log(`User ${id} has been granted admin privileges.`);
  })
  .catch((error) => {
    console.error("Error setting admin privileges:", error);
  });
