import axios from "axios";
import {proxy, key} from "../config";
import Fraction from "fraction.js";
import {formatCount} from "../views/recipeView";

export default class Recipe {
    constructor (id){
        this.id = id
    }
    
    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;


        } catch (error) {
            console.log(error)
        }
    }
    
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    
    calcServings() {
        this.servings = 4;
    }
    
    parseIngredients () {
        // 5 cups of garlic powder
        const unitLong = ["tablespoons" , "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "cup", "pounds", "pound"];
        const unitShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "cup", "pound", "pound"];
        const units = [...unitShort, "kg", "g"]
        // el represent single ingredient in each iteration
        // map() returns array of results 
        const newIngredients = this.ingredients.map( el => {
            // Uniform units
            let ingredient = el.toLowerCase();
        // Change long to short
            
            unitLong.forEach((unit, i) => {

            // Replace will find the exact element equals to [i] to replace it with [i]
            // 1st loop tablespoons => tbsp (cant find tablespoons, nothing happens)
                ingredient = ingredient.replace(unit, unitShort[i])
            });
            
            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
                                                  
            // Parse ingredients into count, unit and ingredient
            // [4, 1/2 , "cups", "of", "onion"]
            const arrIng = ingredient.split(" ");
            // findindex(condition), returns index of the first element that satisfies condition
            // unitIndex returns 2
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            
            if (unitIndex > -1){
                // There is an unit of measurement
                // arrIng.slice(0,2)returns [4, 1/2]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    // if the count was only one number then count is the first element of array
                    count = arrIng[0].replace("-", "+");
                } else {
                    // eval() calculates and returns 4,5
                    count = eval(arrIng.slice(0, unitIndex).join("+"));
                }
                // count without value assigned => count
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    // ingredient starts after unit "of onions"
                    ingredient: arrIng.slice(unitIndex + 1).join(" ")
                };
                // if first element can be converted to a number
            } else if (parseInt(arrIng[0], 10)) {
                // No unit but 1st elemet is a number
                objIng = {
                    // 2 onions => count = 2
                       count: parseInt(arrIng[0], 10),
                       unit: "",
                       ingredient: arrIng.slice(1).join(" ")
                       }                 
            } else if (unitIndex === -1) {
                // There is no unit and no number in 1st position
                
                objIng = {
                    count: 1,
                    unit: "",
                    ingredient
                }
            }

            return objIng 
        });
        this.ingredients = newIngredients;
    }
    
    updateServings(type) {
        const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
        
        this.ingredients.forEach(ing => {
            // Ex: 1.5kg of carrot = 3 servings
            // New serving 5 =? 1.5 * 5 / 3 => count = 2.5
            let count2 = eval(ing.count);
            count2 *= (newServings / this.servings);
            ing.count = eval(count2);
        });
        
        this.servings = newServings;
    }
    
};
