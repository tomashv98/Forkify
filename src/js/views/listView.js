import { elements } from "./base";

export const renderItem = item => {
    const markup = `
                <li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" min="0" step="${item.count}" class="shopping__count-value" >
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
`;
    elements.shopping.insertAdjacentHTML("beforeend", markup)
};

export const deleteItem = id => {
    // <li class="shopping__item data-itemid=${item.id}">
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
    
};


const minNo = input => {
    if (input.value < 0) input.value = 0;
    
}
// listView.js:12 The specified value "1/2" is not a valid number. The value must match to the following regular expression: -?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?
// onchange="minNo(this);"