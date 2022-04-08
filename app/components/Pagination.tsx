import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { useCallback } from "react";

interface IPagination {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  pageSize,
  totalPage,
  onChange,
}: IPagination) => {
  const firstPage = currentPage === 1;
  const lastPage = currentPage === totalPage;
  const middlePosition = Math.floor(pageSize / 2); // 중간 페이지

  // 시작 페이징
  const getStartPage = () => {
    // 현재 페이지가 1이면 1을 return
    if (
      currentPage > pageSize - middlePosition &&
      currentPage < totalPage - middlePosition
    ) {
      return currentPage - middlePosition;
    }

    // 페이지 리스트의 가운데 수를 넘어가면 다음 페이지 보임
    if (currentPage >= totalPage - middlePosition) {
      return totalPage - pageSize + 1;
    }

    return 1;
  };

  // 첫번째 페이지로 이동
  const goFirstPage = useCallback(() => {
    if (!firstPage) {
      onChange(1);
    }
  }, [firstPage, onChange]);

  // 마지막 페이지로 이동
  const goLastPage = useCallback(() => {
    if (!lastPage) {
      onChange(totalPage);
    }
  }, [totalPage, onChange, lastPage]);

  // 이전 페이지로 이동
  const goPrevPage = useCallback(() => {
    if (!firstPage) {
      onChange(currentPage - 1);
    }
  }, [firstPage, currentPage, onChange]);

  // 다음 페이지로 이동
  const goNextPage = useCallback(() => {
    if (!lastPage) {
      onChange(currentPage + 1);
    }
  }, [lastPage, currentPage, onChange]);

  // 페이지 목록 생성
  const generatePageList = (startPage: number, length: number) => {
    // 얕은 복사
    return Array.from({ length }, (value, index) => index + startPage);
  };

  const pageList = generatePageList(getStartPage(), pageSize);

  return (
    <div className="flex flex-wrap items-center justify-start space-x-2 pagination">
      <button
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        onClick={goFirstPage}
      >
        <ChevronDoubleLeftIcon className="w-5" />
      </button>
      <button
        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        onClick={goPrevPage}
      >
        <ChevronLeftIcon className="w-5" />
      </button>

      {pageList.map((page) => (
        <button
          key={page}
          onClick={(event) => {
            event.preventDefault();
            onChange(page);
          }}
          className={`${
            page === currentPage
              ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          } relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md cursor-pointer`}
        >
          {page}
        </button>
      ))}

      <button
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        onClick={goNextPage}
      >
        <ChevronRightIcon className="w-5" />
      </button>
      <button
        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        onClick={goLastPage}
      >
        <ChevronDoubleRightIcon className="w-5" />
      </button>
    </div>
  );
};

export default Pagination;
