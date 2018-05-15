const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

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
    if(req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    console.log(req.query)
  
    const item = req.query.item

    database.push({ item });

    let items = [];

    return database.on('value', (snapshot) => {
      snapshot.forEach((item) => {
        items.push({
          id: item.key,
          items: item.val().item
        });
      });
      
      res.status(200).json(items)
    }, (error) => {
      res.status(500).json({
        message: `Something went wrong. ${error}`
      })
    })
  })
})