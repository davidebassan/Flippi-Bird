import Matter from 'matter-js'
import React from 'react'
import { Image } from 'react-native'

const Bird = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody/2
    const yBody = props.body.position.y - heightBody/2

    let source;
    if (props.source === 'TOMMIWING') {
        source = require('../sprites/TOMMIWING.png');
    } else if (props.source === 'LETIWING') {
        source = require('../sprites/LETIWING.png');
    } else {
        // Fallback se il tipo di sprite non è definito correttamente
        source = require('../sprites/land.png');
    }
    return (
        <Image
            source={source} // Assicurati che il percorso sia corretto
            style={{
                position: 'absolute',
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody,
            }}
        />
    )
}

export default (world, pos, size, source) => {
    const initialBird = Matter.Bodies.rectangle(
        pos.x, pos.y, size.width, size.height, {label: 'Bird'}, source
    )
    Matter.World.add(world, initialBird)

    return {
        body: initialBird,
        pos,
        source,
        renderer: <Bird source={source}/>
    }
}
