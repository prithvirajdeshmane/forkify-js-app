import icons from 'url:../../img/icons.svg'; // Parcel 2 code

export default class View {
  _data;

  /**
   *
   * @param {Object | Object[]} data The data that is to be rendered, eg: recipe
   * @param {boolean} [render=true] Optional. Markup is returned if render is false
   * @returns {undefined | string} Returns markup if render is false
   * @author: Prithvi
   * @todo Finish implementation
   */
  render(data, render = true) {
    // If query returns an empty array (meaning no results found for the query), we display an error msg
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM_obj = document
      .createRange()
      .createContextualFragment(newMarkup);

    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    const newElements = Array.from(newDOM_obj.querySelectorAll('*'));

    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];

      // // THIS UPDATES CHANGED TEXT VALUES
      // if (
      //   !newElement.isEqualNode(currentElement) &&
      //   newElement.firstChild?.nodeValue.trim() !== ''
      // ) {
      //   currentElement.textContent = newElement.textContent;
      // }

      // // THIS UPDATES CHANGED ATTRIBUTES
      // if (!newElement.isEqualNode(currentElement)) {
      //   Array.from(newElement.attributes).forEach(attr =>
      //     currentElement.setAttribute(attr.name, attr.value)
      //   );
      // }

      // CHECK IF THERE IS A DIFFERENCE
      if (!newElement.isEqualNode(currentElement)) {
        // CHECK IF THE TEXT VALUE NEEDS TO BE UPDATED
        if (newElement.firstChild?.nodeValue.trim() !== '')
          currentElement.textContent = newElement.textContent;

        // THIS UPDATES CHANGED ATTRIBUTES
        Array.from(newElement.attributes).forEach(attr =>
          currentElement.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
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
    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

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
    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clearParentElement() {
    this._parentElement.innerHTML = '';
  }
}
