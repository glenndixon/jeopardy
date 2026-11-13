import { useState } from "react";

const STORAGE_KEY = "jeopardy.playerNames";

/** Custom names by player index; an empty string means "use the default". */
function load(playerCount: number): string[] {
  const names = Array<string>(playerCount).fill("");
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(stored)) {
      for (let i = 0; i < playerCount; i++) {
        if (typeof stored[i] === "string") names[i] = stored[i];
      }
    }
  } catch {
    // Unreadable or blocked storage: fall back to the default names.
  }
  return names;
}

function save(names: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch {
    // Storage is unavailable (e.g. private browsing); names last until refresh.
  }
}

export function defaultName(player: number): string {
  return `Player ${player + 1}`;
}

/** Player names, saved to local storage so they survive a refresh. */
export function usePlayerNames(playerCount: number) {
  const [names, setNames] = useState(() => load(playerCount));

  return {
    nameOf: (player: number) => names[player] || defaultName(player),
    /** Renames a player; a blank name restores the default. */
    rename: (player: number, name: string) => {
      const next = names.map((current, i) =>
        i === player ? name.trim() : current,
      );
      setNames(next);
      save(next);
    },
  };
}
