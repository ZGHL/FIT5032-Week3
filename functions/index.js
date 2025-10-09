/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection('books').get();
      const bookCount = snapshot.size;
      res.status(200).send({ count: bookCount });
    } catch (error) {
      logger.error("Error counting books:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
});

exports.addBook = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                res.status(405).send({ error: 'Method not allowed' });
                return;
            }
            const { isbn, name } = req.body;
            if (!isbn || !name) {
                res.status(400).send({ error: 'ISBN and name are required' });
                return;
            }
            const isbnNumber = Number(isbn);
            if (isNaN(isbnNumber)) {
                res.status(400).send({ error: 'ISBN must be a number' });
                return;
            }
            const bookName = name.toString().toUpperCase();
            const docRef = await admin.firestore().collection('books').add({
                ISBN: isbn,
                name: bookName,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            logger.info(`Book added successfully with ID: ${docRef.id}`);
            res.status(200).send({ 
                success: true, 
                message: 'Book added successfully!',
                bookId: docRef.id,
                book: {
                    ISBN: isbn,
                    name: bookName
                }
            });
        } catch (error) {
            logger.error("Error adding book:", error);
            res.status(500).send({ 
                error: 'Internal Server Error',
                message: error.message 
            });
        }
    });
});

exports.getAllBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection('books').get();
      const books = [];
      
      snapshot.forEach((doc) => {
        books.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      res.status(200).send({
        count: books.length,
        books: books
      });
    } catch (error) {
      logger.error("Error getting all books:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
});


// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
