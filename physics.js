import Matter from "matter-js";
import { getPipeSizePosPair } from "./utils/random";
import { Dimensions } from "react-native";
import Obstacle from "./components/Obstacle";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// Definisci la velocità degli ostacoli
let obstacleSpeed = -3; 
let pressGravity = -6
const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let { score } = entities;

    // Gestisci il tocco per far saltare l'uccello
    touches.filter(t => t.type == 'press')
        .forEach(t => {
            Matter.Body.setVelocity(entities.Bird.body, {
                x: 0,
                y: pressGravity
            });
        });

    // Aggiorna il motore di Matter.js
    Matter.Engine.update(engine, time.delta);

    // Controlla gli ostacoli
    for (let index = 1; index <= 2; index++) {
        if (entities[`ObstacleTop${index}`].body.bounds.max.x <= 50 && !entities[`ObstacleTop${index}`].point) {
            entities[`ObstacleTop${index}`].point = true;
            obstacleSpeed -= 0.1
            pressGravity -= 0.1
            dispatch({ type: 'new_point' });
            // Aumenta gradualmente la velocità degli ostacoli ogni volta che viene segnato un punto
        }

        // Riposiziona gli ostacoli quando escono dallo schermo
        if (entities[`ObstacleTop${index}`].body.bounds.max.x <= 0) {
            const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);
            Matter.Body.setPosition(entities[`ObstacleTop${index}`].body, pipeSizePos.pipeTop.pos);
            Matter.Body.setPosition(entities[`ObstacleBottom${index}`].body, pipeSizePos.pipeBottom.pos);
            entities[`ObstacleTop${index}`].point = false;
        }

        // Sposta gli ostacoli in base alla velocità corrente

        Matter.Body.translate(entities[`ObstacleTop${index}`].body, { x: obstacleSpeed, y: 0 });
        Matter.Body.translate(entities[`ObstacleBottom${index}`].body, { x: obstacleSpeed, y: 0 });
    }

    // Gestisci la collisione con l'uccello
    Matter.Events.on(engine, 'collisionStart', (event) => {
        obstacleSpeed = -3;
        pressGravity = -6;
        dispatch({ type: 'game_over' });
    });

    return entities;
};

export default Physics;
