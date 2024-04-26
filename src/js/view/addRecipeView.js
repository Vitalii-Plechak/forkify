import View from "./View.js";
import { trapFocus } from "../helper/focusTrapHelper.js";

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
    const toggleClass = 'hidden'
    
    if (forceClose) {
      this._newRecipeWindow.classList.add(toggleClass);
      this._newRecipeWindowOverlay.classList.add(toggleClass);
      this._newRecipeWindow.setAttribute('aria-hidden', 'true');
      this._newRecipeWindowOverlay.setAttribute('aria-hidden', 'true');
      this._addRecipeBtn.focus();
    } else {
      this._newRecipeWindow.classList.toggle(toggleClass);
      this._newRecipeWindowOverlay.classList.toggle(toggleClass);
      const isActive = !this._newRecipeWindow.classList.contains(toggleClass);
      
      this._newRecipeWindow.setAttribute('aria-hidden', isActive);
      this._newRecipeWindowOverlay.setAttribute('aria-hidden', isActive);
      trapFocus(isActive ? this._newRecipeWindow : this._addRecipeBtn.focus());
    }
  }
  
  /**
   * Render error message
   *
   * @param {string} message
   * @param {Element} parentElement
   * @returns {string}
   */
  renderErrorMessage(message = this._errorMessage, parentElement = this._errorMessageContainer) {
    return super.renderErrorMessage(message, parentElement);
  }
  
  /**
   * Add recipe upload handler
   *
   * @param {function} handler
   */
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