import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { useCallback } from "react";

interface IPagination {
  controlledPageIndex: number;
  controlledPageSize: number;
  totalPage: number;
  setPageIndex: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

const Pagination = ({
  controlledPageIndex,
  controlledPageSize,
  totalPage,
  setPageIndex,
  setPageSize,
}: IPagination) => {
  const firstPage = controlledPageIndex === 1;
  const lastPage = controlledPageIndex === totalPage;
  const middlePosition = Math.floor(controlledPageSize / 2); // 중간 페이지

  // 시작 페이징
  const getStartPage = () => {
    // 현재 페이지가 1이면 1을 return
    if (
      controlledPageIndex > controlledPageSize - middlePosition &&
      controlledPageIndex < totalPage - middlePosition
    ) {
      return controlledPageIndex - middlePosition;
    }

    // 페이지 리스트의 가운데 수를 넘어가면 다음 페이지 보임
    if (controlledPageIndex >= totalPage - middlePosition) {
      return totalPage - controlledPageSize + 1;
    }

    return 1;
  };

  // 첫번째 페이지로 이동
  const goFirstPage = useCallback(
    (page) => {
      if (!firstPage) {
        setPageIndex(page);
      }
    },
    [firstPage, setPageIndex]
  );

  // 마지막 페이지로 이동
  const goLastPage = useCallback(
    (page) => {
      if (!lastPage) {
        setPageIndex(page);
      }
    },
    [lastPage, setPageIndex]
  );

  // 이전 페이지로 이동
  const goPrevPage = useCallback(() => {
    if (!firstPage) {
      setPageIndex(controlledPageIndex - 1);
    }
  }, [controlledPageIndex, firstPage, setPageIndex]);

  // 다음 페이지로 이동
  const goNextPage = useCallback(() => {
    if (!lastPage) {
      setPageIndex(controlledPageIndex + 1);
    }
  }, [controlledPageIndex, lastPage, setPageIndex]);

  // 페이지 목록 생성
  const generatePageList = (startPage: number, length: number) => {
    // 얕은 복사
    return Array.from({ length }, (value, index) => index + startPage);
  };


  let pageList;
  if (totalPage > 1) {
    pageList = generatePageList(getStartPage(), controlledPageSize);
  } else {
    pageList = generatePageList(1, 1);
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-wrap items-center justify-start space-x-2 pagination">
        <button
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => goFirstPage(1)}
        >
          <ChevronDoubleLeftIcon className="w-5" />
        </button>
        <button
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => goPrevPage()}
        >
          <ChevronLeftIcon className="w-5" />
        </button>

        {pageList.map((page) => (
          <button
            key={page}
            onClick={(event) => {
              event.preventDefault();
              setPageIndex(page);
            }}
            className={`${
              page === controlledPageIndex
                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            } relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md cursor-pointer`}
          >
            {page}
          </button>
        ))}

        <button
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => goNextPage()}
        >
          <ChevronRightIcon className="w-5" />
        </button>
        <button
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => goLastPage(totalPage)}
        >
          <ChevronDoubleRightIcon className="w-5" />
        </button>
      </div>

      <div className="ml-3">
        <span style={{ fontSize: "14px" }} className="text-gray-500">
          현재 페이지{" "}
          <span style={{ color: "#000" }}>{controlledPageIndex}</span>
        </span>
        <span
          className="inline-block text-gray-500"
          style={{ margin: "0px 10px" }}
        >
          /
        </span>
        <span style={{ fontSize: "14px" }} className="text-gray-500">
          전체 페이지 <span style={{ color: "#000" }}>{totalPage}</span>
        </span>
      </div>
    </div>
  );
};

export default Pagination;
