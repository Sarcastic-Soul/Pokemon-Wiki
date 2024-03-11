let searchBtn = document.getElementById("search-button");
let searchBox = document.querySelector(".search-bar input")
let pokemonSprite = document.querySelector(".sprite img")
let descPara = document.querySelector(".summary p");
let pokedexNum = document.querySelector(".pokedex-id");
let pokemonName = document.querySelector(".pokemon-name");
let type1 = document.getElementById("type-1");

//Accessing Statpoints
let hpNum = document.getElementById("hp-num");
let attackNum = document.getElementById("attack-num");
let defenceNum = document.getElementById("defence-num");
let specialAttackNum = document.getElementById("special-attack-num");
let specialDefenceNum = document.getElementById("special-defence-num");
let speedNum = document.getElementById("speed-num");

//Accessing StatGraph
let hpBar = document.querySelector(".bar-6");
let attackBar = document.querySelector(".bar-5");
let defenceBar = document.querySelector(".bar-4");
let specialAttackBar = document.querySelector(".bar-3");
let specialDefenceBar = document.querySelector(".bar-2");
let speedBar = document.querySelector(".bar-1");

const typeColors = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
};

const url = "https://pokeapi.co/api/v2/pokemon/";

let getPokemon = (name) => {
    const finalUrl = url + name.toLowerCase();
    fetch(finalUrl)
        .then((response) => {
            if (!response.ok) {
                alert("Invalid Name");
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);  // data log
            showCard(data);
        }).catch(error => {
            console.error('Error:', error);
        });
}

async function getPokemonSummary(data, index) {
    let finalUrl = data.species.url;
    try {
        const response = await fetch(finalUrl);
        const desc = await response.json();
        // console.log(desc.flavor_text_entries);
        let summary = await desc.flavor_text_entries[index].flavor_text.replace(/\n/g, ' ');
        return summary;
    } catch (error) {
        console.error('Error:', error);
    }
}

let appendTypes = (types) => {
    types.forEach((item) => {
        let span = document.createElement("SPAN");
        span.setAttribute('id', `type-${item.slot}`);
        span.textContent = item.type.name[0].toUpperCase() + item.type.name.slice(1);
        console.log(span.textContent)
        span.style.backgroundColor = typeColors[item.type.name]
        document.querySelector(".types").appendChild(span);
    });
};

let appendAbility = (abilities) => {
    document.querySelector("#ability").innerHTML = '';
    abilities.forEach((item) => {
        let div = document.createElement("div");
        div.textContent = item.ability.name[0].toUpperCase() + item.ability.name.slice(1);
        console.log(div.textContent)
        document.querySelector("#ability").appendChild(div);
    });
};

let updateStats = (data) => {
    hpNum.innerText = data.stats[0].base_stat;        //updateStatsNum
    attackNum.innerText = data.stats[1].base_stat;
    defenceNum.innerText = data.stats[2].base_stat;
    specialAttackNum.innerText = data.stats[3].base_stat;
    specialDefenceNum.innerText = data.stats[4].base_stat;
    speedNum.innerText = data.stats[5].base_stat;

    hpBar.style.width = `${hpNum.innerText / 255 * 100}%`;
    attackBar.style.width = `${attackNum.innerText / 255 * 100}%`;
    defenceBar.style.width = `${defenceNum.innerText / 255 * 100}%`;
    specialAttackBar.style.width = `${specialAttackNum.innerText / 255 * 100}%`;
    specialDefenceBar.style.width = `${specialDefenceNum.innerText / 255 * 100}%`;
    speedBar.style.width = `${speedNum.innerText / 255 * 100}%`;
}


let showCard = (data) => {
    console.log(data.name[0].toUpperCase() + data.name.slice(1));

    pokedexNum.innerText = `#${data.id}`  //PokedexNumber

    let sprite = data.sprites.other.dream_world.front_default;     //PokemonSprite
    pokemonSprite.src = sprite;

    pokemonName.innerText = data.name[0].toUpperCase() + data.name.slice(1);  //PokemonName

    appendTypes(data.types);  //Pokemon type

    (async () => {
        descPara.innerText = await getPokemonSummary(data, 10);     //PokemonDescription
    })();

    updateStats(data);  // Update Pokemon Stats

    appendAbility(data.abilities);  // Pokemon Ability
}

searchBtn.addEventListener("click", () => {
    document.querySelector(".types").innerHTML = '';
    getPokemon(searchBox.value);
})

window.addEventListener("load", getPokemon("charizard"));


/* Warning searchbox test  */


const pokemonInput= document.querySelector('input');
const suggestionList = document.querySelector(".list");

pokemonInput.addEventListener('input', async (event) => {
    const userInput = event.target.value.toLowerCase(); // Get the user's input in lowercase
    console.log(userInput);

    if (userInput.length > 0) {
        const suggestions = await fetchPokemonSuggestions(userInput); // Fetch suggestions based on input
        updateSuggestionList(suggestions); // Update the suggestion list in the UI
    } else {
        suggestionList.innerHTML = ''; // Clear the suggestion list if input is empty
    }
});

async function fetchPokemonSuggestions(userInput) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649'); // Fetch a limited number of Pokémon
    const data = await response.json();
    const pokemonList = data.results;

    return pokemonList.filter((pokemon) => pokemon.name.toLowerCase().startsWith(userInput));
}

function updateSuggestionList(suggestions) {
    suggestionList.innerHTML = ''; // Clear the list before updating

    if (suggestions.length > 0) {
        suggestions.forEach((suggestion) => {
            const listItem = document.createElement('div');
            listItem.classList.add("autocomplete-items");
            listItem.textContent = suggestion.name;
            listItem.addEventListener('click', () => {
                pokemonInput.value = suggestion.name; // Set the selected suggestion as the input value
                suggestionList.innerHTML = ''; // Hide the suggestion list after selection
            });
            suggestionList.appendChild(listItem);
        });

        document.body.appendChild(suggestionList); // Append the suggestion list to the body (adjust placement as needed)
    } else {
        // Handle case where no suggestions are found (optional: display a message)
    }
}
