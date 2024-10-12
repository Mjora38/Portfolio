// Imports
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //Makes a 2d API and makes a short cut for canvas
window.onload = function() {
    // Hide the user interface at the start
    document.querySelector('#userInterface').style.display = 'none';
}

// At the start of the game
score = getScoreFromCookie();
document.querySelector('#score').innerText = "Score: " + score;

function getScoreFromCookie() {
    let score = 0;
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === 'score') {
            score = parseInt(cookie[1]);
            break;
        }
    }
    return score;
}
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}
// Get the current score
let savedScore = score;

// Get the highest score from the cookie
let highestScore = getCookie('highestScore');

// Update the high score board with the highest score
document.querySelector('#highScore').innerText = highestScore;

// If there's no highest score yet or the current score is higher than the highest score
if (highestScore === null || savedScore > highestScore) {
    // Update the highest score
    highestScore = savedScore;

    // Update the cookie with the new highest score
    setCookie('highestScore', highestScore, 365); // 365 days expiry
}



// When the page reloads
window.onload = function() {
    // Hide the user interface at the start
    document.querySelector('#userInterface').style.display = 'none';

    // Show the new saved score
    let savedScore = getScoreFromCookie();
    document.querySelector('#score').innerText = "Score: " + savedScore;
}


// Dimensions of the game in px (70 tiles wide hight 40 tiles)
if (window.innerWidth < 1025) {
    canvas.width = 640; // Adjust the width for smaller devices
    canvas.height = 350; // Adjust the height for smaller devices
    animate() // Uncomment the animate() function call
} else {
    canvas.width = 1024;
    canvas.height = 576;
}


//for the collisions
const collisionMap = []
for (let i = 0; i <collisions.length; i+=70)  { //i+= is just to iterate the script in the collision aray ever 70th time
    collisionMap.push(collisions.slice(i, 70 + i)) // (i, 70 + i) this means it increments i by 70 in each iteration. This means that the loop will process every 70th element of the collisions array, starting from the 0th element.
}

//for the battle activation
const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70)  { //i+= is just to iterate the script in the collision aray ever 70th time
    battleZonesMap.push(battleZonesData.slice(i, 70 + i)) // (i, 70 + i) this means it increments i by 70 in each iteration. This means that the loop will process every 70th element of the collisions array, starting from the 0th element.
}


// For teh boundaries
const boundaries = []
let offset = {
    x: -735,
    y: -620
};

if (window.innerWidth < 1025) {
    offset = {
        x: -930,
        y: -750
    };
}

//Map colision
collisionMap.forEach((row, i) => { // i is the index for each row and wil ad 1 each row
    row.forEach((symbol, j) =>{ //in ech row it loops over the symbol j is the x axes and i is the y axes so itsa perfect row format
        if (symbol === 1025)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})


// For the battleZones
const battleZones = []

battleZonesMap.forEach((row, i) => { // i is the index for each row and wil ad 1 each row
    row.forEach((symbol, j) =>{ //in ech row it loops over the symbol j is the x axes and i is the y axes so itsa perfect row format
        if (symbol === 1025)
        battleZones.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

console.log(battleZones)

// Background
const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/ForeGroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

// Player
const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 20
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})
// Game loop
const Background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

// See if the W,A,S or D key is being pressed
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

//Detecting the colision blocks
const movables = [Background, ...boundaries, foreground, ...battleZones] // This is for the object that need to nmove with the map

//Collision detection
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&   
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}
const battle = {
    initiated: false
}

//Animation loop
function animate()  {
    const animationId = window.requestAnimationFrame(animate) // Is the function that be called recursively 
    
    Background.draw() // Call the draw method
    boundaries.forEach((boundary) =>{
        boundary.draw() // This cals the draw method from line 25 that creates a rectangle
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    
    
    // Movement W, A, S and D and activating a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
          const battleZone = battleZones[i]
          const overlappingArea =
            (Math.min(
              player.position.x + player.width,
              battleZone.position.x + battleZone.width
            ) -
              Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(
              player.position.y + player.height,
              battleZone.position.y + battleZone.height
            ) -
              Math.max(player.position.y, battleZone.position.y))
          if (
            rectangularCollision({
              rectangle1: player,
              rectangle2: battleZone
            }) &&
            overlappingArea > (player.width * player.height) / 2 &&
            Math.random() < 0.01
          ) {
            // deactivate current animation loop
            window.cancelAnimationFrame(animationId)

            //fade to black
            battle.initiated = true
            gsap.to('#overlappingDiv', {
              opacity: 1,
              repeat: 3,
              yoyo: true,
              duration: 0.4,
              onComplete() {
                gsap.to('#overlappingDiv', {
                  opacity: 1,
                  duration: 0.4,
                  onComplete() {
                    // activate a new animation loop
                    initBattle()
                    animateBattle()
                    gsap.to('#overlappingDiv', {
                      opacity: 0,
                      duration: 0.4
                    })
                  }
                })
              }
            })
            break
          }
        }
      }

    // Movement W, A, S and D
    if (keys.w.pressed && lastkey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            )   {
                console.log('Collided')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.y += 2; // Change the y position by subtracting 2
        });
    } else if (keys.a.pressed && lastkey === 'a') {
        player.animate = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }}
                })
            )   {
                console.log('Collided')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.x += 2; // Change the x position by subtracting 2
        });
    } else if (keys.s.pressed && lastkey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            )   {
                console.log('Collided')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.y -= 2; // Change the y position by adding 2
        });
    } else if (keys.d.pressed && lastkey === 'd') {
        player.animate = true
        player.image = player.sprites.right 
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }}
                })
            )   {
                console.log('Collided')
                moving = false
                break
            }
        }

        if (moving)
        movables.forEach(movable => {
            movable.position.x -= 2; // Change the x position by adding 2
        });
    }
}




//Movement 
let lastkey = ''
window.addEventListener('keydown', (e) => { // When keydown is presed then call the code in the {}.
    switch (e.key){
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break

        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => { // When keydown is presed then call the code in the {}.
    switch (e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

document.querySelector('.controls .up').addEventListener('touchstart', function() {
    window.dispatchEvent(new KeyboardEvent('keydown', {'key':'w'}));
});

document.querySelector('.controls .up').addEventListener('touchend', function() {
    window.dispatchEvent(new KeyboardEvent('keyup', {'key':'w'}));
});

document.querySelector('.controls .down').addEventListener('touchstart', function() {
    window.dispatchEvent(new KeyboardEvent('keydown', {'key':'s'}));
});

document.querySelector('.controls .down').addEventListener('touchend', function() {
    window.dispatchEvent(new KeyboardEvent('keyup', {'key':'s'}));
});

document.querySelector('.controls .left').addEventListener('touchstart', function() {
    window.dispatchEvent(new KeyboardEvent('keydown', {'key':'a'}));
});

document.querySelector('.controls .left').addEventListener('touchend', function() {
    window.dispatchEvent(new KeyboardEvent('keyup', {'key':'a'}));
});

document.querySelector('.controls .right').addEventListener('touchstart', function() {
    window.dispatchEvent(new KeyboardEvent('keydown', {'key':'d'}));
});

document.querySelector('.controls .right').addEventListener('touchend', function() {
    window.dispatchEvent(new KeyboardEvent('keyup', {'key':'d'}));
});

