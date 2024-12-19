function handleActive(event, items) {
  // rip off active class from each item
  items.forEach((item) => {
    item.classList.remove("active");
  });

  // now add active class to clicked-item
  event.target.classList.add("active");
}

function handleAddToCart(e, cartBadge) {
  // access current cart value then convert to int
  let cartCount = parseInt(cartBadge.innerText);
  cartCount += 1;

  // change displayed cart value
  cartBadge.innerText = cartCount;

  // alert item added to cart
  alert("Item successfully added to cart!");
}

function handleClose(sections, procedureModal) {
  // grab x
  const closeModal = document.querySelector("#close-modal");

  // close
  closeModal.addEventListener("click", (e) => {
    // hide modal
    procedureModal.style.display = "none";

    // make all sections clear
    sections.forEach((section) => {
      section.style.filter = `blur(0px)`;
    });
  });
}

function handleBlur(sections) {
  // only modal will be visible clearly
  sections.forEach((section) => {
    section.style.filter = `blur(7px)`;
  });
}

function displayProcedureAsModal(steps) {
  // grab elements
  const sections = document.querySelectorAll("section");
  const procedureModal = document.querySelector("#procedure-modal");

  // create ol container
  const olsteps = document.createElement("ol");

  // iterate steps
  steps.forEach((step) => {
    // create li for each step
    const liStep = document.createElement("li");

    // manipulate dom
    liStep.innerHTML = step;

    // attach to ol
    olsteps.appendChild(liStep);
  });

  // attach ol to modal
  procedureModal.appendChild(olsteps);

  // display modal
  procedureModal.style.display = "block";

  // make background blurred
  handleBlur(sections);

  // close modal
  handleClose(sections, procedureModal);
}

function displayRecipeResults(data) {
  console.log(data);

  // grab element
  const searchResultsContainer = document.querySelector(
    "#search-results-container"
  );

  // empty to give way for subsequent search
  searchResultsContainer.innerHTML = "";

  // iterate fetched data
  data.forEach((result) => {
    // destructuring assignment
    const { image, name, cookTime, servings, steps } = result;

    // create div element for each hit/result
    const searchResult = document.createElement("div");

    // to style each div
    searchResult.classList.add("search-result");

    // manipulate dom
    searchResult.innerHTML = `
    <img src="${image}" alt="${name}"/>
    <p>${name}</p>
    <p>Cook Time: ${cookTime} minutes</p>
    <p>Servings: ${servings}</p>  
    <p id="procedure">Click to see procedure</p>  
    `;

    // attach to parent container
    searchResultsContainer.appendChild(searchResult);

    // grab procedure
    const procedure = searchResult.querySelector("p#procedure");

    // clicking procedure
    procedure.addEventListener("click", (e) => {
      displayProcedureAsModal(steps);
    });
  });
}

function bindUrlWithParams(url, params) {
  const queryString = new URLSearchParams(params).toString(); //e.g., "name=...&excludeIngredients=..."
  return `${url}?${queryString}`;
}

function fetchRecipes(searchValue, dietValue, excludeIngredientValue) {
  const urlApi = "https://low-carb-recipes.p.rapidapi.com/search";
  const queryParams = {
    name: searchValue,
    excludeIngredients: excludeIngredientValue,
    tags: dietValue,
  };

  // combine url with params
  const urlWithParams = bindUrlWithParams(urlApi, queryParams);

  // ! fetch API - all
  fetch(urlWithParams, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-RapidAPI-Key": config.API_KEY,
      "X-RapidAPI-Host": "low-carb-recipes.p.rapidapi.com",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // invoke upon receiving data
      displayRecipeResults(data);
    })
    .catch((err) => {
      // !reponse.ok/fetch error
      console.log(err);
    });
}

function recipeFormHandler(e) {
  // prevent default refresh behavior
  e.preventDefault();

  // grab user form input values
  const searchValue = document.querySelector("#recipe-name").value;
  const dietValue = document.querySelector("#diet").value;
  const excludeIngredientValue = document.querySelector(
    "#exclude-ingredient"
  ).value;

  // invoke to fetch recipes that match specified filters
  fetchRecipes(searchValue, dietValue, excludeIngredientValue);

  // clear form values upon submission
  e.target.reset();
}

function displaySelectDiets() {
  // grab element
  const select = document.querySelector("#diet");

  const options = [
    "Select tag",
    "beef-free",
    "chicken-free",
    "fish-free",
    "gluten-free",
    "keto",
    "kid-friendly",
    "lchf",
    "meal-plan-ok",
    "peanut-free",
    "pork-free",
    "relevant-meal-sides",
    "shellfish-free",
    "soy-free",
    "vegetarian",
    "wheat-free",
  ];

  // iterate options array
  options.forEach((value) => {
    // create option element for each item
    const option = document.createElement("option");

    // manipulate dom
    option.value = value;
    option.innerHTML = value;

    // attach each option to select
    select.appendChild(option);
  });
}

function handleDOMContentLoaded(e) {
  // grab elements
  const recipeForm = document.querySelector("#recipe-form");
  const btnsAddToCart = document.querySelectorAll(".card-btn");
  const cartBadge = document.querySelector("#cart-badge");
  const navLinks = document.querySelectorAll("#navigation-links .nav-link");
  const menuItems = document.querySelectorAll(".menu-item");

  // invoke to display options in select
  displaySelectDiets();

  // search for recipe
  recipeForm.addEventListener("submit", (e) => {
    recipeFormHandler(e);
  });

  // add to cart
  btnsAddToCart.forEach((btnAddToCart) => {
    // attaching addEventLister to each card-btn
    btnAddToCart.addEventListener("click", (e) => {
      handleAddToCart(e, cartBadge);
    });
  });

  // clicking a nav link
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", (e) => {
      handleActive(e, navLinks);
    });
  });

  // clicking a menu-item
  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", (e) => {
      handleActive(e, menuItems);
    });
  });
}

// wait HTML to load first
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
