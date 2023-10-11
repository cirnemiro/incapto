import { NextRequest, NextResponse } from "next/server";

interface ICoordinates {
  position:number[],
  direction:string
}

const moveRobot = (commands:string) => {
  let coordinates:ICoordinates = {
    position: [0,0],
    direction: "N"
  }

  for (let index = 0; index < commands.length ; index++) {

    switch (commands[index]) {
      case "M":
        coordinates = move(coordinates)
        break;
      case "L":
      case "R":
        coordinates = changeDirection(coordinates,commands[index]);
        break;
      default:
        NextResponse.json({ error: 'invalid direction' }, { status: 400 })
        break;
    }
  }
  return coordinates
}

const move = (coordinates:ICoordinates) => {

  switch (coordinates.direction) {
    case "N":
      if (coordinates.position[1] === 10) {
        coordinates.position[1] = 0
        return coordinates
      }
      coordinates.position[1] = coordinates.position[1] + 1
      return coordinates
    case "S":
      if (coordinates.position[1] === 0) {
        coordinates.position[1] = 10
        return coordinates
      }
      coordinates.position[1] =coordinates.position[1] - 1
      return coordinates
    case "E":
      if (coordinates.position[0] === 10) {
        coordinates.position[0] = 0
        return coordinates
      }
      coordinates.position[0] =coordinates.position[0] + 1
      return coordinates
    case "W":
      if (coordinates.position[0] === 0) {
        coordinates.position[0] = 10
        return coordinates
      }
      coordinates.position[0] =coordinates.position[0] - 1
      return coordinates

    default:
      NextResponse.json({ error: "invalid direction" }, { status: 400 })
      return coordinates
  }
}

const changeDirection = (coordinates:any,newDirection:string) =>{

  switch (newDirection) {
    case "R":
      switch (coordinates.direction) {
        case "N":
          coordinates.direction = "E"
          return coordinates
        case "E":
          coordinates.direction = "S"
          return coordinates
        case "S":
          coordinates.direction = "W"
          return coordinates
        case "W":
          coordinates.direction = "N"
          return coordinates
       
        default:
          break;
      }
      case "L":
        switch (coordinates.direction) {
          case "N":
            coordinates.direction = "W"
            return coordinates
            break;
          case "W":
            coordinates.direction = "S"
            return coordinates
            break;
          case "S":
            coordinates.direction = "E"
            return coordinates
            break;
          case "E":
            coordinates.direction = "N"
            return coordinates
            break;
          default:
            break;
        }
      break;
    
    default:
      NextResponse.json({ error: 'invalid direction' }, { status: 400 })
      return coordinates
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const allowedCharacters : RegExp = /^[MLR]+$/
    const regex = new RegExp(allowedCharacters)

    if (regex.test(body.comands)) {
      moveRobot(body.comands)
      const finalPosition = moveRobot(body.comands)
      return NextResponse.json({ final_position: `${finalPosition.position[0]}:${finalPosition.position[1]}:${finalPosition.direction}` });
    }else{
      return NextResponse.json({ error: 'no commands' }, { status: 400 })
    }


    
  } catch (err) {
    return NextResponse.error();
  }
}