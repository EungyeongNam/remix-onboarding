import { useCallback, useEffect, useState } from "react";
import { Link } from "remix";
import qs from "qs";

import Pagination from "~/components/Pagination";
import Table from "~/components/table";
import { useAxios } from "~/context/axios";

const Promotions = () => {
  const { axiosInstance } = useAxios({});
  const [promotionsList, setPromotionsList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  // 프로모션 목록 불러오기
  const fetchPromotionsList = useCallback(async (page?: number, perPage: number = 10) => {
    const params = { page, perPage };
    const queryString = qs.stringify(params);

    if (typeof window !== "undefined") {
      try {
        await axiosInstance
          .get(`${window.ENV.API_ENDPOINT}/course/v1/promotions?${queryString}`)
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
  }, [axiosInstance]);

  useEffect(() => {
    void fetchPromotionsList(currentPage);
  }, [currentPage]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
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

      <Table listItem={promotionsList} />
      <Pagination
        currentPage={currentPage}
        pageSize={5}
        totalPage={totalPage}
        onChange={setCurrentPage}
      />
    </div>
  );
};

export default Promotions;
