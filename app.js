const { createApp } = Vue;

const defaultHero = {
  hero: "",
  level: 1,
  trinkets: ["", "", ""],
  trinketStates: [false, false, false],
  abilities: [-1, -1, -1, -1, -1],
  abilitiesLevels: [1, 1, 1, 1, 1, 1, 1],
  abilitiesBlacksmith: [1, 1, 1, 1, 1, 1, 1],
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
      heroes: [{ ...defaultHero }],
      currentSave: 0,
      transformed: false,
      stunned: false,

      // modals and options
      setting: 0,
      addingConditions: false,
      condition: "",
      turns: 0,
      editingConditions: false,
      blacksmithing: false,
      ability: -1,
      level: 2,
      clearingSave: false,

      // game options
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
    heroes: {
      handler() {
        this.saveGame();
      },
      deep: true,
    },
    currentSave() {
      this.saveGame();
    },

    setting: {
      handler(value) {
        switch (value) {
          case "export":
            console.log("export");
            this.exportSave();
            break;
          case "import":
            console.log("import");
            this.importSave();
            break;
          case "clear":
            console.log("clear");
            this.clearingSave = true;
            break;
          case "add-hero":
            this.heroes.push({ ...defaultHero });
            this.currentSave = this.heroes.length - 1;
            break;
          case "delete-hero":
            this.heroes.splice(this.currentSave, 1);
            this.currentSave = 0;
            break;
          default:
            if (typeof value === "number") this.currentSave = value;
        }
        this.setting = this.currentSave;
      },
    },
  },

  computed: {
    current() {
      return this.heroes[this.currentSave];
    },
    save() {
      return {
        heroes: this.heroes,
        currentSave: this.currentSave,
      };
    },

    abilitiesPool() {
      return this.current.hero == "" ? [] : heroes[this.current.hero].abilities;
    },
    blacksmithPool() {
      return this.abilitiesPool
        .map((x, i) => [x, i])
        .filter(
          ([_, i]) =>
            this.current.abilities.includes(i) &&
            this.current.abilitiesLevels[i] < 3
        );
    },
    canTransform() {
      return (
        this.current.hero === "abomination" &&
        this.current.abilities.includes(3)
      );
    },
    maxLife() {
      if (this.current.hero == "") return 0;
      return heroes[this.current.hero].life[this.current.level - 1];
    },
    deathsDoor() {
      return this.current.wounds == this.maxLife;
    },
    afflicted() {
      return this.current.stress >= 10;
    },

    heroCard() {
      if (this.current.hero == "") return {};

      const card = heroes[this.current.hero].cardSprite[this.current.level - 1];
      return {
        backgroundImage: `url('img/${card.url(
          this.current.hero,
          this.transformed
        )}')`,
        backgroundPosition: this.position(card.index, card.x, card.y),
        backgroundSize: `${card.x * 100}%`,
      };
    },
    diseaseCard() {
      if (this.current.disease == "") return {};

      return {
        backgroundImage: "url(img/game/diseases.webp)",
        backgroundPosition: this.position(
          diseases.indexOf(this.current.disease),
          10,
          2
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
        backgroundImage: `url(img/game/${sprite}.webp)`,
        backgroundPosition: this.position(index, 10, 7),
        backgroundSize: "1000%",
      };
    },
    opened() {
      return (
        this.addingConditions ||
        this.editingConditions ||
        this.clearingSave ||
        this.blacksmithing
      );
    },
  },

  methods: {
    heroName(name) {
      return name.replaceAll("_", " ");
    },
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
        backgroundImage: `url(img/game/${sprite}.webp)`,
        backgroundPosition: this.position(index, 10, 2),
        backgroundSize: "1000%",
      };
    },
    abilityCard(i) {
      if (i == -1) return { boxShadow: "none" };

      const level = Math.max(
        this.current.abilitiesLevels[i],
        this.current.abilitiesBlacksmith[i]
      );
      const index = i * 3 + level - 1;
      const x_n = heroes[this.current.hero].abilitiesSize[0];
      const y_n = heroes[this.current.hero].abilitiesSize[1];
      return {
        backgroundImage: `url('img/${this.current.hero}/abilities.webp')`,
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
        backgroundImage: `url(img/game/${sprite}.webp)`,
        backgroundPosition: this.position(index, 10, 2),
        backgroundSize: "1000%",
      };
    },
    conditionCard(condition) {
      return {
        backgroundImage: `url(img/tokens/${condition}.webp)`,
      };
    },

    // sprite position
    position(index, x_n, y_n) {
      const x = ((index % x_n) * 100) / (x_n - 1);
      const y = y_n == 1 ? 1 : (Math.floor(index / x_n) * 100) / (y_n - 1);
      return `${x}% ${y}%`;
    },

    addCondition() {
      this.current.conditions.push({
        condition: this.condition,
        turns: this.turns,
      });
      this.current.conditions.sort((a, b) =>
        a.condition < b.condition ? -1 : 1
      );
    },
    startTurn() {
      this.stunned = false;
      this.current.conditions.forEach((c) => {
        if (c.condition.startsWith("bl")) {
          this.wound(parseInt(c.condition.slice(-1)));
        }
        if (c.condition == "stun") {
          this.stunned = true;
        }
      });
      this.current.conditions = this.current.conditions
        .map((c) => ({ ...c, turns: c.turns - 1 }))
        .filter((c) => c.turns > 0);
    },
    removeCondition(index) {
      this.current.conditions.splice(index, 1);
    },
    clearConditions() {
      this.current.conditions = [];
      this.editingConditions = false;
    },

    wound(x) {
      this.current.wounds = this.clamp(this.current.wounds + x, this.maxLife);
    },
    stress(x) {
      this.current.stress = this.clamp(
        this.current.stress + x,
        19,
        this.afflicted ? 10 : 0
      );
    },
    setStress(x) {
      if (this.afflicted && x == 10) {
        this.current.stress -= 10;
      } else if (this.afflicted) {
        this.current.stress = x + 10;
      } else {
        this.current.stress = x;
      }
    },
    clamp(x, max, min = 0) {
      return Math.max(min, Math.min(max, x));
    },

    useBlacksmith() {
      this.current.abilitiesBlacksmith[this.ability] = this.level;
      this.blacksmithing = false;
      this.ability = -1;
    },
    clearBlacksmith() {
      this.current.abilitiesBlacksmith = [1, 1, 1, 1, 1, 1, 1];
    },

    closeModal() {
      this.addingConditions = false;
      this.editingConditions = false;
      this.clearingSave = false;
      this.blacksmithing = false;
    },
    confirm() {
      this.clearSave();
      this.closeModal();
    },

    saveGame() {
      localStorage.setItem("darkestHero", JSON.stringify(this.save));
    },
    loadGame() {
      const save = JSON.parse(localStorage.getItem("darkestHero"));
      if (save) {
        this.load(save);
      }
    },

    exportSave() {
      const save = JSON.stringify(this.save, null, 2);
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
        this.load(save);
      };
      reader.readAsText(event.target.files[0]);
    },
    clearSave() {
      localStorage.removeItem("darkestHero");
      this.heroes = [
        { ...defaultHero },
        { ...defaultHero },
        { ...defaultHero },
        { ...defaultHero },
      ];
      this.currentSave = 0;
    },

    load(save) {
      if (save.hasOwnProperty("currentSave")) {
        this.heroes = save.heroes.map((hero) => ({
          ...defaultHero,
          ...hero,
        }));
        this.currentSave = save.currentSave;
        this.setting = save.currentSave;
      } else {
        this.heroes[0] = { ...defaultHero, ...save };
      }
    },
  },
}).mount("#app");
