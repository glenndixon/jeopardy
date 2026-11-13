import { useState } from "react";
import { HistoryModal } from "./HistoryModal";
import { NameModal } from "./NameModal";
import { PlayerButton } from "./PlayerButton";
import { scoreFor, useAwardHistory } from "./history";
import { defaultName, usePlayerNames } from "./playerNames";
import { playAwardSound, playSelectSound } from "./sound";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;
const BASE_VALUES = [200, 400, 600, 800, 1000];

const PLAYER_COUNTS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, i) => MIN_PLAYERS + i,
);

export function App() {
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);
  const [selected, setSelected] = useState(0);
  const [doubleJeopardy, setDoubleJeopardy] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [renaming, setRenaming] = useState<number | null>(null);
  const history = useAwardHistory();
  const names = usePlayerNames(MAX_PLAYERS);

  const multiplier = doubleJeopardy ? 2 : 1;
  const players = Array.from({ length: playerCount }, (_, i) => i);

  function changePlayerCount(count: number) {
    setPlayerCount(count);
    setSelected((current) => Math.min(current, count - 1));
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
        {players.map((player) => (
          <PlayerButton
            key={player}
            name={names.nameOf(player)}
            score={scoreFor(history.awards, player)}
            selected={player === selected}
            onSelect={() => {
              playSelectSound();
              setSelected(player);
            }}
            onLongPress={() => setRenaming(player)}
          />
        ))}
      </section>

      <section className="values" aria-label="Grant points">
        {BASE_VALUES.map((value) => {
          const amount = value * multiplier;
          return (
            <button
              key={value}
              className="value"
              onClick={() => {
                playAwardSound();
                history.award(selected, amount);
              }}
            >
              <span className="value-amount">${amount}</span>
            </button>
          );
        })}
      </section>

      <section className="row wrap">
        <button
          aria-pressed={doubleJeopardy}
          onClick={() => setDoubleJeopardy((on) => !on)}
        >
          Double Jeopardy: {doubleJeopardy ? "On" : "Off"}
        </button>
        <span className="spacer" />
        <button disabled={!history.canUndo} onClick={history.undo}>
          Undo
        </button>
        <button disabled={!history.canRedo} onClick={history.redo}>
          Redo
        </button>
        <button onClick={() => setHistoryOpen(true)}>History</button>
      </section>

      <HistoryModal
        open={historyOpen}
        awards={history.awards}
        nameOf={names.nameOf}
        onRemove={history.remove}
        onClose={() => setHistoryOpen(false)}
      />

      <NameModal
        player={renaming}
        currentName={renaming === null ? "" : names.nameOf(renaming)}
        placeholder={renaming === null ? "" : defaultName(renaming)}
        onSave={(name) => {
          if (renaming !== null) names.rename(renaming, name);
        }}
        onClose={() => setRenaming(null)}
      />
    </main>
  );
}
