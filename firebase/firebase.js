// firebase.js

const savePlayerScore = async (score, playerType) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACK_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score, playerType }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Errore durante il salvataggio dello score:', error);
    }
  };
  
  const aggregateScoresByPlayerType = async (playerType) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACK_URL}/scores/${playerType}`);
      const data = await response.json();
      return data.totalScore;
    } catch (error) {
      console.error('Errore durante il recupero dei punteggi:', error);
      return 0;
    }
  };
  
  export { savePlayerScore, aggregateScoresByPlayerType };
  