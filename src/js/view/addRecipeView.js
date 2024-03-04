import View from "./View.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _newRecipeWindow = document.querySelector('.add-recipe-window');
  _newRecipeWindowOverlay = document.querySelector('.overlay');
  _newRecipeWindowCloseBtn = this._newRecipeWindow.querySelector('.btn--close-modal');
  _addRecipeBtn = document.querySelector('.nav__btn--add-recipe');
  _errorMessageContainer = document.querySelector('.upload__error-container');
  _message = 'Recipe was successfully uploaded!';
  
  constructor() {
    super();
    this._addHandlerToggleNewRecipeWindow();
  }
  
  /**
   * Toggle new recipe window visibility
   */
  _addHandlerToggleNewRecipeWindow() {
    [this._addRecipeBtn, this._newRecipeWindowCloseBtn]
      .forEach(button => button.addEventListener('click', this.toggleNewRecipeWindow.bind(this)))
  }
  
  /**
   * Toggle new recipe modal window
   *
   * @param {PointerEvent} ev
   * @param {boolean} [forceClose=false]
   */
  toggleNewRecipeWindow(ev, forceClose = false) {
    if (forceClose) {
      this._newRecipeWindow.classList.add('hidden');
      this._newRecipeWindowOverlay.classList.add('hidden');
    } else {
      this._newRecipeWindow.classList.toggle('hidden');
      this._newRecipeWindowOverlay.classList.toggle('hidden');
    }
  }
  
  renderErrorMessage(message = this._errorMessage, parentElement = this._errorMessageContainer) {
    return super.renderErrorMessage(message, parentElement);
  }
  
  addHandlerRecipeUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formDataArr = [...new FormData(this)];
      const data = Object.fromEntries(formDataArr);
      
      handler(data);
    });
  }
}

export default new AddRecipeView();