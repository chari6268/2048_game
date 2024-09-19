class ColorScheme {
    static WINBG = '#FAF8EF';
    static GRIDBG = '#BBADA0';
  
    static BRIGHT = '#776E65';
    static LIGHT = '#F9F6F2';
  
    constructor() {
      this.background = this.initBackgrounds();
    }
  
    initBackgrounds() {
      return new Map([
        [0, 'rgba(238, 228, 218, 0.9)'],
        [2, '#EEE4DA'],
        [4, '#EDE0C8'],
        [8, '#F2B179'],
        [16, '#F59563'],
        [32, '#F67C5F'],
        [64, '#F65E3B'],
        [128, '#EDCF72'],
        [256, '#EDCC61'],
        [512, '#EDC850'],
        [1024, '#EDC53F'],
        [2048, '#EDC22E']
      ]);
    }
  
    getTileBackground(value) {
      return this.background.get(value) || '#CDC1B4'; // Default background for unrecognized values
    }
  
    getTileColor(value) {
      return value <= 8 ? ColorScheme.BRIGHT : ColorScheme.LIGHT;
    }
  }
  
  export default ColorScheme;
  