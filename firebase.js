// import admin = require("firebase-admin");
const admin = require("firebase-admin");
const myCredentials = require("./credentials.json");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
admin.initializeApp({
  credential: admin.credential.cert(myCredentials),
});

const db = getFirestore();
const auth = getAuth();
module.exports = { db, auth };
