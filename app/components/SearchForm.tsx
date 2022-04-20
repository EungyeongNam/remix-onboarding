import { Input } from "@mantine/core";
import { Form } from "remix";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

interface IFilters {
  controllerFilters: any;
  setFilters: any;
}

const SearchForm = ({ controllerFilters, setFilters }: IFilters) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = useCallback(
    async (data) => {
      let name = data.name;
      await setFilters({
        ...controllerFilters,
        name,
      });
    },
    [controllerFilters, setFilters]
  );

  return (
    <div className="mt-8">
      <h3 className="text-lg leading-6 font-medium text-gray-900">검색하기</h3>
      <Form
        className="mt-5 sm:flex sm:items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full sm:max-w-xs">
          <Input
            type="text"
            {...register("name")}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="검색어를 입력하세요."
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          검색
        </button>
      </Form>
    </div>
  );
};

export default SearchForm;
