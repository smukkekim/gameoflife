import { loadJSON } from './loaders.js';

export default class ColorSchemeHandler {
  constructor() {
    this.schemes = Object.create(null);
  }

  loadSchemes() {
    return loadJSON('/colorSchemes.json').then(schemes => {
      this.schemes = schemes;
    });
  }
}
