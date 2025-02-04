/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById('games-container');

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for (const gameObj of games) {
        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        const dollarPledged = gameObj.pledged.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        const dollarGoal = gameObj.goal.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        gameCard.innerHTML = `
            <img class="game-img" src="${gameObj.img}" alt="${gameObj.name}" />
            <h3>${gameObj.name}</h3>
            <p>${gameObj.description}</p>
            <p><strong>${dollarPledged}</strong> pledged of ${dollarGoal} goal</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById('num-contributions');

// use reduce() to count the number of total contributions by summing the backers. (NOTE implicit return)
const totalContributions = GAMES_JSON.reduce(
    (totalBackers, gameObj) => totalBackers + gameObj.backers,
    0
);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const totalContributionsFormatted = totalContributions.toLocaleString('en-US');
contributionsCard.innerHTML = `${totalContributionsFormatted}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById('total-raised');
const totalRaised = GAMES_JSON.reduce(
    (totalPledged, gameObj) => totalPledged + gameObj.pledged,
    0
);

// set inner HTML using template literal
const totalRaisedFormatted = totalRaised.toLocaleString('en-US');
raisedCard.innerHTML = `$${totalRaisedFormatted}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById('num-games');
const totalGames = GAMES_JSON.length;

const totalGamesFormatted = totalGames.toLocaleString('en-US');
gamesCard.innerHTML = `${totalGamesFormatted}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGamesArr = GAMES_JSON.filter(
        (gameObj) => gameObj.pledged < gameObj.goal
    );

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGamesArr);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGamesArr = GAMES_JSON.filter(
        (gameObj) => gameObj.pledged >= gameObj.goal
    );

    // use the function we previously created to add the funded games to the DOM
    addGamesToPage(fundedGamesArr);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById('unfunded-btn');
const fundedBtn = document.getElementById('funded-btn');
const allBtn = document.getElementById('all-btn');

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById('description-container');

// use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(
    (gameObj) => gameObj.pledged < gameObj.goal
).length;

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaisedFormatted} has been raised for ${totalGamesFormatted} ${
    totalGames === 1 ? 'game' : 'games'
}. Currently, ${unfundedGamesCount} ${
    unfundedGamesCount === 1 ? 'game remains' : 'games remain'
} unfunded.${
    unfundedGamesCount > 0
        ? ` We need your help to fund ${
              unfundedGamesCount === 1
                  ? 'this amazing game'
                  : 'these amazing games'
          }!`
        : ''
}`;

// create a new DOM element containing the template string and append it to the description container
const statsPara = document.createElement('p');
statsPara.innerHTML = displayStr;
descriptionContainer.appendChild(statsPara);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById('first-game');
const secondGameContainer = document.getElementById('second-game');

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, runnerUpGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGamePara = document.createElement('p');
topGamePara.innerHTML = `${topGame.name}`;
firstGameContainer.appendChild(topGamePara);

// do the same for the runner up item
const runnerUpGamePara = document.createElement('p');
runnerUpGamePara.innerHTML = `${runnerUpGame.name}`;
secondGameContainer.appendChild(runnerUpGamePara);

/************************************************************************************
 * BONUS: Additional functionalities
 * 1) Top nav bar button
 * 2) Back-to-top button
 */

// 1) Top nav bar button to jump to Our Game section quickly
const ourGamesBtn = document.getElementById('our-games-btn');
const ourGamesDiv = document.getElementById('button-container');
ourGamesBtn.addEventListener('click', () =>
    ourGamesDiv.scrollIntoView({ behavior: 'smooth' })
);

// 2) Back-to-top button to return to top of page quickly
const backToTopBtn = document.getElementById('back-to-top-btn');
window.addEventListener('scroll', () => {
    window.scrollY > 500
        ? (backToTopBtn.style.display = 'block')
        : (backToTopBtn.style.display = 'none');
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
