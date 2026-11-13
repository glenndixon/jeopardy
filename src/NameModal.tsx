import { useEffect, useRef, useState, type RefObject } from "react";

interface Props {
  /** The player being renamed, or null when the modal is closed. */
  player: number | null;
  currentName: string;
  placeholder: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export function NameModal({
  player,
  currentName,
  placeholder,
  onSave,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = player !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Focus the field with the old name selected, so typing replaces it.
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="name-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Mounted fresh each time the modal opens, so the field always
          starts from the player's current name. */}
      {open && (
        <NameForm
          inputRef={inputRef}
          initialName={currentName}
          placeholder={placeholder}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </dialog>
  );
}

interface FormProps {
  inputRef: RefObject<HTMLInputElement | null>;
  initialName: string;
  placeholder: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

function NameForm({
  inputRef,
  initialName,
  placeholder,
  onSave,
  onClose,
}: FormProps) {
  const [name, setName] = useState(initialName);

  return (
    <form
      className="modal-body name-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(name);
        onClose();
      }}
    >
      <h2 id="name-title">Player name</h2>
      <input
        ref={inputRef}
        className="name-input"
        aria-label="Player name"
        value={name}
        placeholder={placeholder}
        maxLength={20}
        autoComplete="off"
        enterKeyHint="done"
        onChange={(event) => setName(event.target.value)}
      />
      <div className="row name-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary">
          Save
        </button>
      </div>
    </form>
  );
}
