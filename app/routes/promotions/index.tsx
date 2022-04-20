import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation } from "remix";
import qs from "qs";
import dayjs from "dayjs";

import Pagination from "~/components/Pagination";
import Table from "~/components/Table";
import { useAxios } from "~/context/axios";
import { usePagination } from "~/hooks/usePagination";
import SearchForm from "~/components/SearchForm";

const Promotions = () => {
  const location = useLocation();
  const { axiosInstance } = useAxios({});
  const [totalPage, setTotalPage] = useState(0);

  const {
    setPageIndex,
    setPageSize,
    pageIndex,
    pageSize,
    filters,
    setFilters,
  } = usePagination(location.pathname);

  const columns = useMemo(
    () => [
      {
        accessor: "id",
        Header: "아이디",
        Cell: (row: any) => {
          return (
            <code
              style={{
                display: "inline-block",
                width: "100%",
                color: "#000",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                backgroundColor: "rgba(243,244,246)",
              }}
            >
              <Link to={`/promotions/${row.value}`}>{row.value}</Link>
            </code>
          );
        },
        sortable: false,
      },
      {
        accessor: "name",
        Header: "이름",
        sortable: false,
      },
      {
        accessor: "description",
        Header: "설명",
        sortable: false,
      },
      {
        accessor: "promotion_rate",
        Header: "할인",
        sortable: true,
      },
      {
        id: "started_at",
        accessor: (v: any) => `${v.started_at} ~ ${v.ended_at}`,
        Header: "프로모션 기간",
        Cell: (row: any) => {
          return (
            <div>
              {dayjs(row.started_at).format("YYYY-MM-DD")} ~ {""}
              {dayjs(row.ended_at).format("YYYY-MM-DD")}
            </div>
          );
        },
        sortable: true,
      },
      {
        accessor: "created_at",
        Header: "생성일",
        Cell: (row: any) => {
          return dayjs(row.value).format("YYYY-MM-DD");
        },
        sortable: true,
      },
      {
        accessor: "updated_at",
        Header: "수정일",
        Cell: (row: any) => {
          return dayjs(row.value).format("YYYY-MM-DD");
        },
        sortable: true,
      },
      {
        accessor: "is_active",
        Header: "상태",
        Cell: (row: any) => (row.value === true ? "진행중" : "마감"),
        sortable: false,
      },
    ],
    []
  );

  // 프로모션 목록 불러오기
  const fetchPromotionsList = useCallback(
    async (page?: number, perPage: number = 10, filters = {}) => {
      const params = { page, perPage, filters };
      // 검색조건
      if (filters) {
        let filterString = "";

        if (filters.name) {
          filterString += `name:${filters.name}`; // 필터링 규칙
        }
        if (filterString) {
          params.filters = filterString;
        }
      }
      const queryString = qs.stringify(params);

      if (typeof window !== "undefined") {
        try {
          return await axiosInstance.get(
            `${window.ENV.API_ENDPOINT}/course/v1/promotions?${queryString}`
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
    []
  );

  const fetchData = useCallback(
    async ({ queryKey }) => {
      const [_key, { pageIndex, pageSize, filters }] = queryKey;
      const page = pageIndex as number;
      const response = await fetchPromotionsList(page, pageSize, filters);
      return response?.data;
    },
    [fetchPromotionsList]
  );

  const { isLoading, data } = useQuery(
    ["Promotions", { pageIndex, pageSize, filters }],
    fetchData,
    {
      onSuccess: (data) => {
        setTotalPage(data?.pagination?.total_page);
      },
    }
  );

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">프로모션 목록</h1>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/promotions/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            프로모션 생성하기
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <svg role="status" className="animate-spin inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      ) : (
        <>
          <SearchForm controllerFilters={filters} setFilters={setFilters} />
          <Table data={data?.data ?? []} columns={columns} />
          <div className="mt-8">
            <Pagination
              controlledPageIndex={pageIndex}
              controlledPageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              totalPage={totalPage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Promotions;
