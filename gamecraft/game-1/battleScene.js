// Import the background
const battleBackgroundImageLarge = new Image();
battleBackgroundImageLarge.src = './img/battleBackground.png';

const battleBackgroundImageSmall = new Image();
battleBackgroundImageSmall.src = './img/battleBackground_small.png';

let battleBackgroundImage;
if (canvas.width === 1024 && canvas.height === 576) {
    battleBackgroundImage = battleBackgroundImageLarge;
} else if (canvas.width === 640 && canvas.height === 350) {
    battleBackgroundImage = battleBackgroundImageSmall;
}
battleBackgroundImage.style.zIndex = "-999";



const battleBackground = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle 
let emby
let renderSprites
let battleAnimationId
let queue
let score = 0; // Initialize score outside the event listener


function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attackBox').replaceChildren()

    draggle = new Monster(monsters.Draggle)
    emby = new Monster(monsters.Emby)
    renderSprites = [draggle, emby]
    queue = []

    if (canvas.width === 640 && canvas.height === 350) {
        emby.position = { x: 130, y: 190 }; // Adjust these values as needed
        draggle.position = { x: 500, y: 40 }; // Adjust these values as needed
    }

    emby.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attackBox').append(button)
    })
    //Event listener for the buttons (attack)
    document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        emby.attack({
            attack: selectedAttack,
            recipient: draggle,
            renderSprites
        })
        

        if (draggle.health <= 0) {
            score += 1; // Increment score
            document.querySelector('#score').innerText = "Score: " + score; // Update score display

            // Get the current score from the cookie and add 1
            let savedScore = getScoreFromCookie() + 1;

            // Update the cookie with the new score
            document.cookie = "score=" + savedScore + ";path=/;max-age=31536000"; // max-age set to one year

            // If the current score is lower than the saved score, update the score with the saved score
            if (score < savedScore) {
                score = savedScore;
                document.querySelector('#score').innerText = "Score: " + score; // Update score display
            } else if (score > savedScore) {
                // If the current score is higher than the saved score, update the cookie
                document.cookie = "score=" + score + ";path=/;max-age=31536000"; // max-age set to one year
            }
            queue.push(() => {
                draggle.faint();
            })
            queue.push(() => {
                //fade back to black
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#userInterface').style.display = 'none'
                        gsap.to('#overlappingDiv', {
                            opacity: 0,
                            onComplete: () => {
                                // Show a popup with "You win"
                                document.querySelector('#alertMessage').innerText = "You win!";
                                document.querySelector('#alertBox').style.display = 'block';
            
                                // Show the controls again
                                document.querySelector('.controls').style.display = 'block';
                            }
                        })
                        battle.initiated = false
                    }
                })
            })
        }

        // When player clicks the close button on the popup
        document.querySelector('#alertClose').addEventListener('click', function() {
            document.querySelector('#alertBox').style.display = 'none';
        });
        
        //draggle or enemy attacks
        const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

        queue.push(() => {
            draggle.attack({
                attack: randomAttack,
                recipient: emby,
                renderSprites
            })
            if (emby.health <= 0) {
                // Subtract 1 from score if score is greater than 0
                if (score > 0) {
                    score -= 1;
                    // Update score display
                    document.getElementById('score').innerText = "Score: " + score;
                }
                    queue.push(() => {
                        emby.faint();
                    });
                queue.push(() => {
                    //fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                onComplete: () => {
                                    // Show a popup with "You win"
                                    document.querySelector('#alertMessage').innerText = "You lost!";
                                    document.querySelector('#alertBox').style.display = 'block';
                
                                    // Show the controls again
                                    document.querySelector('.controls').style.display = 'block';
                                }
                            })
                            battle.initiated = false
                        }
                    })
                })
            }
        })
    })


    // When player clicks the dialogue
    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color

    })
        // When a battle is initiated
        if (battle.initiated) {
            // Show the user interface
            document.querySelector('#userInterface').style.display = 'block';
        }
})
}

// Animation for the battle
function animateBattle() {
    document.querySelector('.controls').style.display = 'none'; // Hide the controls

    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    
    renderSprites.forEach((sprite) => {
        sprite.draw()
    })
}

initBattle()
animate() // Uncomment the animate() function call


// When player clicks the dialogue
document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})