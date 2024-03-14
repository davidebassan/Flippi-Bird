import Matter from "matter-js"
import Bird from "../components/Bird";
import Floor from "../components/Floor";
import Obstacle from "../components/Obstacle";
import {Dimensions} from 'react-native'
import { getPipeSizePosPair } from "../utils/random";
import PipeUpImage from '../sprites/PipeUp.png';
import PipeDownImage from '../sprites/PipeDown.png';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


export default (restart, birdType) => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    let engine = Matter.Engine.create({enableSleeping: false})
    let world = engine.world
    world.gravity.y = 0.6;

    const pipeSizePosA = getPipeSizePosPair()
    const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)
    return{
        physics: {engine, world},
        Bird: Bird(world, {x:50, y:300}, {height: 40, width:40}, birdType), // Passa il tipo di sprite
        
        ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size, PipeDownImage),
        ObstacleBottom1: Obstacle(world, 'ObstacleBottom1', 'blue', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size, PipeUpImage),

        ObstacleTop2: Obstacle(world, 'ObstacleTop2', 'red', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size, PipeDownImage),
        ObstacleBottom2: Obstacle(world, 'ObstacleBottom2', 'blue', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size, PipeUpImage),

        Floor: Floor(world, 'green', {x:windowWidth/2, y:windowHeight}, {height: 150, width:windowWidth})
    }
}
