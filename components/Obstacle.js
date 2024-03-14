import Matter from 'matter-js'
import React from 'react'
import { Image, View } from 'react-native'

const Obstacle = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody/2
    const yBody = props.body.position.y - heightBody/2
    const color = props.color;

    return (
        <View
            style={{
                position: 'absolute',
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody,
            }}>
            <Image
                source={props.source}
                style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'stretch',
                }}>
                {/* Qualsiasi contenuto aggiuntivo all'interno di ImageBackground */}
            </Image>
        </View>
    )
}

export default (world, label, color, pos, size, source) => {
    const initialObstacle = Matter.Bodies.rectangle(
        pos.x, pos.y, size.width, size.height, {label, isStatic: true}, source=source
    )
    Matter.World.add(world, initialObstacle)

    return {
        body: initialObstacle,
        color,
        pos,
        source,
        renderer: <Obstacle source={source}/> 
    }
}