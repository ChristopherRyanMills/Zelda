import { useEffect, useRef, useState } from "react"
import worldTilesSrc from './tiles-overworld.png'
import linkSrc from './link.png'
import hudSrc from './pausescreen.png'
import char1Src from './chars.png'
import char2Src from './chars2.png'
import itemmp3 from './sounds/Item.mp3'
import textWav from './sounds/LOZ_Text_Slow.wav'
import enemySrc from './enemies.png'
import slashWav from './sounds/LOZ_Sword_Slash.wav'
import deadWav from './sounds/LOZ_Enemy_Die.wav'
import hitWav from './sounds/LOZ_Enemy_Hit.wav'
import getRupee from './sounds/LOZ_Get_Rupee.wav'
import { GameObject, MapBundle, Maps } from "./Maps"

export const ZeldaGame = () => {
    const canvasRef = useRef(null)
    const fps = 60

    const worldTiles = new Image()
    worldTiles.src = worldTilesSrc

    const link = new Image()
    link.src = linkSrc

    const hud = new Image()
    hud.src = hudSrc

    const char1 = new Image()
    char1.src = char1Src

    const char2 = new Image()
    char2.src = char2Src

    const enemy = new Image()
    enemy.src = enemySrc

    let rightPressed = false
    let upPressed = false
    let leftPressed = false
    let downPressed = false
    let swordEquipped = 0

    let hasSword = false
    let isAttacking = false
    let canAttackAgain = true

    let lastButtonPressed = "up"
    let gO = GameObject()

    const playSound = (src) => {
        let sound = new Audio()
        sound.src = src
        sound.play()
    }

    const keyDownHandler = (evt) => {
        if (evt.keyCode == "37") {
            leftPressed = true
            lastButtonPressed = "left"
        }
        else if(evt.keyCode == "39") {
            rightPressed = true
            lastButtonPressed = "right"
        }
        else if(evt.keyCode == "38") {
            upPressed = true
            lastButtonPressed = "up"
        }
        else if(evt.keyCode == "40") {
            downPressed = true
            lastButtonPressed = "down"
        }
        if(evt.keyCode == "32" && canAttackAgain && hasSword){
            //on spacebar, enter attack state
            isAttacking = true
            currentAnimation = 0
            canAttackAgain = false
            playSound(slashWav)
        }
    }
    const keyUpHandler = (evt) => {
        if (evt.keyCode == "37") {
            leftPressed = false
        }
        else if(evt.keyCode == "39") {
            rightPressed = false
        }
        else if(evt.keyCode == "38") {
            upPressed = false
        }
        else if(evt.keyCode == "40") {
            downPressed = false
        }
    }

    document.addEventListener("keydown", keyDownHandler, false)
    document.addEventListener("keyup", keyUpHandler, false)
    
    let animationCounter = 0
    let currentAnimation = 0
    let animationSpeed = 10

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        //ctx draws on the canvas now
        document.body.style.zoom = "321%"
        let linkX = 116
        let linkY = 135
        let maps = Maps()
        let gameObjects = maps[119].gameobjects
        let gameMap = maps[119].map
        let currentMap = 119
        const portalExists = (x, y) => {
            for(let i = 0; i < gameObjects.length; i++){
                if(gameObjects[i].x == x && gameObjects[i].y == y && gameObjects[i].isPortal){
                    //if there is an object at x,y and it is a portal
                    return true
                }
            }
        }
        const addMapGameObjects = (levelMap, objectArray) => {
            // look through map array and if there is a walkable edge, make transition to next map
            const walkableSpaces = [2,28,18,6,12,14,24,30,34,58,64,70,75,76,77,
                93,94,95,111,112,113,81,82,86,99,100,101,117,118,119,87,88,89,105,
                106,107,123,124,125,126,127,128,129,131,132,133,134,135,137,138,139,
                140,141,143]
    
            for(let i = 4; i < levelMap.length; i++){
    
                for(let j = 0; j < levelMap[0].length; j++){
                    if(i == 4){ //top of the screen
                        if(walkableSpaces.includes(levelMap[i][j])){
                            gO = GameObject()
                            gO.x = j * 16
                            gO.y = 3 * 16
                            gO.width = 16
                            gO.height = 16
                            gO.newMap = currentMap - 16
                            gO.newLinkX = (j * 16) - 16
                            gO.newLinkY = 223
                            gO.isPortal = true
                            //shifts up down is for moving across screens vertically
                            gO.shiftsUpDown = true
                            if(!portalExists(gO.x, gO.y)){ //if portal does not already exist here
                                gameObjects.push(gO)
                            }
                        }
                    }
                    if(i == 14){ //bottom of the screen
                        if(walkableSpaces.includes(levelMap[i][j])){
                            gO = GameObject()
                            gO.x = j * 16
                            gO.y = (i + 1) * 16
                            gO.width = 16
                            gO.height = 16
                            gO.newMap = currentMap + 16
                            gO.newLinkX = (j * 16) + 1
                            gO.newLinkY = 81
                            gO.isPortal = true
                            //shifts up down is for moving across screens vertically
                            gO.shiftsUpDown = true
                            if(!portalExists(gO.x, gO.y)){
                                gameObjects.push(gO)
                            }
                        }
                    }
                    if(j == 0){ //left side of the screen
                        if(walkableSpaces.includes(levelMap[i][j])){
                            gO = GameObject()
                            gO.x = -16
                            gO.y = i * 16
                            gO.width = 16
                            gO.height = 16
                            gO.newMap = currentMap - 1
                            gO.newLinkX = 223
                            gO.newLinkY = (i * 16) - 1
                            gO.isPortal = true
                            //shifts left right is for moving across screens horizontal
                            gO.shiftsLeftRight = true
                            if(!portalExists(gO.x, gO.y)){
                                gameObjects.push(gO)
                            }
                        }
                    }
                    if(j == 15){ //right side of the screen
                        if(walkableSpaces.includes(levelMap[i][j])){
                            gO = GameObject()
                            gO.x = 256
                            gO.y = i * 16
                            gO.width = 16
                            gO.height = 16
                            gO.newMap = currentMap + 1
                            gO.newLinkX = 1
                            gO.newLinkY = (i * 16) - 2
                            gO.isPortal = true
                            //shifts left right is for moving across screens horizontal
                            gO.shiftsLeftRight = true
                            if(!portalExists(gO.x, gO.y)){
                                gameObjects.push(gO)
                            }
                        }
                    }
                }
            }
        }
        addMapGameObjects(gameMap, gameObjects)
        let lasPickUpItem = 0
        let playPickupItemAnimation = false
        let rupeeAmount = 0
        let linkHearts = 3
        let currentLinkHearts = 3
        let keyAmount = 1
        let bombAmount = 5

        //!Game Object (literally everything that isn't link or the map tiles)
        // let map7_7 = [
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 61, 61, 61, 61, 61, 61, 61,  2,  2, 61, 61, 61, 61, 61, 61, 61],
        //     [ 61, 61, 61, 61, 28, 61, 62,  2,  2, 61, 61, 61, 61, 61, 61, 61],
        //     [ 61, 61, 61, 62,  2,  2,  2,  2,  2, 61, 61, 61, 61, 61, 61, 61],
        //     [ 61, 61, 62,  2,  2,  2,  2,  2,  2, 61, 61, 61, 61, 61, 61, 61],
        //     [ 61, 62,  2,  2,  2,  2,  2,  2,  2, 60, 61, 61, 61, 61, 61, 61],
        //     [  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
        //     [ 43, 44,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 43, 43],
        //     [ 61, 61,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 61, 61],
        //     [ 61, 61,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 61, 61],
        //     [ 61, 61, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 61, 61],
        //     [ 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61]]
        //     let objects7_7 = []
    
        //     gO = {
        //         x : 72,
        //         y : 72,
        //         width : 8,
        //         height : 16,
        //         newMap : 1,
        //         newLinkX : 120,
        //         newLinkY : 220,
        //         isPortal : true
        //     }

        //     objects7_7.push(gO)
            
        //     let octorok= GameObject()
        //     octorok.x = 160
        //     octorok.y = 184
        //     octorok.width = 16
        //     octorok.height = 16
        //     octorok.isEnemy = true
        //     octorok.enemyType = 1
        //     objects7_7.push(octorok)


        //     let bundle = MapBundle(map7_7, objects7_7)
        //     maps.push(bundle)
    
        //     //evt.key returns the character pressed on keyboard
        //     //set the states to determine direction link faces
        //     let mapWoodSword = [
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
        //     [ 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55],
        //     [ 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
        //     [ 55, 55, 37, 37, 37, 37, 37, 28, 28, 37, 37, 37, 37, 37, 55, 55],
        //     [ 55, 55, 55, 55, 55, 55, 55, 28, 28, 55, 55, 55, 55, 55, 55, 55]];
        //     let gameObjectsWoodSword = []

        //     gO = GameObject()
        //     gO.x = 72
        //     gO.y = 128
        //     gO.width = 16
        //     gO.height = 16
        //     gO.isFlame = true
        //     gameObjectsWoodSword.push(gO)

        //     gO = GameObject()
        //     gO.x = 168
        //     gO.y = 128
        //     gO.width = 16
        //     gO.height = 16
        //     gO.isFlame = true
        //     gameObjectsWoodSword.push(gO)

        //     gO = GameObject()
        //     gO.x = (7 * 16) + 8
        //     gO.y = 128
        //     gO.width = 16
        //     gO.height = 16
        //     gO.isOldMan = true
        //     gameObjectsWoodSword.push(gO)

        //     gO = GameObject()
        //     gO.x = 124
        //     gO.y = 152
        //     gO.width = 8
        //     gO.height = 16
        //     gO.isPickupItem = true
        //     gO.pickupItemNum = 14
        //     gameObjectsWoodSword.push(gO)

        //     gO = GameObject()
        //     gO.isText = true
        //     gO.line1Full = "IT'S DANGEROUS TO GO"
        //     gO.line2Full = "ALONE! TAKE THIS!"
        //     gO.line1X = 3 * 16
        //     gO.line1Y = 7 * 16
        //     gO.line2X = 4 * 16
        //     gO.line2Y = (8 * 16) - 6
        //     gameObjectsWoodSword.push(gO)

        //     //portals
    
        //     gO = {
        //         x : 112,
        //         y : 240,
        //         width : 16,
        //         height : 16,
        //         newMap : 0,
        //         newLinkX : 68,
        //         newLinkY : 96,
        //         isPortal : true
        //     }
        //     gameObjectsWoodSword.push(gO)
    
        //     gO = {
        //         x : 128,
        //         y : 240,
        //         width : 16,
        //         height : 16,
        //         newMap : 0,
        //         newLinkX : 68,
        //         newLinkY : 96,
        //         isPortal : true
        //     }
        //     gameObjectsWoodSword.push(gO)
    
        //     bundle = MapBundle(mapWoodSword, gameObjectsWoodSword)
        //     maps.push(bundle)
        //     gameMap = maps[0].map
        //     gameObjects = maps[0].gameobjects
        
        const Pos = (row, col) => {
            return {r: row,
            c: col}
        }

        const Node = (parent, position) => {
            return {parent: parent,
                    position: position,
                    g: 0, //cost (distance) from current node to start (real)
                    h: 0, // cost from current node to final node 
                    f: 0  // actual cost (total + estimate)
                }
        }

        // using A* search method from https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2

        const aStar = (start, end, maze) => {
            const startNode = Node(null, start) //start is the OG parent for everything
            let endNode = Node(null, end)
            let openList = [] //all nodes you can get to from current position
            let closedList = [] // nodes already checked

            openList.push(startNode)
            while(openList.length > 0){
                //while we have moves available
                let currentNode = openList[0]
                let currentIndex = 0
                for(let i = 0; i < openList.length; i++){
                    if(openList[i].f < currentNode.f) {
                        //this is just the distance checker you used in the paint app
                        currentNode = openList[i]
                        currentIndex = i
                    }
                }
                openList.splice(currentIndex, 1)
                closedList.push(currentNode)
                if(currentNode.position.r === endNode.position.r && currentNode.position.c === endNode.position.c){
                    //found the target, current node matches end node, return path
                    let path = []
                    let current = currentNode
                    while(current != null){
                        // work from the end of the maze, keep daisy chaining call parents of each node
                        path.push(current.position)
                        current = current.parent
                    }
                    return path
                }
                let children = []
                let positions = [Pos(0, -1), Pos(0, 1), Pos(1, 0), Pos(-1, 0)] //adjacent positions to current tile, up down left and right
                for(let i = 0; i < positions.length; i++){
                    let nodePosition = Pos(currentNode.position.r + positions[i].r, currentNode.position.c + positions[i].c)
                    if(nodePosition.r > (maze.length - 1) || nodePosition.r < 0 || 
                    nodePosition.c > (maze[0].length - 1) || nodePosition.c < 0){
                        //these are bad positions, don't keep them
                        continue
                    }
                    if(maze[nodePosition.r][nodePosition.c] != 2){
                        //if the position is not a 2 on the map, get rid of it
                        continue
                    }
                    let newNode = Node(currentNode, nodePosition)
                    children.push(newNode)
                }

                for (let i = 0; i < children.length; i++){
                    for(let j = 0; j < closedList.length; j++){
                        if(children[i].position.r === closedList[j].position.r &&
                            children[i].position.c === closedList[j].position.c ){
                                //checking to see if the child is in the closed list of children, if so it is not the shortest distance
                                continue
                            }
                    }
                    children[i].g = currentNode.g + 1 //adding a tile adds 1 to cost
                    children[i].h = ((children[i].position.r - endNode.position.r) * (children[i].position.r - endNode.position.r)) + ((children[i].position.c - endNode.position.c) * (children[i].position.c - endNode.position.c))
                    children[i].f = children[i].g + children[i].h

                    for (let j = 0; j < openList.length; j++){
                        //if child is on open list, keep going
                        if(children[i].position.r === openList[j].position.r &&
                            children[i].position.c === openList[j].position.c && 
                            children[i].g > openList[j].g){
                                continue
                            }
                    }

                    openList.push(children[i])
                }
            }
        }

        const getNewCoordinates = (currentRow, currentCol, index) => {
            let randRow = Math.floor(Math.random() * 11) + 4 //get row in map from 4-15 (top 4 rows are the HUD)
            let randCol = Math.floor(Math.random() * 15) //all columns can be occupied
            while(gameMap[randRow][randCol] != 2){
                // if not 2, it cannot traverse to it, choose another
                randRow = Math.floor(Math.random() * 11) + 4
                randCol = Math.floor(Math.random() * 15)
            }

            gameObjects[index].enemyPath = aStar(Pos(currentRow, currentCol), Pos(randRow, randCol), gameMap)

            while(gameObjects[index].enemyPath === 0){
                randRow = Math.floor(Math.random() * 11) + 4
                randCol = Math.floor(Math.random() * 15)
                gameObjects[index].enemyPath = aStar(Pos(currentRow, currentCol), Pos(randRow, randCol), gameMap)
            }
        }

        const drawMap = (level) => {
            for(let i = 0; i < level.length; i++)
            {
                for(let j = 0; j < level[i].length; j++)
                {
                    //the world tile image is 18 tiles long
                    // for x and y, find the row and column by dividing by 18
                    // zelda sprites are 16 x 16
                    //j * 16 and i * 16 tell how wide the tiles should be
                    ctx.drawImage(worldTiles, ((level[i][j]%18) * 17) + 1,
                    (Math.floor(level[i][j]/18) * 17) + 1,
                    16, 16, j * 16, i * 16, 16, 16)
                }
            }
        }

        const collision = (x, y ,map) => {
            for(let i = 0; i < map.length; i++)
            //x and y are the representation of where Link should be
            {
                for(let j = 0; j < map[i].length; j++)
                {
                    //tile number 2 on the map is the only one I want to walk on now
                    if(map[i][j] != 2 && map[i][j] != 28) {
                        //
                        if( x <= j*16 + 16 && 
                            x + 12 >= j*16 && 
                            y +10 <= i*16 + 16 &&
                            y + 16 >= i*16) {
                                return true
                            }
                        
                    }
                    else {return false}
                }
                
            }
        }

        const getBounceLoc = (gObject, ignoresObjects, direction) => {

            //enemy bounce 1 tile in the direction link is facing
            let currRow = Math.floor(gObject.y/16)
            let currCol = Math.floor(gObject.x/16)

            if(direction == "up") {
                if(gameMap[currRow - 1][currCol] == 2){
                    gObject.bounceY = gObject.y - 16
                    gObject.bounceX = gObject.x
                }
                else {
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x
                }
            }

            if(direction == "down") {
                if(gameMap[currRow + 1][currCol] == 2){
                    gObject.bounceY = gObject.y + 16
                    gObject.bounceX = gObject.x
                }
                else {
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x
                }
            }

            if(direction == "left") {
                if(gameMap[currRow][currCol - 1] == 2){
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x - 16
                }
                else {
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x
                }
            }

            if(direction == "right") {
                if(gameMap[currRow][currCol + 1] == 2){
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x + 16
                }
                else {
                    gObject.bounceY = gObject.y
                    gObject.bounceX = gObject.x
                }
            }
        }

        const gameObjectCollision = (x, y, objects, isLink, isSword) => {
            if (isLink) {
                for(let i = 0; i<objects.length; i++){
                    if(x <= objects[i].x + objects[i].width &&
                        x + 16 >= objects[i].x &&
                        y <= objects[i].y + objects[i].height &&
                        y + 16 >= objects[i].y){
                            if (objects[i].isPortal) {
                                gameMap = maps[objects[i].newMap].map
                                gameObjects = maps[objects[i].newMap].gameobjects
                                currentMap = objects[i].newMap
                                addMapGameObjects(gameMap, gameObjects)
                                
                                if(objects[i].shiftsLeftRight){
                                    linkX = objects[i].newLinkX
                                }
                                else if(objects[i].shiftsUpDown){
                                    linkY = objects[i].newLinkY
                                }
                                else {
                                    linkX = objects[i].newLinkX
                                    linkY = objects[i].newLinkY
                                }
                                continue
                            }

                            else if(objects[i].isRupee){
                                rupeeAmount += objects[i].rupeeValue
                                objects.splice(i, 1)
                                playSound(getRupee)
                            }

                            else if(objects[i].isPickupItem){
                                playPickupItemAnimation = true
                            switch(gameObjects[i].pickupItemNum){
                                case 0: 
                                    break
                                case 1: 
                                    break
                                case 2: 
                                    break
                                case 3: 
                                    break
                                case 4: 
                                    break
                                case 5: 
                                    break
                                case 6: 
                                    break
                                case 7: 
                                    break
                                case 8: 
                                    break
                                case 9: 
                                    break
                                case 10: 
                                    break
                                case 11: 
                                    break
                                case 12: 
                                    break
                                case 13: 
                                    break
                                case 14: 
                                    lasPickUpItem = 14
                                    swordEquipped = 1
                                    hasSword = true
                                    playSound(itemmp3)
                                    break
        
                                }
                                objects.splice(i, 1)
                                animationCounter = 0
                            }
                        }
                }
            }
            else {
                //sword hit box, flipped if facing up or down
                let swordW = 11
                let swordH = 3
                if(lastButtonPressed == "up" || lastButtonPressed == "down"){
                    swordW = 3
                    swordH = 11
                }

                for(let i=0; i < objects.length; i++){
                    //test hitbox for sword
                        if(x <= objects[i].x + objects[i].width &&
                            x + swordW >= objects[i].x &&
                            y <= objects[i].y + objects[i].height &&
                            y + swordH >= objects[i].y){
                                //now you are colliding, if enemy, remove health
                                if(objects[i].isEnemy){
                                    objects[i].needsBounce = true
                                    getBounceLoc(objects[i], false, lastButtonPressed)
                                    objects[i].health -= 1
                                    if(objects[i].health <= 0){
                                        //if 0 health, enemy become dead
                                        playSound(deadWav)
                                    }
                                    else{
                                        // play hit confirm sound
                                        playSound(hitWav)
                                    }
                                }
                            }
                }
            }
        }

        const drawGameObjects = () => {
            for(let i=0; i<gameObjects.length; i++){
                if(gameObjects[i].isPickupItem){
                    //0 - boomerang
                    //1 - bomb
                    //2 - bow
                    //3 - candle
                    //4 - flute
                    //5 - meat
                    //6 - potion
                    //7 - magic rod
                    //8 - raft
                    //9 - magic book
                    //10 - ring
                    //11 - ladder
                    //12 - key
                    //13 - bracelet
                    //14 - wood sword

                    switch(gameObjects[i].pickupItemNum){
                        case 0: 
                            break
                        case 1: 
                            break
                        case 2: 
                            break
                        case 3: 
                            break
                        case 4: 
                            break
                        case 5: 
                            break
                        case 6: 
                            break
                        case 7: 
                            break
                        case 8: 
                            break
                        case 9: 
                            break
                        case 10: 
                            break
                        case 11: 
                            break
                        case 12: 
                            break
                        case 13: 
                            break
                        case 14: 
                            ctx.drawImage(hud, 555, 137, 8, 16, gameObjects[i].x, gameObjects[i].y, 8, 16)
                            break

                    }

                }
                if(gameObjects[i].isText) {
                    gameObjects[i].counter += 1
                    if(gameObjects[i].counter%5 == 0){
                        if(gameObjects[i].line1Full.length != gameObjects[i].line1Current.length){
                            gameObjects[i].line1Current = gameObjects[i].line1Full.substring(0, gameObjects[i].line1Current.length + 1)
                            playSound(textWav)
                        }
                        else if(gameObjects[i].line2Full.length != gameObjects[i].line2Current.length){
                            gameObjects[i].line2Current = gameObjects[i].line2Full.substring(0, gameObjects[i].line2Current.length + 1)
                            playSound(textWav)
                        }
                    }

                    ctx.fillStyle = "white"
                    ctx.font = "12px Arial"
                    ctx.fillText(gameObjects[i].line1Current, gameObjects[i].line1X, gameObjects[i].line1Y)
                    ctx.fillText(gameObjects[i].line2Current, gameObjects[i].line2X, gameObjects[i].line2Y)
                }
                if(gameObjects[i].isFlame){
                    gameObjects[i].counter++
                    if(gameObjects[i].counter%5 == 0){
                        gameObjects[i].imageNum++
                    }
                    if(gameObjects[i].imageNum > 1){
                        gameObjects[i].imageNum = 0
                    }
                    if(gameObjects[i].imageNum == 0){
                        ctx.drawImage(char2, 158, 11, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)   
                    }
                    if(gameObjects[i].imageNum == 1){
                        ctx.drawImage(char1, 52, 11, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)   
                    }
                }
                if(gameObjects[i].isOldMan){
                    ctx.drawImage(char1, 1, 11, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                }
                if(gameObjects[i].isOldWoman){
                    ctx.drawImage(char1, 35, 11, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                }
                //draw enemies
                if(gameObjects[i].isEnemy){
                    //type 1 = octoroks
                    if(gameObjects[i].enemyType == 1){
                        gameObjects[i].counter++

                        //using A* pathfinding from python scripts
                        if(gameObjects[i].enemyPath == null || gameObjects[i].enemyPath.length === 0){
                            //once we get to our destination, make a new destination to go to
                            //get current coordinate and check if new coordinate is reachable
                            let currRow = Math.floor(gameObjects[i].y/16)
                            let currCol = Math.floor(gameObjects[i].x/16)
                            getNewCoordinates(currRow, currCol, i)
                        }
                        if(gameObjects[i].needsToShoot) {
                            gameObjects[i].shootCounter++
                            if (gameObjects[i].shootCounter === 100){
                                //enemies sit for a while before they shoot
                                projectile = GameObject()
                                projectile.x = gameObjects[i].x
                                projectile.y = gameObjects[i].y
                                if(gameObjects[i].direction === "down"){
                                    projectile.ySpeed = 2
                                }
                                if(gameObjects[i].direction === "up"){
                                    projectile.ySpeed = -2
                                }
                                if(gameObjects[i].direction === "right"){
                                    projectile.xSpeed = 2
                                }
                                if(gameObjects[i].direction === "left"){
                                    projectile.xSpeed = -2
                                }
                                projectile.waterProjectile = false
                                projectile.isPortal = false
                                projectile.isRupee = false
                                projectile.rockProjectile = true
                                gameObjects.push(projectile)
                            }
                            if(gameObjects[i].shootCounter > 130){
                                gameObjects[i].needsToShoot = false
                                gameObjects[i].shootCounter = 0
                            }
                        }
                        else {
                            if(gameObjects[i].enemyPath[gameObjects[i].enemyPath.length - 1] != null &&
                                gameObjects[i].nextX === gameObjects[i].x && gameObjects[i].nextY === gameObjects[i].y){
                                //if current position in enemy path is not null
                                gameObjects[i].nextX = gameObjects[i].enemyPath[gameObjects[i].enemyPath.length - 1].c * 16
                                gameObjects[i].nextY = gameObjects[i].enemyPath[gameObjects[i].enemyPath.length - 1].r * 16
                                gameObjects[i].enemyPath.splice(gameObjects[i].enemyPath.length - 1, 1)

                                let chance = Math.floor(Math.random() * 60)
                                if (chance === 0){
                                    gameObjects[i].needsToShoot = true
                                }
                            }
                        }
                        if(gameObjects[i].counter >= 10){
                            gameObjects[i].frame++
                            gameObjects[i].counter = 0
                            if(gameObjects[i].frame > 1){
                                gameObjects[i].frame = 0
                            }
                        }
                        if(gameObjects[i].direction == "down"){
                            if(gameObjects[i].frame == 0){
                                ctx.drawImage(enemy, 0, 0, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                            if(gameObjects[i].frame == 1){
                                ctx.drawImage(enemy, 0, 30, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                        }
                        else if(gameObjects[i].direction == "up"){
                            if(gameObjects[i].frame == 0){
                                ctx.drawImage(enemy, 60, 0, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                            if(gameObjects[i].frame == 1){
                                ctx.drawImage(enemy, 60, 30, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                        }
                        else if(gameObjects[i].direction == "left"){
                            if(gameObjects[i].frame == 0){
                                ctx.drawImage(enemy, 30, 0, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                            if(gameObjects[i].frame == 1){
                                ctx.drawImage(enemy, 30, 30, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                        }
                        else {
                            if(gameObjects[i].frame == 0){
                                ctx.drawImage(enemy, 90, 0, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                            if(gameObjects[i].frame == 1){
                                ctx.drawImage(enemy, 90, 30, 16, 16, gameObjects[i].x, gameObjects[i].y, 16, 16)
                            }
                        }

                        if(gameObjects[i].needsBounce){
                            if(gameObjects[i].x != gameObjects[i].bounceX){
                                if(gameObjects[i].bounceX > gameObjects[i].x){
                                    gameObjects[i].x += 4
                                }
                                else {
                                    gameObjects[i].x -= 4
                                }
                            }
                            if(gameObjects[i].y != gameObjects[i].bounceY){
                                if(gameObjects[i].bounceY > gameObjects[i].y){
                                    gameObjects[i].y += 4
                                }
                                else {
                                    gameObjects[i].y -= 4
                                }
                            }
                            else {
                                gameObjects[i].needsBounce = false
                                //item drops
                                if(gameObjects[i].health <= 0) {
                                    let rupeeChance = Math.floor(Math.random()*10)
                                    if(rupeeChance < 10) {
                                        let rupeeObject = GameObject()
                                        rupeeObject.x = gameObjects[i].x + 4
                                        rupeeObject.y = gameObjects[i].y
                                        rupeeObject.width = 8
                                        rupeeObject.height = 16
                                        rupeeObject.isRupee = true
                                        rupeeObject.rupeeImage = 0
                                        let rupeeValueChance = Math.floor(Math.random()*10)
                                        if(rupeeValueChance < 2){
                                            rupeeObject.rupeeValue = 5
                                        }
                                        else {
                                            rupeeObject.rupeeValue = 1
                                        }
                                        gameObjects.push(rupeeObject)
                                        gameObjects.splice(i, 1)
                                    }
                                }
                            }
                        }
                        else if(gameObjects[i].enemyPath.length != 0){
                            if(gameObjects[i].x != gameObjects[i].nextX){
                                //if current x != X we are going to, figure out if it is less than or more than current
                                if(gameObjects[i].nextX > gameObjects[i].x){
                                    if(gameObjects[i].counter % gameObjects[i].speed === 0){
                                        gameObjects[i].x += 2
                                        gameObjects[i].direction = "right"
                                    }
                                }
                                else if(gameObjects[i].nextX < gameObjects[i].x){
                                    if(gameObjects[i].counter % gameObjects[i].speed === 0){
                                        gameObjects[i].x -= 2
                                        gameObjects[i].direction = "left"
                                    }
                                }
                            }
                            else if(gameObjects[i].y != gameObjects[i].nextY){
                                //if current x != X we are going to, figure out if it is less than or more than current
                                if(gameObjects[i].nextY > gameObjects[i].y){
                                    if(gameObjects[i].counter % gameObjects[i].speed === 0){
                                        gameObjects[i].y += 2
                                        gameObjects[i].direction = "down"
                                    }
                                }
                                else if(gameObjects[i].nextY < gameObjects[i].y){
                                    if(gameObjects[i].counter % gameObjects[i].speed === 0){
                                        gameObjects[i].y -= 2
                                        gameObjects[i].direction = "up"
                                    }
                                }
                            }
                            else if(gameObjects[i].enemyPath.length === 1){
                                //get rid of current path and set x to next x
                                gameObjects[i].enemyPath = []
                                gameObjects[i].x = gameObjects[i].nextX
                                gameObjects[i].y = gameObjects[i].nextY
                            }
                        }
                    }
                }
                if(gameObjects[i].isRupee) {
                    //the 1 rupee alternates between 2 colors, the 5 is solid
                    if(gameObjects[i].rupeeValue == 1){
                        gameObjects[i].counter++
                        if(gameObjects[i].counter % 5 == 0){
                            gameObjects[i].rupeeImage += 1
                        }
                        if(gameObjects[i].rupeeImage > 1){
                            gameObjects[i].rupeeImage = 0
                        }
                        //draw the two rupee images
                        if(gameObjects[i].rupeeImage == 0){
                            ctx.drawImage(link, 244, 225, 8, 16, gameObjects[i].x, gameObjects[i].y, 8, 16)

                        }
                        else{
                            ctx.drawImage(link, 274, 225, 8, 16, gameObjects[i].x, gameObjects[i].y, 8, 16)
                        }
                    }

                    else {
                        ctx.drawImage(link, 274, 225, 8, 16, gameObjects[i].x, gameObjects[i].y, 8, 16)
                    }
                }
            }
        }

        const drawHUD = () => {
            ctx.drawImage(hud, 258, 11, 256, 56, 0 ,0, 256, 56)

            ctx.fillStyle = "black"
            ctx.fillRect(176, 32, 64, 16)

            let fullHearts = Math.floor(currentLinkHearts)
            let halfHearts = currentLinkHearts - fullHearts

            for(let i = 0; i < linkHearts; i++){
                let heartY = 40
                //setting each heart x value on hud to be 8 pixels after the previous
                let heartX = 176 + (i * 8)
                //link has 8 hearts on a line, move other hearts up 8 px
                if(i > 7 ){
                    heartY = 40 - 8
                    heartX -= 64
                }
                //draw empty hearts
                ctx.drawImage(hud, 627, 117, 8, 8, heartX, heartY, 8, 8)
            }
            let halfHeartX = 0
            let halfHeartY = 0
            for(let i = 0; i < fullHearts; i++){
                let heartY = 40
                let heartX = 176 + (i * 8)
                if(i > 7 ){
                    heartY = 40 - 8
                    heartX -= 64
                }
                ctx.drawImage(hud, 645, 117, 8, 8, heartX, heartY, 8, 8)
                if(i == fullHearts - 1){
                    //at end of loop
                    if(i > 6){
                        halfHeartY = 40 - 8
                        halfHeartX = 176 + ((i%7) * 8)
                    }
                    else {
                        halfHeartY = 40
                        halfHeartX = 176 + (i * 8) + 8
                    }
                }
            }
            if(halfHearts > 0 && fullHearts >= 1){
                //drawing half hearts
                ctx.drawImage(hud, 636, 117, 8, 8, halfHeartX, halfHeartY, 8, 8)
            }
            else if(halfHearts > 0 && fullHearts == 0){

                ctx.drawImage(hud, 636, 117, 8, 8, 176, 40, 8, 8)
            }

            ctx.fillStyle = "black"
            ctx.fillRect(96, 10, 24, 50)
            //draw ruppee count
            if(rupeeAmount < 100){
                ctx.drawImage(hud, 519, 117, 8, 8, 96, 16, 8, 8)
                //get the ones place and draw it first
                let onesNum = rupeeAmount % 10
                //sprite sheet, sprite sheet has the numbers on it all 8 px from each other
                //use the remainder as the ones place and count over to the start of the numbers
                //0 is the first number in this line
                ctx.drawImage(hud, 528 + (8 * onesNum) + onesNum, 117, 8, 8, 96 + 16, 16, 8, 8)
                //now do the same for the 10's place
                let tensNum = Math.floor(rupeeAmount / 10)
                ctx.drawImage(hud, 528 + (8 * tensNum) + tensNum, 117, 8, 8, 96 + 8, 16, 8, 8)
            }
            else {
                let onesNum = rupeeAmount % 10
                ctx.drawImage(hud, 528 + (8 * onesNum) + onesNum, 117, 8, 8, 96 + 16, 16, 8, 8)
                let hundredsNum = Math.floor(rupeeAmount / 100) * 100
                let tensNum = ((rupeeAmount - hundredsNum) - onesNum) / 10
                ctx.drawImage(hud, 528 + (8 * tensNum) + tensNum, 117, 8, 8, 96 + 8, 16, 8, 8)
                hundredsNum = Math.floor(rupeeAmount / 100)
                ctx.drawImage(hud, 528 + (8 * hundredsNum) + hundredsNum, 117, 8, 8, 96, 16, 8, 8)
            }
            //bombs and key draw
            ctx.drawImage(hud, 519, 117, 8, 8, 96, 32, 8, 8)
            ctx.drawImage(hud, 519, 117, 8, 8, 96, 41, 8, 8)
            ctx.drawImage(hud, 528 + (8 * keyAmount) + keyAmount, 117, 8, 8, 96 + 8, 32, 8, 8)
            ctx.drawImage(hud, 528 + (8 * bombAmount) + bombAmount, 117, 8, 8, 96 + 8, 41, 8, 8)

            ctx.fillRect(128, 24, 8, 16)
            ctx.fillRect(152, 24, 8, 16)
            //draw sword in hud
            //wood sword
            if(swordEquipped == 1){
                ctx.drawImage(hud, 555, 137, 8, 16, 152, 24, 8, 16)
            }

            //minimap fill with grey
            ctx.fillStyle = "gray"
            ctx.fillRect(16, 8, 64, 48)
        }

        const drawLink = () => {
            //link movement speed
            let speed = 2
            animationCounter++
            
            if(playPickupItemAnimation){
                if(animationCounter < 150){
                    ctx.drawImage(link, 1, 150, 16, 16, linkX, linkY, 16, 16)
                }
                else{
                    playPickupItemAnimation = false
                }

                switch(lasPickUpItem){
                    case 0: 
                        break
                    case 1: 
                        break
                    case 2: 
                        break
                    case 3: 
                        break
                    case 4: 
                        break
                    case 5: 
                        break
                    case 6: 
                        break
                    case 7: 
                        break
                    case 8: 
                        break
                    case 9: 
                        break
                    case 10: 
                        break
                    case 11: 
                        break
                    case 12: 
                        break
                    case 13: 
                        break
                    case 14: 
                        ctx.drawImage(hud, 555, 137, 8, 16, linkX - 2, linkY - 14, 8, 16)

                        break

                }
            }
            else{
                //attack animations
                if(isAttacking && hasSword){
                    if(currentAnimation == 0){
                        if(lastButtonPressed == "down"){
                            ctx.drawImage(link, 0, 60, 16, 16, linkX, linkY, 16, 16)
                        }
                        if(lastButtonPressed == "up"){
                            ctx.drawImage(link, 62, 60, 16, 16, linkX, linkY, 16, 16)
                        }
                        if(lastButtonPressed == "left"){
                            ctx.drawImage(link, 30, 60, 16, 16, linkX, linkY, 16, 16)
                        }
                        if(lastButtonPressed == "right"){
                            ctx.drawImage(link, 91, 60, 16, 16, linkX, linkY, 16, 16)
                        }
                    }
                    if(currentAnimation == 1){
                        // the sword being bigger makes his image not centered and weird
                        if(lastButtonPressed == "down"){
                            ctx.drawImage(link, 0, 84, 16, 27, linkX, linkY, 16, 27)
                            gameObjectCollision(linkX + 7, linkY + 16, gameObjects, false, true)
                        }
                        if(lastButtonPressed == "up"){
                            ctx.drawImage(link, 62, 84, 16, 26, linkX, linkY - 14, 16, 26)
                            gameObjectCollision(linkX + 3, linkY - 14, gameObjects, false, true)
                        }
                        if(lastButtonPressed == "left"){
                            ctx.drawImage(link, 22, 84, 26, 27, linkX - 10, linkY - 8, 27, 27)
                            gameObjectCollision(linkX - 8, linkY + 5, gameObjects, false, true)
                        }
                        if(lastButtonPressed == "right"){
                            ctx.drawImage(link, 84, 84, 30, 26, linkX, linkY - 8, 30, 26)
                            gameObjectCollision(linkX + 14, linkY + 5, gameObjects, false, true)
                        }
                    }
                    if(animationCounter >= 6){
                        currentAnimation++
                        animationCounter = 0
                        if(currentAnimation > 1){
                            currentAnimation = 0
                            isAttacking = false
                            canAttackAgain = true
                        }
                    }
                }
                else if(leftPressed && !collision(linkX - speed, linkY, gameMap)) {
                    //when left is pressed, move him in speed increment, alternate between 2 frames for link walking
                    //count animation frames, starting link is at 30, 0 on png, other frame is 30, 30
                    //all sprites are 16 x 16 unless he has sword out
                    //draw him at linkX, linkY coordinate (keep 16 x 16)
                    linkX -= speed
                    if (currentAnimation == 0) {
                        ctx.drawImage(link, 30, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (currentAnimation == 1) {
                        ctx.drawImage(link, 30, 30, 16, 16, linkX, linkY, 16, 16)
                    }
                    if (animationCounter >= 6) {
                        //LoZ used 6 frame cycle for link
                        //reset animation counter after cycle to alternate back to standing sprite
                        currentAnimation++
                        animationCounter = 0
                        if (currentAnimation > 1) {
                            currentAnimation = 0
                        }
                    }
                }
                else if(rightPressed && !collision(linkX + speed, linkY, gameMap)) {
    
                    linkX += speed
                    if (currentAnimation == 0) {
                        ctx.drawImage(link, 91, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (currentAnimation == 1) {
                        ctx.drawImage(link, 91, 30, 16, 16, linkX, linkY, 16, 16)
                    }
                    if (animationCounter >= 6) {
                        currentAnimation++
                        animationCounter = 0
                        if (currentAnimation > 1) {
                            currentAnimation = 0
                        }
                    }
                }
                else if(upPressed && !collision(linkX, linkY - speed, gameMap)) {
    
                    linkY -= speed
                    if (currentAnimation == 0) {
                        ctx.drawImage(link, 62, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (currentAnimation == 1) {
                        ctx.drawImage(link, 62, 30, 16, 16, linkX, linkY, 16, 16)
                    }
                    if (animationCounter >= 6) {
                        currentAnimation++
                        animationCounter = 0
                        if (currentAnimation > 1) {
                            currentAnimation = 0
                        }
                    }
                }
                else if(downPressed && !collision(linkX, linkY + speed, gameMap)) {
    
                    linkY += speed
                    if (currentAnimation == 0) {
                        ctx.drawImage(link, 0, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (currentAnimation == 1) {
                        ctx.drawImage(link, 0, 30, 16, 16, linkX, linkY, 16, 16)
                    }
                    if (animationCounter >= 6) {
                        currentAnimation++
                        animationCounter = 0
                        if (currentAnimation > 1) {
                            currentAnimation = 0
                        }
                    }
                }
                else {
                    if(lastButtonPressed == "down") {
                        ctx.drawImage(link, 0, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (lastButtonPressed == "up"){
                        ctx.drawImage(link, 62, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (lastButtonPressed == "right"){
                        ctx.drawImage(link, 91, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                    else if (lastButtonPressed == "left"){
                        ctx.drawImage(link, 30, 0, 16, 16, linkX, linkY, 16, 16)
                    }
                }
            }
        }

        const draw = () => {
            setTimeout(() => {
                requestAnimationFrame(draw)
                ctx.fillStyle = "rgb(20,20,20)"
                ctx.fillRect(0,0,256,240)
                //game code to be run every frame
                drawMap(gameMap)
                drawLink()
                gameObjectCollision(linkX, linkY, gameObjects, true)
                drawGameObjects()
                drawHUD()
            }, 1000 / fps)
        }

        draw();
    }, [])

    return (<>
        <div className="bg-dark text-center">
        <canvas ref={canvasRef} id="myCanvas" width="256" height="240"></canvas>
        </div>
        </>
    )
}