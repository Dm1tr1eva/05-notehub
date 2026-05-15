// import { useState } from 'react'
import { useMemo, useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import CreateButton from "../CreateButton/CreateButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteRequest,
} from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

// ============ KONSTANTEN ============
const NOTES_PER_PAGE = 12;

// ============ TYPES ============
interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

// ============ COMPONENTS ============
export default function App() {
  // ============ STATE ============
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | undefined>();

  // ========== QUERY CLIENT ==========
  const queryClient = useQueryClient();

  // ========== QUERIES & MUTATIONS ==========
  const {
    data: notesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: NOTES_PER_PAGE,
        search: searchQuery || undefined,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: (noteData: CreateNoteRequest) => createNote(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setCurrentPage(1);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(undefined);
    },
  });

  // ========== CALLBACKS ==========
  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, 500);

  const handleSearch = (text: string) => {
    debouncedSearch(text);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber + 1);
  };

  const handleCreateNote = async (values: NoteFormValues) => {
    await createNoteMutation.mutateAsync(values);
  };

  const handleDeleteNote = (noteId: string) => {
    setDeletingId(noteId);
    deleteNoteMutation.mutate(noteId);
  };

  // ========== CALCULATIONS ==========
  const pageCount = useMemo(() => {
    if (!notesData) {
      return 0;
    }

    return Math.ceil(notesData.totalCount / NOTES_PER_PAGE);
  }, [notesData]);

  // ========== RENDER ==========
  return (
    <div className={css.app}>
      {/* ==================== HEADER ==================== */}
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {pageCount > 1 && (
          <Pagination
            currentPage={currentPage - 1}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        )}
        <CreateButton onClick={() => setIsModalOpen(true)} />
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error: {error?.message}</p>}

        {notesData && (
          <NoteList
            notes={notesData.notes}
            onDelete={handleDeleteNote}
            isDeleting={deletingId}
          />
        )}
      </main>

      {/* ==================== MODAL ==================== */}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createNoteMutation.isPending}
        />
      </Modal>
    </div>
  );
}
