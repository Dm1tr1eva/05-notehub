import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({
  //   currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
    // 
  if (pageCount <= 1) {
    return null;
  }

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousClassName={css.previous}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}
