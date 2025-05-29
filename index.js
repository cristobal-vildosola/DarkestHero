const { createApp } = Vue;

createApp({
  data() {
    return {
      rotate: false,
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

  methods: {

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
