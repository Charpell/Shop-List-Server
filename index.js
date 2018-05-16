const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/items');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});

const getItemsFromDatabase = (res) => {
  let items = [];

  return database.on('value', (snapshot) => {
    snapshot.forEach((item) => {
      items.push({
        id: item.key,
        item: item.val().item
      });
    });   
    res.status(200).json(items);
  }, (error) => {
    res.status(500).json({
      message: `Something went wrong. ${error}`
    })
  })
};

exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    };
    const item = req.body.item;
    database.push({ item });
    getItemsFromDatabase(res)
  });
});

exports.getItems = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(500).json({
        message: 'Not allowed'
      });
    };
    getItemsFromDatabase(res)
  });
});

exports.deleteItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'DELETE') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    const id = req.query.id 
    admin.database().ref(`/items/${id}`).remove()
    getItemsFromDatabase(res)
  })
})
