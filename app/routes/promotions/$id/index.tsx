import { useListState } from "@mantine/hooks";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "remix";
import { useAxios } from "~/context/axios";

interface IPromotionData {
  id: string;
  name: string;
  description: string;
  reason: string;
  promotion_type: string;
  promotion_rate: number;
  promotion_amount: number;
  created_at: Date;
  updated_at: Date;
  started_at: Date;
  ended_at: Date;
  is_active: boolean;
  courses: Array<string>;
}

const PromotionDeatil = () => {
  const { id } = useParams();
  const { axiosInstance } = useAxios({});
  const [promotionInfo, serPromotionInfo] = useState<IPromotionData>(Object);

  // 프로모션 상세 정보 불러오기
  const fetchPromotionDetail = useCallback(async () => {
    if (typeof window !== "undefined") {
      try {
        await axiosInstance
          .get(`${window.ENV.API_ENDPOINT}/course/v1/promotions/${id}`)
          .then((response) => {
            console.log(response.data);
            serPromotionInfo(response.data);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [axiosInstance, id]);

  // 강의 목록 불러오기
  const [courseList, setCourseList] = useListState<any>([]);

  const fetchCouresListTitle = useCallback(async () => {
    if (typeof window !== "undefined") {
      try {
        await axiosInstance
          .get(
            `${window.ENV.API_ENDPOINT}/course/v1/courses?page=1&per_page=100`
          )
          .then((response) => {
            const { data } = response.data;
            const coursesList = data.map(({ id, title }: any) => ({
              id,
              label: title,
            }));
            setCourseList.setState(coursesList);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const promotionCourseList = courseList.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});

  useEffect(() => {
    void fetchPromotionDetail();
    void fetchCouresListTitle();
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          프로모션 상세 정보
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">아이디</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.id}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">이름</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.name}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">설명</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.description}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">프로모션 이유</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.reason}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">프로모션 유형</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.promotion_type === "rate"
                ? "정률할인"
                : "정액할인"}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">할인</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.promotion_type === "rate"
                ? `${promotionInfo.promotion_rate}%`
                : `${promotionInfo.promotion_amount}원`}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">프로모션 기간</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.started_at} ~ {promotionInfo.ended_at}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">생성일</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.created_at}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">수정일</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.updated_at}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">상태</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.is_active === true ? "진행중" : "종료"}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              프로모션 강의목록
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {promotionInfo.courses &&
                promotionInfo.courses
                  .filter((id) => promotionCourseList[id])
                  .map((v) => <p key={v}>{promotionCourseList[v]?.label}</p>)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PromotionDeatil;
