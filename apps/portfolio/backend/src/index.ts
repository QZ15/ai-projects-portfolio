import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth, db } from './firebaseConfig'; // Import Firebase services

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define a route for "/"
app.get('/', (req, res) => {
  res.send('Server is running with Firebase integration!');
});

// Example additional route
app.get('/users', async (req, res) => {
  try {
    const userList = await auth.listUsers();
    res.status(200).send(userList.users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
