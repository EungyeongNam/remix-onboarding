import { useCallback, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "remix";
import { useAxios } from "~/context/axios";
import { DatePicker } from "@mantine/dates";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Input,
  NumberInput,
  Radio,
  RadioGroup,
  Textarea,
} from "@mantine/core";
import dayjs from "dayjs";
import { useListState } from "@mantine/hooks";

interface IFormData {
  name: string;
  description: string;
  promotion_type: string;
  promotion_rate: number;
  promotion_amount: number;
  reason: string;
  started_at: Date;
  ended_at: Date;
}

const PromotionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axiosInstance } = useAxios({});
  const { control, handleSubmit, watch, setValue } = useForm<IFormData>();

  const [checkCourseList, handleCheckCourseList] = useListState<any>([]);
  const [promotionInfo, setPromotionInfo] = useState(Object);

  const isRate = watch("promotion_type") === "rate";

  // 강의 목록 불러오기
  const fetchCourseListTitle = useCallback(async () => {
    if (typeof window !== "undefined") {
      try {
        await axiosInstance
          .get(
            `${window.ENV.API_ENDPOINT}/course/v1/courses?page=1&per_page=100`
          )
          .then((response) => {
            const { data } = response.data;

            return fetchPromotionDetail(data);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [axiosInstance]);

  // 프로모션 정보 불러오기
  const fetchPromotionDetail = useCallback(
    async (courseList) => {
      if (typeof window !== "undefined") {
        try {
          await axiosInstance
            .get(`${window.ENV.API_ENDPOINT}/course/v1/promotions/${id}`)
            .then((response) => {
              // 받아온 데이터를 [key, value] 쌍을 담은 배열로 반환후 key, value를 forEach 문을 통해 독립적으로 분리 후 setValue에 바인딩
              Object.entries(response.data).forEach(([key, value]: any) => {
                if (key === "id") return;

                if (key === "started_at" || key === "ended_at") {
                  return setValue(key, new Date(value as string));
                }
                setValue(key, value);
              });

              const checkList = courseList.map(({ id, title }: any) => ({
                id,
                label: title,
                checked: response.data.courses.includes(id),
              }));

              setPromotionInfo(response.data);
              handleCheckCourseList.setState(checkList);
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [axiosInstance, handleCheckCourseList, id, setValue]
  );

  // 체크박스 전체 선택
  const allChecked = checkCourseList.every(({ checked }) => checked);

  const courses = [...checkCourseList].reduce((acc, cur) => {
    if (cur.checked) {
      return [...acc, cur.id];
    }
    return acc;
  }, []);

  // 수정하기
  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    console.log(data);

    const payload = {
      ...data,
      promotion_rate: isRate ? data.promotion_rate : 0,
      promotion_amount: isRate ? 0 : data.promotion_amount,
      ended_at: dayjs(data.ended_at)
        .add(23, "h")
        .add(59, "m")
        .add(59, "s")
        .toDate(),
      courses,
      user_group: "",
    };

    try {
      const response = await axiosInstance.patch(
        `${window.ENV.API_ENDPOINT}/course/v1/promotions/${id}`,
        payload
      );

      if (response.status === 200) {
        navigate(`/promotions/${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goPromotionsListPage = () => {
    navigate("/promotions");
  };

  useEffect(() => {
    void fetchCourseListTitle();
  }, []);

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="shadow sm:rounded-md sm:overflow-hidden"
    >
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          프로모션 수정하기
        </h3>

        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              이름
            </label>
            <div className="max-w-lg flex rounded-md shadow-sm">
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              설명
            </label>
            <div className="max-w-lg flex rounded-md shadow-sm">
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <div className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              프로모션 유형
            </div>
            <div className="mt-4 sm:mt-0 sm:col-span-2">
              <div
                className="relative flex items-start"
                style={{ marginBottom: "10px" }}
              >
                <Controller
                  name="promotion_type"
                  control={control}
                  defaultValue="rate"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      defaultValue="rate"
                      value={value}
                      onChange={onChange}
                    >
                      <Radio value="rate" label="정률할인" />
                      <Radio value="amount" label="정액할인" />
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                <Controller
                  name={isRate ? "promotion_rate" : "promotion_amount"}
                  control={control}
                  defaultValue={0}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <NumberInput
                      value={
                        promotionInfo.promotion_type === "rate"
                          ? promotionInfo.promotion_rate
                          : promotionInfo.promotion_amount
                      }
                      onChange={onChange}
                      label={`${isRate ? "할인율" : "할인금액"}을 입력해주세요`}
                      min={0}
                      max={isRate ? 100 : 1000000}
                      className="mt-4"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              프로모션 이유
            </label>
            <Controller
              name="reason"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  value={value}
                  onChange={onChange}
                  style={{ width: "100%" }}
                />
              )}
            />
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              프로모션 기간
            </label>
            <div className="mt-1 sm:mt-0">
              <div className="max-w-lg flex rounded-md shadow-sm">
                <Controller
                  name="started_at"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="시작"
                      value={value}
                      inputFormat="YYYY/MM/DD"
                      onChange={onChange}
                      placeholder="시작날짜를 선택해주세요"
                      minDate={new Date()}
                      required
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </div>
              <div className="max-w-lg flex rounded-md shadow-sm">
                <Controller
                  name="ended_at"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="종료"
                      value={value}
                      inputFormat="YYYY/MM/DD"
                      onChange={onChange}
                      placeholder="시작날짜를 선택해주세요"
                      minDate={new Date()}
                      required
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              강의목록
            </label>

            <div
              className="mt-1 sm:mt-0 rounded-md shadow-sm"
              style={{
                height: "170px",
                overflowX: "auto",
                border: "1px solid #ced4da",
              }}
            >
              <div
                style={{
                  height: "100%",
                  padding: "10px 15px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="relative flex items-start"
                  style={{ marginBottom: "10px" }}
                >
                  <Checkbox
                    label="전체"
                    checked={allChecked}
                    onChange={() => {
                      handleCheckCourseList.setState((current) =>
                        current.map((checkItem) => ({
                          ...checkItem,
                          checked: !allChecked,
                        }))
                      );
                    }}
                  />
                </div>

                {checkCourseList.map(({ id, label, checked }, index) => (
                  <div
                    key={id}
                    className="relative flex items-start"
                    style={{ marginBottom: "10px" }}
                  >
                    <Checkbox
                      id={id}
                      label={label}
                      checked={checked}
                      name={id}
                      onChange={(event) => {
                        handleCheckCourseList.setItemProp(
                          index,
                          "checked",
                          event.currentTarget.checked
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-start">
            <Button
              onClick={goPromotionsListPage}
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              목록가기
            </Button>
            <Button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PromotionEdit;
