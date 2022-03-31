import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  NumberInput,
  Radio,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Form } from "remix";
import dayjs from "dayjs";
import { useListState } from "@mantine/hooks";

type IFormData = {
  name: string;
  description: string;
  promotion_type: string;
  promotion_rate: number;
  promotion_amount: number;
  reason: string;
  started_at: string;
  ended_at: string;
};

const PromotionCreate = () => {
  // 강의 목록 불러오기
  const [checkCouresList, handleCheckCouresList] = useListState([] as any[]);
  const fetchCouresListTitle = useCallback(async () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");

      try {
        await axios
          .get(
            `${window.ENV.API_ENDPOINT}/course/v1/courses?page=1&per_page=100`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
          .then((response) => {
            const { data } = response.data;
            const checkList = data.map(({ id, title }: any) => ({
              id,
              label: title,
              checked: false,
            }));

            handleCheckCouresList.setState(checkList);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // 프로모션 생성하기
  const { register, control, handleSubmit, watch } = useForm<IFormData>();
  const isRate = watch("promotion_type") === "rate";

  const courses = [...checkCouresList].reduce((acc, cur) => {
    if (cur.checked) {
      return [...acc, cur.id];
    }
    return acc;
  }, []);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await axios.post(
        `${window.ENV.API_ENDPOINT}/course/v1/promotions`,
        {
          ...data,
          ended_at: dayjs(data.ended_at)
            .add(23, "h")
            .add(59, "m")
            .add(59, "s")
            .toDate(),
          courses,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchCouresListTitle();
  }, [fetchCouresListTitle]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ width: "100%", padding: "20px", boxSizing: "border-box" }}>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          프로모션 생성하기
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
              <Input
                type="text"
                {...register("name")}
                style={{ width: "100%" }}
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
              <Input
                type="text"
                {...register("description")}
                style={{ width: "100%" }}
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
                <div className="flex items-center h-5">
                  <Radio
                    value="rate"
                    {...register("promotion_type")}
                    type="radio"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="promotion_type"
                    className="font-medium text-gray-700"
                  >
                    정률할인
                  </label>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <Radio
                    value="amount"
                    {...register("promotion_type")}
                    type="radio"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="promotion_type"
                    className="font-medium text-gray-700"
                  >
                    정액할인
                  </label>
                </div>
              </div>

              <div className="max-w-lg flex rounded-md shadow-sm">
                <Controller
                  name={isRate ? "promotion_rate" : "promotion_amount"}
                  control={control}
                  defaultValue={0}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <NumberInput
                      defaultValue={0}
                      value={value}
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
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div className="max-w-lg flex rounded-md shadow-sm">
                <Textarea {...register("reason")} style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              프로모션 기간
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
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

            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div
                className="relative flex items-start"
                style={{ marginBottom: "10px" }}
              >
                <div className="flex items-center h-5">
                  <Checkbox
                    id="all-check"
                    aria-describedby="comments-description"
                    name="all-check"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="all-check"
                    className="font-medium text-gray-700"
                  >
                    전체
                  </label>
                </div>
              </div>

              {checkCouresList.map(({ id, label, checked }, index) => (
                <div
                  key={id}
                  className="relative flex items-start"
                  style={{ marginBottom: "10px" }}
                >
                  <div className="flex items-center h-5">
                    <Checkbox
                      id={id}
                      label={label}
                      checked={checked}
                      name={id}
                      onChange={(event) => {
                        handleCheckCouresList.setItemProp(
                          index,
                          "checked",
                          event.currentTarget.checked
                        );
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-start">
            <Button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              목록가기
            </Button>
            <Button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              생성하기
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PromotionCreate;
