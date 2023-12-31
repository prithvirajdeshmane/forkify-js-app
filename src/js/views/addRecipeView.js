import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  //   _btnUpload = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerShowAddRecipeWindow();
    this._addHandlerHideWindow();
    //this.addHandlerUpload();
  }

  toggleWindow() {
    console.log(this);
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowAddRecipeWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const formDataArray = [...new FormData(this)];
      const formData = Object.fromEntries(formDataArray);
      handler(formData);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
