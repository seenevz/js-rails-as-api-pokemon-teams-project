const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons/`;

//Tools
const parseJSON = (resp) => {
  console.log("this is the response from the server", resp);
  if (resp.ok) {
    return resp.json();
  } else {
    throw resp.json();
  }
};

const createElems = (...tags) => tags.map((tag) => document.createElement(tag));

// API calls

const fetchAllTrainers = () => fetch(TRAINERS_URL).then(parseJSON);

const postTrainerForPokemon = (trainer_id) =>
  fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trainer_id }),
  })
    .then(parseJSON)
    .catch((errorPromise) => errorPromise.then((msg) => alert(msg.error)));

const deletePokemonFetch = (id) =>
  fetch(POKEMONS_URL + id, {
    method: "DELETE",
  }).then(parseJSON);

// Event handlers

const handleAddPokemon = (ul, trainerId) => {
  postTrainerForPokemon(trainerId).then((p) => {
    console.log(p);
    appendPokemon(ul, p);
  });
};

const handleRemovePokemon = (li, pokemonId) => {
  deletePokemonFetch(pokemonId).then(() => li.remove());
};

// Page Render

const renderAllTrainers = (trainersArr) => {
  const mainDiv = document.querySelector("main");

  trainersArr.forEach((trainer) => {
    renderTrainerCard(mainDiv, trainer);
  });
};

const appendPokemon = (anchorElem, { id, nickname, species }) => {
  const [li, btn] = createElems("li", "button");

  li.innerText = `${nickname} (${species})`;
  btn.innerText = "Release";
  btn.className = "release";

  btn.addEventListener("click", () => handleRemovePokemon(li, id));
  li.append(btn);
  anchorElem.append(li);
};

const renderTrainerCard = (anchorDiv, { id, name, pokemons }) => {
  const [div, p, btn, ul] = createElems("div", "p", "button", "ul");

  div.className = "card";
  btn.innerText = "Add Pokemon";
  p.innerText = name;

  btn.addEventListener("click", () => handleAddPokemon(ul, id));

  pokemons.forEach((p) => appendPokemon(ul, p));

  div.append(p, btn, ul);
  anchorDiv.append(div);
};

//On page load
const run = () => {
  fetchAllTrainers().then(renderAllTrainers);
};

document.addEventListener("DOMContentLoaded", run);
