import { useState } from "react";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;
const BASE_VALUES = [200, 400, 600, 800, 1000];

const PLAYER_COUNTS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, i) => MIN_PLAYERS + i,
);

export function App() {
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);
  // Scores are kept for all possible players so changing the player count
  // never discards anyone's score.
  const [scores, setScores] = useState<number[]>(() =>
    Array(MAX_PLAYERS).fill(0),
  );
  const [selected, setSelected] = useState(0);
  const [doubleJeopardy, setDoubleJeopardy] = useState(false);

  const multiplier = doubleJeopardy ? 2 : 1;

  function changePlayerCount(count: number) {
    setPlayerCount(count);
    setSelected((current) => Math.min(current, count - 1));
  }

  function grant(amount: number) {
    setScores((current) =>
      current.map((score, i) => (i === selected ? score + amount : score)),
    );
  }

  return (
    <main className="app">
      <h1>Jeopardy Scores</h1>

      <section className="row" aria-label="Number of players">
        <span className="label">Players</span>
        {PLAYER_COUNTS.map((count) => (
          <button
            key={count}
            className="small"
            aria-pressed={count === playerCount}
            onClick={() => changePlayerCount(count)}
          >
            {count}
          </button>
        ))}
      </section>

      <section className="players" aria-label="Select a player">
        {scores.slice(0, playerCount).map((score, i) => (
          <button
            key={i}
            className="player"
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            <span className="player-name">Player {i + 1}</span>
            <span className="player-score">${score.toLocaleString()}</span>
          </button>
        ))}
      </section>

      <section className="values" aria-label="Grant points">
        {BASE_VALUES.map((value) => {
          const amount = value * multiplier;
          return (
            <button key={value} className="value" onClick={() => grant(amount)}>
              ${amount.toLocaleString()}
            </button>
          );
        })}
      </section>

      <button
        className="double"
        aria-pressed={doubleJeopardy}
        onClick={() => setDoubleJeopardy((on) => !on)}
      >
        Double Jeopardy: {doubleJeopardy ? "On" : "Off"}
      </button>
    </main>
  );
}
