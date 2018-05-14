const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const database = admin.database().ref('/items');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});


exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({
        message: "Not allowed"
      });
    }
    const items = req.query.items || "Unknown";

    database.push({ items });

    let shopItems = [];

    getItemsFromDatabase(res);
  });
});


