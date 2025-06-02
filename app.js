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
      stunned: false,

      setting: '',
      addingConditions: false,
      clearingConditions: false,
      clearingStress: false,
      clearingSave: false,
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

    setting: {
      handler(value) {
        console.log('udpated', value);
        if (value === 'export') {
          this.exportSave();
        }
        else if (value === 'import') {
          this.importSave();
        }
        else if (value === 'clear') {
          this.clearingSave = true;
        }
        this.setting = '';
      },
    }
  },

  computed: {
    abilitiesPool() {
      return this.current.hero == "" ? [] : heroes[this.current.hero].abilities;
    },
    canTransform() {
      return this.current.hero === 'abomination' && this.current.abilities.includes(3)
    },
    maxLife() {
      if (this.current.hero == "") return 0;
      return heroes[this.current.hero].life[this.current.level - 1];
    },
    deathsDoor() {
      return this.current.wounds == this.maxLife;
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
    opened() {
      return this.addingConditions || this.clearingConditions || this.clearingStress || this.clearingSave;
    }
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
          this.wound(parseInt(c.condition.slice(-1)));
        }
        if (c.condition == 'stun') {
          this.stunned = true;
        }
      });
      this.current.conditions = this.current.conditions.map(
        c => ({ ...c, turns: c.turns - 1 })
      ).filter(c => c.turns > 0);
    },

    wound(x) {
      this.current.wounds = this.clamp(this.current.wounds + x, this.maxLife);
    },
    stress(x) {
      this.current.stress = this.clamp(this.current.stress + x, 19);
    },
    clamp(x, max) {
      return Math.max(0, Math.min(max, x))
    },

    closeModal() {
      this.addingConditions = false;
      this.clearingConditions = false;
      this.clearingStress = false;
      this.clearingSave = false;
    },
    confirm() {
      if (this.clearingConditions) {
        this.clearConditions();
      } else if (this.clearingStress) {
        this.stress(-10);
      } else if (this.clearingSave) {
        this.clearSave();
      }
      this.closeModal();
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
        this.current = { ...defaultHero, ...save };
      };
      reader.readAsText(event.target.files[0]);
    },
    clearSave() {
      localStorage.removeItem("darkestHero");
      this.current = { ...defaultHero };
    },
  },
}).mount("#app");
