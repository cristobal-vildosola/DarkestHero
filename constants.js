
// trinkets positions
const TRINKET_MARGIN = ['calc(8 * var(--unit))', 'calc(3 * var(--unit))', 'calc(2 * var(--unit))']

const separateCards = [
    { url: 'hero1.jpg', size: '100%', x: '0', y: '0' },
    { url: 'hero2.jpg', size: '100%', x: '0', y: '0' },
    { url: 'hero3.jpg', size: '100%', x: '0', y: '0' },
];
const doubleCardsBottom = [
    { url: 'hero.png', size: '200%', x: '0', y: '100%' },
    { url: 'hero2.png', size: '200%', x: '0', y: '100%' },
    { url: 'hero.png', size: '200%', x: '100%', y: '100%' },
]

const heroes = {
    'arbalest': {
        cardSprite: separateCards,
        abilities: [
            'Sniper Shot',
            'Suppressive Fire',
            'Sniper\'s Mark',
            'Bola',
            'Blindfire',
            'Battlefield Bandage',
            'Rallying Flare'
        ],
        abilitiesSize: [10, 7],
    },
    'houndmaster': {
        cardSprite: doubleCardsBottom,
        abilities: [
            'Hound\'s Rush',
            'Hound\'s Harry',
            'Target Whistle',
            'Cry Havoc',
            'Guard Dog',
            'Lick Wounds',
            'Blackjack'
        ],
        abilitiesSize: [7, 3],
    },
    'palceholder': { // TODO
        cardSprite: separateCards,
        abilities: [
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        ],
        abilitiesSize: [7, 3],
    },
}

// TODO list of lists
const trinketsPool = [
    '',
    '',
    '',
];

const diseases = [
    'Black Plague',
    'Bulimic',
    'Ennui',
    'Hemophilia',
    'Lethargy',
    'Syphilis',
    'Vertigo',
    'The Worries',
    'Creeping Cough',
    'Tapeworm',
    'Spotted Fever',
];

const afflictions = [
    'Fearful',
    'Selfish',
    'Masochistic',
    'Hopeless',
    'Irrational',
];

const virtues = [
    'Stalwart',
    'Courageous',
    'Focused',
    'Powerful',
    'Vigorous',
];

const negatives = [
    'Anemic',
    'Nocturnal',
    'Clumsy',
    'Off Guard',
    'Infirm',
    'Shocker',
    'Mercurial',
    'Night Blindness',
    'Weak Grip',
    'Slow Reflexes',
    'Nervous',
    'Stress Eater',
    'Thin Blooded',
    'Fragile',
    'Light Sensitive',
    'Fear of the Unknown',
    'Bad Gambler',
    'Soft',
];

const positives = [
    'Clotter',
    'Eartly Riser',
    'Fast Healer',
    'Hard Noggin',
    'Night Owl',
    'Evasive',
    'Photo Mania',
    'Quick Reflexes',
    'Resilient',
    'Stress Faster',
    'Thick Blooded',
    'Hard Skinned',
    'Warrior of Light',
    'Balanced',
    'Hoarder',
    'On Guard',
    'Skilled Gambler',
];