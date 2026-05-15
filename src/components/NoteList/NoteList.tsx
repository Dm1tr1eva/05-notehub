import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  isDeleting?: string;
}

export default function NoteList({
  notes,
  onDelete,
  isDeleting,
}: NoteListProps) {
  if (notes.length === 0) {
    return null;
  }

  const handleDelete = (noteId: string) => {
    onDelete(noteId);
  };

  return (
    <ul className={css.list}>
      {/* Набір елементів списку нотаток */}
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={isDeleting === note.id}
            >
              {isDeleting === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
