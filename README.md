# React Interview App

## Prerequisites

Ensure that you have [Node.js](https://nodejs.org/en/download/) installed on your machine.

## Installation

Follow the steps below to set up the project on your local machine:

1. Update npm to the latest version: Run `npm install -g npm`
2. Clone this repository: Run `git clone <repository_url>`
3. Navigate into the cloned repository: Run `cd <repository_name>`
4. Install the project dependencies: Run `npm install`
5. Start the project: Run `npm start`
6. View the running application: Load `http://localhost:3000/` in your web browser

## Implemented Solution

The basic part of the solution is a new Functional Component called `PokemonFetcher`. In a `useEffect` hook all the required information about the Pokemons are fetched in a sequence of API calls. First, a number of Pokemons are retrieved by calling `GET "https://pokeapi.co/api/v2/pokemon/?limit=100"`. Two random Pokemons are selected by using the helper function `getRandomPokemons`. Then by using the url for each Pokemon other details such as the sprite(s), etc. are fetched. Eventually, the moves are fetched for each Pokemon and the first move is selected for the battle.

We used _states_ for keeping the fetched Pokemon details in memory.

The names, sprites, moves, powers and other information are displayed and a `Start Battle` button is presented to the user. A simple logic for determining the winner is also implemented which outputs a proper message based on the fetched information.
