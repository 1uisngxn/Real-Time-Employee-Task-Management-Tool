const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json"); 
// file JSON bạn tải từ Firebase Console (Project Settings > Service accounts > Generate new private key)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
