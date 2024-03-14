import React, { useEffect, useState, useRef } from 'react';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics';
import backgroundImage from './sprites/background.jpeg';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { aggregateScoresByPlayerType, savePlayerScore } from './firebase/firebase';
import '@expo/match-media'
import { useMediaQuery } from 'react-responsive';

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: 'black',
    borderRadius: 5,
    height: 30,
    width: '80%',
    overflow: 'hidden',
  },
  progressBarTommywing: {
    backgroundColor: '#459ede',
  },
  wingScoreStyle: {
    textAlign: 'center',
    fontFamily: 'flappy-font',
    color: '#2e2928',
    marginTop: 6,
    fontSize: 20
  },
  progressBarLetiwing: {
    backgroundColor: '#ff94fd',
  },
  scoreText: {
    fontFamily: 'flappy-font', // Applica il font di Flappy Bird
    color: 'black'
  },
  startButton: {
    backgroundColor: '#73bf2e',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    fontFamily: 'flappy-font'
  },
  choiceBirdButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'flappy-font'
  },
  deviceNotSupported: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'flappy-font'
  },
  editionText: {
    fontSize: 20,
    position: 'absolute',
    top: -40, // Regola l'altezza per ottenere l'effetto di elevazione
    backgroundColor: 'rgba(0,0,0,0.2)', // Colore di sfondo del box
    color: '#993300',
    borderRadius: 40,
    paddingHorizontal: 10, // Padding orizzontale
    paddingVertical: 5, // Padding verticale
    fontFamily: 'flappy-font'
  },
  title: {
    fontFamily: 'flappy-font',
    fontSize: 40,
    marginBottom: 20,
    color: "#546034"
  },
  disableInteraction: {
    userSelect: 'none',
    userDrag: 'none',
  },
});
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [birdType, setBirdType] = useState('TOMMIWING');
  let collisionHandled = false
  const [tommywingScore, setTotalTommywingScore] = useState(0);
  const [letiwingScore, setTotalLetiwingScore] = useState(0);
  const [MAX_SCORE, setMAX_SCORE] = useState(0);
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)',
  });

  const isNotPortrait = useMediaQuery({
    query: '(orientation: landscape)',
  });

  const prevWindowWidth = useRef(Dimensions.get('window').width); 
  const prevWindowHeight = useRef(Dimensions.get('window').height);
  const [isZoomed, setIsZoomed] = useState(false); // Aggiunto stato locale per tracciare lo zoom

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFont();
        await Promise.all([loadFont()]);
        setFontLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const tommywingScore = await aggregateScoresByPlayerType('TOMMIWING');
      const letiwingScore = await aggregateScoresByPlayerType('LETIWING');

      setTotalTommywingScore(tommywingScore);
      setTotalLetiwingScore(letiwingScore);
      setMAX_SCORE(tommywingScore + letiwingScore);
    }

    fetchData();
  }, [running]);

  useEffect(() => {
    const handleZoom = () => {
      setIsZoomed(true); // Imposta lo stato dello zoom su true quando viene rilevato uno zoom
    };

    Dimensions.addEventListener('change', handleZoom); // Aggiungi un listener per rilevare i cambiamenti nelle dimensioni della finestra

    return () => {
      Dimensions.removeEventListener('change', handleZoom); // Rimuovi il listener quando il componente viene smontato
    };
  }, []);

  const loadFont = async () => {
    await Font.loadAsync({
      'flappy-font': require('./assets/fonts/flappy-font.ttf'),
    });
  };

  const handleGameOver = () => {
    if (!collisionHandled) {
      collisionHandled = true;
      setRunning(false);
      gameEngine.stop();
      savePlayerScore(currentPoints, birdType);
      setCurrentPoints(0);
    }
  };

  if (!fontLoaded || !appIsReady) {
    return null;
  }

  if (isDesktopOrLaptop || isNotPortrait) { 
    return (
      <View style={[{alignContent:'center'}]}>
        <Text style={[styles.deviceNotSupported, {alignContent:'center'}]}>Solo su mobile e in verticale</Text>
      </View>
    );
  }

  if(isZoomed){
    return (
      <View style={[{alignContent:'center'}]}>
        <Text style={[styles.deviceNotSupported, {alignContent:'center'}]}>Zoom non consentito, ricaricare la pagina.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.disableInteraction, { flex: 1 , fontFamily:'flappy-font'}]}>
      <ImageBackground source={backgroundImage} resizeMode='cover' style={{ flex: 1, zIndex: -200 }}>
        <Text style={[styles.scoreText, { textAlign: 'center', fontSize: 70, top: 100 }]}>
          {currentPoints}
        </Text>
        <GameEngine
          ref={(ref) => { setGameEngine(ref) }}
          systems={[Physics]}
          entities={entities(null, birdType)}
          running={running}
          onEvent={(e) => {
            switch (e.type) {
              case 'game_over':
                handleGameOver();
                break;
              case 'new_point':
                setCurrentPoints(currentPoints + 1);
                break;
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <StatusBar style="auto" hidden={true} />
        </GameEngine>
        {!running &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <Text style={styles.title}>Flappy Bird</Text>
            <View style={[styles.editionTextContainer, { top: -50 }]}>
              <Text style={styles.editionText}>Sposi Edition</Text>
            </View>
            <TouchableOpacity style={styles.startButton}
              onPress={() => {
                setRunning(true);
                gameEngine.swap(entities(null, birdType));
                collisionHandled = false;
              }}>
              <Text style={[styles.startButtonText]}>
                Inizia a giocare
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.choiceBirdButton, { marginRight: 10, backgroundColor: '#459ede' }]}
                onPress={() => {
                  setBirdType('TOMMIWING');
                  gameEngine.swap(entities(null, 'TOMMIWING'));
                }}
              >
                <Text style={[styles.startButtonText, { fontSize: 20 }]}>TEAM TOMMI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.choiceBirdButton, { backgroundColor: '#ff94fd' }]}
                onPress={() => {
                  setBirdType('LETIWING');
                  gameEngine.swap(entities(null, 'LETIWING'));
                }}
              >
                <Text style={[styles.startButtonText, { fontSize: 20 }]}>TEAM LETI</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarTommywing, { width: `${(tommywingScore / MAX_SCORE) * 100}%` }]}>
                <Text style={[styles.wingScoreStyle]}>{tommywingScore}</Text>
              </View>
              <View style={[styles.progressBarLetiwing, { width: `${(letiwingScore / MAX_SCORE) * 100}%` }]}>
                <Text style={[styles.wingScoreStyle]}>{letiwingScore}</Text>
              </View>
            </View>
          </View>
        }
      </ImageBackground>
    </View>
  );
}