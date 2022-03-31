import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "remix";
import Table from "~/components/table";

const Promotions = () => {
  const [promotionsList, setPromotionsList] = useState([] as any[]);

  const fetchPromotionsList = useCallback(async () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");

      try {
        await axios
          .get(`${window.ENV.API_ENDPOINT}/course/v1/promotions`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            const { data } = response.data;
            return setPromotionsList(data);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    void fetchPromotionsList();
  }, [fetchPromotionsList]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">프로모션 목록</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/promotions/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            프로모션 생성하기
          </Link>
        </div>
      </div>

      <Table listItem={promotionsList}/>
    </div>
  );
};

export default Promotions;
