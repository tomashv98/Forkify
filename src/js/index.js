// Global app controller
// bd9a5ac79666f5506a37d7723719a471
// https://www.food2fork.com/api/search

import Search from "./models/Search";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as likesView from "./views/likesView"
import Recipe from "./models/Recipe";
import * as recipeView from "./views/recipeView";
import List from "./models/List";
import * as listView from "./views/listView";
import Likes from "./models/Likes";
import Fraction from "fraction.js";


const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();
    // const query = "pizza";
    
    if (query) {
        // Add search property to state object, item = queried item
        state.search = new Search(query)

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearRes();
        renderLoader(elements.searchRes)
        
        try {
        // Search for recipes
        await state.search.getResult();
        
        // Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);            
        } catch (error) {
            console.log(error)
            clearLoader();
        }
    }
}

 elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearRes();
        searchView.renderResults(state.search.result, goToPage);
    }
});

const controlRecipe = async () => {
    // Ex domain/#123456
    // #123456 extracted, then # is replaced with empty to return clean number
    
    const id = window.location.hash.replace("#", "");
    console.log(id);
    
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        // Highlight item
        if (state.search){
            searchView.highlightSelected(id);
        };
        // Create new recipe object
        state.recipe = new Recipe(id);
        
        
        try {
        // Get recipe data
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        
        // Calculate servings and time
        state.recipe.calcServings();
        state.recipe.calcTime();
        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        window.r = state.recipe.ingredients;   
    
        } catch (error) {
            console.log(error)
        }
    }
};

// Add listener for both events
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe))


const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();
    
    // Add each ingredient 
    state.recipe.ingredients.forEach(el => {
    
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);

    });
};

state.likes = new Likes ();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {

    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to the UI list
    likesView.renderLike(newLike);
    } else {
        // Remove like from state
    state.likes.deleteLike(currentID);
        // Toggle like button
    likesView.toggleLikeBtn(false);
        // Remove like from UI
    likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

}

elements.shopping.addEventListener("click", e => {
   const id = e.target.closest(".shopping__item").dataset.itemid ;
   if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        
        state.list.deleteItem(id);
        
        listView.deleteItem(id);
    } else if (e.target.matches(".shopping__count-value")){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
        
    }
    
});



// Handling servings click
elements.recipe.addEventListener("click",  => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
        state.recipe.updateServings("dec")
        if (state.recipe.servings > 1 ) {
            recipeView.updateServIng(state.recipe)
        }
        
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
        state.recipe.updateServings("inc")
        recipeView.updateServIng(state.recipe);
        console.log(state.recipe)
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        
        controlList()
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        controlLike()
    }
});

window.addEventListener("load", () => {
    state.iles = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach( like => likesView.renderLike(like))
});