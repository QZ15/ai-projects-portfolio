import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('../config/firebaseServiceAccountKey.json')),
  databaseURL: process.env.FIREBASE_DATABASE_URL // Optional, for Realtime Database
});

const db = admin.firestore();  // Firestore instance
const auth = admin.auth();     // Authentication instance

export { admin, db, auth };
