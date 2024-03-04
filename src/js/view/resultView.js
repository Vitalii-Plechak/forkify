import View from "./View.js";
import PreviewView from "./previewView.js";

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try another one.';
  
  /**
   * Generate search result markup
   *
   * @returns {string}
   * @private
   */
  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new ResultView();