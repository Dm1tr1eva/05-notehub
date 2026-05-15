import css from "../NoteList/NoteList.module.css";

interface CreateButtonProps {
  onClick: () => void;
}

export default function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <button className={css.button} onClick={onClick}>
      Create note +
    </button>
  );
}
