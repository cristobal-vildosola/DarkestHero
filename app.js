const { createApp } = Vue;

const defaultHero = {
  hero: "",
  level: 1,
  trinkets: ["", "", ""],
  trinketStates: [false, false, false],
  abilities: [-1, -1, -1, -1, -1],
  abilitiesLevels: [1, 1, 1, 1, 1, 1, 1],
  disease: "",
  affliction: "",
  quirks: ["", "", ""],
  wounds: 0,
  xp: 0,
  stress: 0,
  conditions: [],
};

createApp({
  data() {
    return {
      current: { ...defaultHero },
      transformed: false,
      stunned: true,

      adding: false,
      condition: '',
      turns: 0,

      // options
      heroesPool: Object.keys(heroes),
      trinketsPool: trinketsPool,
      diseases: diseases,
      afflictions: afflictions,
      virtues: virtues,
      negatives: negatives,
      positives: positives,
      conditions: conditions,
      zoom: 1,

      TRINKET_MARGIN: TRINKET_MARGIN,
    };
  },

  mounted() {
    this.loadGame();
  },
  watch: {
    current: {
      handler() {
        this.saveGame();
      },
      deep: true,
    },
  },

  computed: {
    abilitiesPool() {
      return this.current.hero == "" ? [] : heroes[this.current.hero].abilities;
    },

    heroCard() {
      if (this.current.hero == "") return {};

      const card = heroes[this.current.hero].cardSprite[this.current.level - 1];

      return {
        backgroundImage: `url('img/${card.url(this.current.hero, this.transformed)}')`,
        backgroundPosition: this.position(card.index, card.x, card.y),
        backgroundSize: `${card.x * 100}%`,
      };
    },
    canTransform() {
      return this.current.hero === 'abomination' && this.current.abilities.includes(3)
    },
    diseaseCard() {
      if (this.current.disease == "") return {};

      return {
        backgroundImage: "url(img/game/diseases.png)",
        backgroundPosition: this.position(
          diseases.indexOf(this.current.disease),
          10,
          7
        ),
        backgroundSize: "1000%",
      };
    },
    afflictionCard() {
      if (this.current.affliction == "") return {};

      const indexAff = afflictions.indexOf(this.current.affliction);
      const indexVir = virtues.indexOf(this.current.affliction);
      const index = Math.max(indexAff, indexVir);
      const sprite = indexAff > -1 ? "afflictions" : "virtues";
      return {
        backgroundImage: `url(img/game/${sprite}.png)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: "1000%",
      };
    },
  },

  methods: {
    trinketCard(trinket) {
      if (trinket == "") return {};

      let index, sprite;
      for (let i = 0; i < trinketsPool.length; i++) {
        index = trinketsPool[i].indexOf(trinket);
        if (index > -1) {
          sprite = `trinkets${i + 1}`;
          break;
        }
      }
      return {
        backgroundImage: `url(img/game/${sprite}.png)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: "1000%",
      };
    },
    abilityCard(ability) {
      if (ability == -1) return { boxShadow: "none" };

      const index = ability * 3 + this.current.abilitiesLevels[ability] - 1;
      const x_n = heroes[this.current.hero].abilitiesSize[0];
      const y_n = heroes[this.current.hero].abilitiesSize[1];
      return {
        backgroundImage: `url('img/${this.current.hero}/abilities.png')`,
        backgroundSize: `${x_n * 100}%`,
        backgroundPosition: this.position(index, x_n, y_n),
      };
    },
    quirkCard(quirk) {
      if (quirk == "") return {};

      const indexNeg = negatives.indexOf(quirk);
      const indexPos = positives.indexOf(quirk);
      const index = Math.max(indexNeg, indexPos);
      const sprite = indexNeg > -1 ? "negatives" : "positives";
      return {
        backgroundImage: `url(img/game/${sprite}.png)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: "1000%",
      };
    },
    conditionCard(condition) {
      return {
        backgroundImage: `url(img/tokens/${condition}.png)`,
      };
    },

    // sprite position
    position(index, x_n, y_n) {
      const x = ((index % x_n) * 100) / (x_n - 1);
      const y = (Math.floor(index / x_n) * 100) / (y_n - 1);
      return `${x}% ${y}%`;
    },

    clearConditions() {
      this.current.conditions = [];
    },
    addCondition() {
      this.current.conditions.push({ condition: this.condition, turns: this.turns });
      this.current.conditions.sort((a, b) => a.condition < b.condition ? -1 : 1)
    },
    nextTurn() {
      this.stunned = false;
      this.current.conditions.forEach(c => {
        if (c.condition.startsWith('bl')) {
          this.current.wounds += parseInt(c.condition.slice(-1));
        }
        if (c.condition == 'stun') {
          this.stunned = true;
        }
      });
      this.current.conditions = this.current.conditions.map(
        c => ({ ...c, turns: c.turns - 1 })
      ).filter(c => c.turns > 0);
    },

    saveGame() {
      localStorage.setItem("darkestHero", JSON.stringify(this.current));
    },
    loadGame() {
      const save = JSON.parse(localStorage.getItem("darkestHero"));
      if (save) {
        this.current = { ...defaultHero, ...save };
      }
    },

    exportSave() {
      const save = JSON.stringify(this.current, null, 2);
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(save);
      const dlAnchorElem = document.getElementById("export");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "DarkestHero.json");
      dlAnchorElem.click();
    },
    importSave() {
      document.getElementById("import").click();
    },
    onFileUpload(event) {
      if (!event.target.files[0]) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const save = JSON.parse(event.target.result);
        this.current = save;
      };
      reader.readAsText(event.target.files[0]);
    },

    // TODO: clear save file
    clearSave() {
      localStorage.removeItem("darkestHero");
      this.current = { ...defaultHero };
    },
  },
}).mount("#app");
