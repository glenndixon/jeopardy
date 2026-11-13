import { useReducer } from "react";

export interface Award {
  id: number;
  /** Zero-based player index. */
  player: number;
  amount: number;
}

interface HistoryState {
  /** Earlier versions of the award list, oldest first. */
  past: Award[][];
  awards: Award[];
  /** Undone versions of the award list, most recently undone first. */
  future: Award[][];
  nextId: number;
}

type HistoryAction =
  | { type: "award"; player: number; amount: number }
  | { type: "remove"; id: number }
  | { type: "undo" }
  | { type: "redo" };

const initialState: HistoryState = {
  past: [],
  awards: [],
  future: [],
  nextId: 1,
};

/** Replace the award list with a new version, making the change undoable. */
function commit(state: HistoryState, awards: Award[]): HistoryState {
  return {
    ...state,
    past: [...state.past, state.awards],
    awards,
    future: [],
  };
}

function reducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "award": {
      const award: Award = {
        id: state.nextId,
        player: action.player,
        amount: action.amount,
      };
      return {
        ...commit(state, [...state.awards, award]),
        nextId: state.nextId + 1,
      };
    }
    case "remove": {
      const awards = state.awards.filter((award) => award.id !== action.id);
      return awards.length === state.awards.length
        ? state
        : commit(state, awards);
    }
    case "undo": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        ...state,
        past: state.past.slice(0, -1),
        awards: previous,
        future: [state.awards, ...state.future],
      };
    }
    case "redo": {
      const [next, ...future] = state.future;
      if (!next) return state;
      return {
        ...state,
        past: [...state.past, state.awards],
        awards: next,
        future,
      };
    }
  }
}

export function useAwardHistory() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    awards: state.awards,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    award: (player: number, amount: number) =>
      dispatch({ type: "award", player, amount }),
    remove: (id: number) => dispatch({ type: "remove", id }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
  };
}

export function scoreFor(awards: Award[], player: number): number {
  return awards.reduce(
    (total, award) => (award.player === player ? total + award.amount : total),
    0,
  );
}
