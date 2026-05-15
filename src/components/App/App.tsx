import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import CreateButton from "../CreateButton/CreateButton";
import { fetchNotes } from "../../services/noteService";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const NOTES_PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    placeholderData: keepPreviousData,
  });

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

  const pageCount = notesData?.totalPages ?? 0;

  return (
    <div className={css.app}>
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

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error: {error?.message}</p>}

        {notesData && <NoteList notes={notesData.notes} />}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
