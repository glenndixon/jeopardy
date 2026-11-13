import { useEffect, useRef } from "react";

const LONG_PRESS_MS = 500;

interface Props {
  name: string;
  score: number;
  selected: boolean;
  onSelect: () => void;
  /** Called when the button is pressed and held. */
  onLongPress: () => void;
}

export function PlayerButton({
  name,
  score,
  selected,
  onSelect,
  onLongPress,
}: Props) {
  const timer = useRef<number | undefined>(undefined);
  // Set when a press turned into a long press, so the click that follows
  // releasing it doesn't also select the player.
  const longPressed = useRef(false);

  function cancel() {
    window.clearTimeout(timer.current);
    timer.current = undefined;
  }

  useEffect(() => cancel, []);

  return (
    <button
      className="player"
      aria-pressed={selected}
      onPointerDown={(event) => {
        longPressed.current = false;
        if (event.button !== 0) return;
        cancel();
        timer.current = window.setTimeout(() => {
          longPressed.current = true;
          onLongPress();
        }, LONG_PRESS_MS);
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      // Long-pressing on a touch screen would otherwise open the system menu.
      onContextMenu={(event) => {
        if (timer.current !== undefined || longPressed.current) {
          event.preventDefault();
        }
      }}
      onClick={() => {
        if (longPressed.current) {
          longPressed.current = false;
          return;
        }
        onSelect();
      }}
    >
      <span className="player-name">{name}</span>
      <span className="player-score">${score.toLocaleString()}</span>
    </button>
  );
}
