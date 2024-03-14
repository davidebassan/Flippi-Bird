import { initializeApp } from "firebase/app";
import { ref, getDatabase, query, orderByChild, equalTo, get, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Funzione per salvare lo score di un giocatore su Realtime Database
async function savePlayerScore(score, playerType) {
  try {
    if(score > 0){
      await push(ref(db, 'scores'), {
        score: score,
        playerType: playerType,
        timestamp: new Date().toISOString()
      });
    }
    console.log('Score salvato con successo su Realtime Database.');
  } catch (error) {
    console.error('Errore durante il salvataggio dello score:', error);
  }
}

async function aggregateScoresByPlayerType(playerType) {
  try {
    const scoresRef = ref(db, 'scores');
    const snapshot = await get(scoresRef);

    let totalScore = 0;
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const scoreData = childSnapshot.val();
        if (scoreData.playerType === playerType) {
          totalScore += scoreData.score;
        }
      });
    }
    return totalScore;
  } catch (error) {
  }
}

export { savePlayerScore, aggregateScoresByPlayerType };
