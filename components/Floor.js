import Matter from 'matter-js'
import React from 'react'
import { View, Image } from 'react-native'


const Floor = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody/2
    const yBody = props.body.position.y - heightBody/2
    const color = props.color;

    /*return(
        <View style={{
            backgroundColor: color,
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody
        }}/>
    )
    */
    return(
        <Image 
            source={require('../sprites/land.png')} // Assicurati di avere il percorso corretto per land.png
            style={{
                backgroundColor: color, // Rimuovi questo se non è necessario
                position: 'absolute',
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody
            }}
        />
    )
}

export default (world, color, pos, size) => {
    const initialFloor = Matter.Bodies.rectangle(
        pos.x, pos.y, size.width, size.height, {label: 'Floor', isStatic: true}
    )
    Matter.World.add(world, initialFloor)

    return {
        body: initialFloor,
        color,
        pos,
        renderer: <Floor/> 
    }
}
