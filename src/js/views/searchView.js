import {elements} from "./base";
export const clearInput = () => {
    elements.searchInput.value = "";
};
export const clearRes = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll(".results_link"));
    resultsArr.forEach(el => {
        el.classlist.remove(".results__link--active")
    });
     document.querySelector(`.results__link[href="#${id}"]`).classList.add(".results__link--active")
};

/* Explaing function limitTitle
reduce() method reduces array to single value
newTitle starts as empty array
Ex: title = Chicken soup with potato
title.split(" ") => ["Chicken", "soup", "with". "potato"]
acc is total letter
acc: 0 => acc + chicken.length = 6 / newTitle.push("Chicken") => newTitle = ["Chicken"], returns acc = 6
acc: 6 => acc + soup.length = 10 => newTitle = ["Chicken", "soup"] => returns acc = 10
acc: 10 => acc + with.length = 14 => newTitle = ["Chicke", "soup", "with"] => returns acc = 14
acc: 14 => acc = potato.length = 18 => loop ends => returns newTitle = ...
join() converts array into a string
*/

export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    
    if (title.length > limit) {
        title.split(" ").reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(" ")} ...`;
    }
};

/*
Another method that takes into account spaces
newTitle as an empty string


const limitTitle2 = (title, limit = 17) => {
    if (title.length > limit) {
        let newTitle = '';
        title.split(' ').forEach((el) => {
            const newToken = newTitle.length === 0 ? el : ' ' + el;
            if (newTitle.length + newToken.length <= limit) {
                newTitle += newToken;
            }
        });
        return `${newTitle} ...`;
    } else {
        return title;
    }
};

*/

const renderRecipe = recipe => {
    const markup = `
              <li>
                <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitTitle(recipe.title)} </h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
`;
    elements.searchResList.insertAdjacentHTML("beforeend", markup)
    
}

export const getInput = () => elements.searchInput.value;

const createBut = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page -1 : page +1}>
                   <span>Page ${type === "prev" ? page -1 : page +1}</span>                    
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
                    </svg>
                </button>
`;

const renderButtons = (page, numRes, resPerPage) => {
  const pages = Math.ceil(numRes / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
      button = createBut(page, "next")
   
  } else if (page < pages) {
      button = `
          ${createBut(page, "next")}
          ${createBut(page, "prev")}
`
  } else if (page === pages && page > 1) {
      button = createBut(page, "prev")
  }
    elements.searchResPages.insertAdjacentHTML("afterbegin", button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1 ) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage)
};