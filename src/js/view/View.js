import icons from 'url:../../img/icons.svg';

export default class View {
  _errorMessage = '';
  _message = '';
  _data;
  
  /**
   * Render the received object to the DOM
   *
   * @param {Object | Object[]} data
   * @param {boolean} [render=true] Determines whether to render the content or just simply return it
   * @returns {void|string}
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderErrorMessage();
    
    this._data = data;
    
    const markup = this._generateMarkup();
    if (!render) return markup;
    
    this._clear();
    this._parentElement.innerHTML = markup;
  }
  
  /**
   * Update DOM with new data
   *
   * @param {object} data
   */
  update(data) {
    this._data = data;
    
    const newMarkup = this._generateMarkup();
    
    /* Convert string into real virtual DOM object */
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    
    if (newElements.length !== curElements.length) return this.render(this._data);
    
    return newElements.forEach((newElem, i) => {
      const curElem = curElements[i];
      
      /** isEqualNode https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode */
      /** nodeValue https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue */
      if (!newElem.isEqualNode(curElem)) {
        /* Update changed text */
        if (newElem?.firstChild?.nodeValue?.trim() !== '') {
          curElem.textContent = newElem.textContent;
        }
        
        /* Update changed attributes */
        Array.from(newElem.attributes).forEach(attr => curElem.setAttribute(attr.name, attr.value));
      }
    })
  }
  
  /**
   * Clear parent content
   *
   * @param {Element} parentElement
   * @private
   */
  _clear(parentElement = this._parentElement) {
    parentElement.innerHTML = '';
  }
  
  /**
   * Render error message
   *
   * @param {string} message
   * @param {boolean} render
   * @returns {string}
   */
  
  /**
   * Render error message
   *
   * @param {string} message
   * @param {Element} parentElement
   * @returns {string}
   */
  renderErrorMessage(message = this._errorMessage, parentElement = this._parentElement) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    
    this._clear(parentElement);
    parentElement.innerHTML = markup;
  }
  
  /**
   * Render message
   *
   * @param {string} message
   */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    
    this._clear();
    this._parentElement.innerHTML = markup;
  }
  
  /**
   * Render loader spinner
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `
    
    this._clear();
    this._parentElement.innerHTML = markup;
  }
}