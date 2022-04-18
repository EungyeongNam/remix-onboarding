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
          filterString += `name:${filters.name}`;
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

  const { data } = useQuery(
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

      {/* <SearchForm controllerFilters={filters} setFilters={setFilters} onSubmit={} /> */}

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
  );
};

export default Promotions;
