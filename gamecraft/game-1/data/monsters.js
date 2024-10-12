const monsters = {
    Emby: {
        position: {
            x: 250,
            y: 325    },
        image: {
            src: './img/embySprite.png'
        }, 
        frames: {
            max: 4,
            hold: 120
        },
        animate: true,
        name: 'Artie',
        attacks: [attacks.Tackle, attacks.Fireball]
    },
    Draggle: {
        position: {
            x: 800,
            y: 100    },
        image: {
            src: './img/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 120
        },
        animate: true,
        isEnemy: true,
        name: 'Jaspie',
        attacks: [attacks.Tackle, attacks.Fireball]
    }
}

