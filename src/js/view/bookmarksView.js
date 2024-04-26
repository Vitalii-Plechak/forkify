import View from "./View";
import PreviewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _bookmarkBtn = document.querySelector('.nav__btn--bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  
  constructor() {
    super();
    this._toggleBookmarks();
  }
  
  
  _generateMarkup() {
    this._setBookmarkActiveIcon();
    
    return this._data.map(bookmark => PreviewView.render(bookmark, false)).join('');
  }
  
  /**
   * Toggle bookmarks visibility
   *
   * @private
   */
  _toggleBookmarks() {
    this._bookmarkBtn.addEventListener('click', () => {
      this._bookmarkBtn.classList.toggle('active');
    })
  }
  
  /**
   * Set bookmarks active icon
   *
   * @private
   */
  _setBookmarkActiveIcon() {
    if (this._data.length) {
      const bookmarkBtnIcon = this._bookmarkBtn.querySelector('use');
      const bookmarkFillBtn = 'icon-bookmark-fill';
      
      if (bookmarkBtnIcon.getAttribute('href').search(bookmarkFillBtn) >= 0) return;
      
      bookmarkBtnIcon
        .setAttribute(
          'href',
          this._bookmarkBtn.querySelector('use').href.baseVal.replace('icon-bookmark', bookmarkFillBtn
          )
        );
    }
  }
}

export default new BookmarksView();