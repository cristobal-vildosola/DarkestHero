const { createApp } = Vue


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
      // TODO: health, xp, buffs

      // options
      heroesPool: Object.keys(heroes),
      trinketsPool: trinketsPool,
      diseases: diseases,
      afflictions: afflictions,
      virtues: virtues,
      negatives: negatives,
      positives: positives,

      TRINKET_MARGIN: TRINKET_MARGIN,
    };
  },

  mounted() {
    this.loadGame();
  },

  computed: {
    abilitiesPool() {
      return heroes[this.hero].abilities;
    },

    heroCard() {
      const card = heroes[this.hero].cardSprite[this.level - 1];

      return {
        backgroundImage: `url('img/${this.hero}/${card.url}')`,
        backgroundPosition: `${card.x} ${card.y}`,
        backgroundSize: card.size,
      };
    },
    diseaseCard() {
      if (this.disease === '') {
        return {};
      }
      const index = diseases.indexOf(this.disease);

      return {
        backgroundImage: 'url(img/game/diseases.png)',
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: '1000%',
      };
    },
    afflictionCard() {
      if (this.affliction === '') {
        return {};
      }
      const indexAff = afflictions.indexOf(this.affliction);
      const indexVir = virtues.indexOf(this.affliction);
      const index = Math.max(indexAff, indexVir);
      const sprite = indexAff > -1 ? 'afflictions' : 'virtues';

      return {
        backgroundImage: `url(img/game/${sprite}.png)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: '1000%',
      };
    },
  },

  methods: {
    position(index, x_n, y_n) {
      const x = (index % x_n) * 100 / (x_n - 1);
      const y = Math.floor(index / x_n) * 100 / (y_n - 1);
      return `${x}% ${y}%`
    },
    abilityCard(ability) {
      if (ability == -1) {
        return {
          boxShadow: 'none'
        };
      }
      const index = ability * 3 + this.abilitiesLevels[ability] - 1;
      const x_n = heroes[this.hero].abilitiesSize[0]
      const y_n = heroes[this.hero].abilitiesSize[1]

      return {
        backgroundImage: `url('img/${this.hero}/abilities.png')`,
        backgroundSize: `${x_n * 100}%`,
        backgroundPosition: this.position(index, x_n, y_n),
      };
    },
    quirkCard(quirk) {
      if (quirk === '') {
        return {};
      }
      const indexNeg = negatives.indexOf(quirk);
      const indexPos = positives.indexOf(quirk);
      const index = Math.max(indexNeg, indexPos);
      const sprite = indexNeg > -1 ? 'negatives' : 'positives';

      return {
        backgroundImage: `url(img/game/${sprite}.png)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: '1000%',
      };
    },

    // TODO save, load, export and import game
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
  },
}).mount('#app');
