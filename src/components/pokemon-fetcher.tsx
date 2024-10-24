import React, { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}

interface Move {
  name: string;
  url: string;
  power: number | null;
}

interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  moves: Move[];
}

const PokemonFetcher: React.FC = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [battleMessage, setBattleMessage] = useState<string>("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?limit=100"
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error fetching Pokemons: ${response.status} ${errorText}`
          );
        }
        const data = await response.json();

        const randomPokemons = getRandomPokemons(data.results, 2);

        const pokemonDetailsPromises = randomPokemons.map((pokemon: Pokemon) =>
          fetch(pokemon.url).then(async (res) => {
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(
                `Error fetching Pokemon details: ${res.status} ${errorText}`
              );
            }
            return res.json();
          })
        );
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);

        const detailedPokemons = await Promise.all(
          pokemonDetails.map(async (pokemon) => {
            const movesWithPowerPromises = pokemon.moves.map(
              async (moveEntry: any) => {
                const move = moveEntry.move;
                const moveResponse = await fetch(move.url);
                if (!moveResponse.ok) {
                  const errorText = await moveResponse.text();
                  console.error(
                    `Failed to fetch move details for ${move.name}: ${moveResponse.status} ${errorText}`
                  );
                  return { name: move.name, url: move.url, power: null };
                }

                try {
                  const moveData = await moveResponse.json();
                  const power = moveData.power ?? null;

                  return {
                    name: move.name,
                    url: move.url,
                    power: power,
                  };
                } catch (jsonError) {
                  console.error(
                    `Error parsing JSON for move: ${move.name}`,
                    jsonError
                  );
                  return { name: move.name, url: move.url, power: null };
                }
              }
            );

            const movesWithPower = await Promise.all(movesWithPowerPromises);
            return {
              ...pokemon,
              moves: movesWithPower,
            };
          })
        );

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchPokemon();
  }, []);

  const getRandomPokemons = (pokemons: Pokemon[], count: number) => {
    const shuffled = [...pokemons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleStartBattle = () => {
    if (pokemons.length === 2) {
      const power1 = pokemons[0].moves[0]?.power;
      const power2 = pokemons[1].moves[0]?.power;

      if (power1 !== null && power2 !== null) {
        if (power1 > power2) {
          setBattleMessage(
            `${pokemons[0].name} beat ${pokemons[1].name} with ${pokemons[0].moves[0]?.name} (Power: ${power1})`
          );
        } else if (power1 < power2) {
          setBattleMessage(
            `${pokemons[1].name} beat ${pokemons[0].name} with ${pokemons[1].moves[0]?.name} (Power: ${power2})`
          );
        } else {
          setBattleMessage(`Both Pokemons have the same power.`);
        }
      } else {
        setBattleMessage(`One of the Pokemons doesn't have a valid power.`);
      }
    }
  };

  return (
    <div>
      <h1>Pokemon Battle</h1>
      <div
        style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}
      >
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.name}
            style={{ textAlign: "center", flex: 1, margin: "0 10px" }}
          >
            <h2>{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>
              Number of Moves: <strong>{pokemon.moves.length}</strong>
            </p>
            {pokemon.moves.length > 0 && (
              <div>
                <p>
                  First Move: <strong>{pokemon.moves[0]?.name}</strong>
                </p>
                <p>
                  Power:{" "}
                  <strong>
                    {pokemon.moves[0]?.power !== null
                      ? pokemon.moves[0]?.power
                      : "N/A"}
                  </strong>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          border: "1px solid #ccc",
          textAlign: "center",
        }}
      >
        <button
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={handleStartBattle}
        >
          Start Battle
        </button>
        {battleMessage && (
          <p style={{ marginTop: "20px", fontWeight: "bold" }}>
            {battleMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default PokemonFetcher;
