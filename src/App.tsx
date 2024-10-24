import React from "react";
import logo from "./logo.svg";
import "./App.css";
import PokemonFetcher from "./components/pokemon-fetcher";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PokemonFetcher />
      </header>
    </div>
  );
}

export default App;
