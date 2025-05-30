const { createApp } = Vue

// card positions
const TOP = '0%';
const BOTTOM = '100%';
const X_POS = { 1: '0%', 2: '0%', 3: '100%' }
const CARD = { 1: 'hero.png', 2: 'hero2.png', 3: 'hero.png' }
const TRINKET_MARGIN = { 1: 'calc(8 * var(--unit))', 2: 'calc(3 * var(--unit))', 3: 'calc(2 * var(--unit))' }

const heroes = {
  'houndmaster': {
    position: BOTTOM,
    abilities: ["Hound's Rush", "Hound's Harry", 'Target Whistle', 'Cry Havoc', 'Guard Dog', 'Lick Wounds', 'Blackjack']
  }
}

createApp({
  data() {
    return {
      hero: 'houndmaster',
      level: 1,
      trinkets: ['', '', ''],
      abilities: [-1, -1, -1, -1, -1],
      abilitiesLevels: [1, 1, 1, 1, 1, 1, 1],
      disease: '',
      affliction: '',
      quirks: ['', '', ''],

      heroesPool: Object.keys(heroes),
      trinketsPool: ['', '', ''],
      diseases: ['', '', ''],
      afflictions: ['', '', ''],
      quirksPool: ['', '', ''],

      TRINKET_MARGIN: TRINKET_MARGIN,
    };
  },

  mounted() {
    window.addEventListener('resize', this.checkWindowSize);
    setInterval(this.checkWindowSize, 200);
    this.checkWindowSize();
    this.loadGame();
  },

  unmounted() {
    window.removeEventListener('resize', this.checkWindowSize);
  },

  computed: {
    heroCard() {
      return {
        backgroundImage: `url('img/${this.hero}/${CARD[this.level]}')`,
        backgroundPosition: `${X_POS[this.level]} ${heroes[this.hero].position}`,
      };
    },
    abilitiesPool() {
      return heroes[this.hero].abilities;
    },
  },

  methods: {
    abilityStyle(ability) {
      if (ability == -1) {
        return {
          boxShadow: 'none'
        };
      }

      const index = ability * 3 + this.abilitiesLevels[ability] - 1;
      const x = (index % 7) * 100 / (7 - 1);
      const y = Math.floor(index / 7) * 100 / (3 - 1);
      return {
        backgroundImage: `url('img/${this.hero}/abilities.png')`,
        backgroundSize: '700%',
        backgroundPosition: `${x}% ${y}%`
      };
    },

    saveGame() {
      const hero = {
      };
      localStorage.setItem('darkestHero', JSON.stringify(hero));
    },

    loadGame() {
      const save = JSON.parse(localStorage.getItem('darkestHero'));

      if (save) {
      }
    },

    checkWindowSize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // avoid unnecessary calculations
      if (width == this.width && height == this.height) {
        return;
      }
      this.width = width;
      this.height = height;
      this.rotate = width < height;

      const long = Math.max(width, height);
      const short = Math.min(width, height);
      this.cellSize = Math.min((long - 30) / 13 - 6, (short - 20) / 5 - 16);
    },
  },
}).mount('#app');
