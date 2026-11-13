import { useEffect, useRef } from "react";
import type { Award } from "./history";

interface Props {
  open: boolean;
  awards: Award[];
  onRemove: (id: number) => void;
  onClose: () => void;
}

export function HistoryModal({ open, awards, onRemove, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="history"
      aria-labelledby="history-title"
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="history-body">
        <header className="history-header">
          <h2 id="history-title">History</h2>
          <button className="small" onClick={onClose}>
            Close
          </button>
        </header>

        {awards.length === 0 ? (
          <p className="history-empty">No points awarded yet.</p>
        ) : (
          <ol className="history-list">
            {awards.map((award, i) => (
              <li key={award.id}>
                <span className="history-index">{i + 1}.</span>
                <span>Player {award.player + 1}</span>
                <span className="history-amount">
                  ${award.amount.toLocaleString()}
                </span>
                <button
                  className="small delete"
                  aria-label={`Delete award ${i + 1}: $${award.amount.toLocaleString()} to Player ${award.player + 1}`}
                  onClick={() => onRemove(award.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </dialog>
  );
}
