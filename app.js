const { createApp } = Vue

createApp({
  data() {
    return {
      hero: '',
      level: 1,
      trinkets: ['', '', ''],
      abilities: [-1, -1, -1, -1, -1],
      abilitiesLevels: [1, 1, 1, 1, 1, 1, 1],
      disease: '',
      affliction: '',
      quirks: ['', '', ''],
      wounds: 0,
      xp: 0,
      buffs: 0,

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
      return this.hero == '' ? [] : heroes[this.hero].abilities;
    },

    heroCard() {
      if (this.hero == '') return {};

      const card = heroes[this.hero].cardSprite[this.level - 1];
      return {
        backgroundImage: `url('img/${this.hero}/${card.url}')`,
        backgroundPosition: `${card.x} ${card.y}`,
        backgroundSize: card.size,
      };
    },
    diseaseCard() {
      if (this.disease == '') return {};

      return {
        backgroundImage: 'url(img/game/diseases.png)',
        backgroundPosition: this.position(diseases.indexOf(this.disease), 10, 7),
        backgroundSize: '1000%',
      };
    },
    afflictionCard() {
      if (this.affliction == '') return {};

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
    // TODO: trinketCard
    trinketCard(trinket) {
      if (trinket == '') return {};

      const index = trinket * 3 + this.abilitiesLevels[trinket] - 1;
      const x_n = heroes[this.hero].abilitiesSize[0]
      const y_n = heroes[this.hero].abilitiesSize[1]
      return {
        backgroundImage: `url('img/${this.hero}/abilities.png')`,
        backgroundSize: `${x_n * 100}%`,
        backgroundPosition: this.position(index, x_n, y_n),
      };
    },
    abilityCard(ability) {
      if (ability == -1) return { boxShadow: 'none' };

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
      if (quirk == '') return {};

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

    // export and import game
    saveGame() {
      const hero = {
        hero: this.hero,
        level: this.level,
        trinkets: this.trinkets,
        abilities: this.abilities,
        abilitiesLevels: this.abilitiesLevels,
        disease: this.disease,
        affliction: this.affliction,
        quirks: this.quirks,
        wounds: this.wounds,
        xp: this.xp,
        buffs: this.buffs,
      };
      localStorage.setItem('darkestHero', JSON.stringify(hero));
    },
    loadGame() {
      const save = JSON.parse(localStorage.getItem('darkestHero'));
      if (save) {
        this.hero = save.hero || '';
        this.level = save.level || 1;
        this.trinkets = save.trinkets || ['', '', ''];
        this.abilities = save.abilities || [-1, -1, -1, -1, -1];
        this.abilitiesLevels = save.abilitiesLevels || [1, 1, 1, 1, 1, 1, 1];
        this.disease = save.disease || '';
        this.affliction = save.affliction || '';
        this.quirks = save.quirks || ['', '', ''];
        this.wounds = save.wounds || 0;
        this.xp = save.xp || 0;
        this.buffs = save.buffs || 0;
      }
    },
  },
}).mount('#app');
