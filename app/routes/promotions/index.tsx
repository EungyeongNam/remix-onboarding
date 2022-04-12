import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "remix";
import qs from "qs";
import dayjs from "dayjs";

import Pagination from "~/components/Pagination";
import Table from "~/components/Table";
import { useAxios } from "~/context/axios";

const Promotions = () => {
  const { axiosInstance } = useAxios({});
  const [promotionsList, setPromotionsList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

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
              color:'#000',
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
          return dayjs(row.value).format("YYYY-MM-DD")
        },
        sortable: true,
      },
      {
        accessor: "updated_at",
        Header: "수정일",
        Cell: (row: any) => {
          return dayjs(row.value).format("YYYY-MM-DD")
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
    async (page?: number, perPage: number = 10) => {
      const params = { page, perPage };
      const queryString = qs.stringify(params);

      if (typeof window !== "undefined") {
        try {
          await axiosInstance
            .get(
              `${window.ENV.API_ENDPOINT}/course/v1/promotions?${queryString}`
            )
            .then((response) => {
              const { data } = response.data;
              const { pagination } = response.data;

              setPromotionsList(data);
              setTotalPage(pagination.total_page);
              setCurrentPage(pagination.page);
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [axiosInstance]
  );

  useEffect(() => {
    void fetchPromotionsList(currentPage);
  }, [currentPage]);

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

      <Table data={promotionsList} columns={columns} />

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          pageSize={5}
          totalPage={totalPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default Promotions;
