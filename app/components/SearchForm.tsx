import { Input } from "@mantine/core";
import { useEffect, useState } from "react";

interface IFilters {
  onSubmit?: any;
  controllerFilters?: any;
  setFilters?: any;
}

const SearchForm = ({ controllerFilters, setFilters, onSubmit }: IFilters) => {
  // const [name, setName] = useState("");

  // useEffect(() => {
  //   setName(controllerFilters?.name);
  // }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements.filter.value);
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg leading-6 font-medium text-gray-900">검색하기</h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        <p>에 대한 검색 결과 입니다.</p>
      </div>
      <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
        <div className="w-full sm:max-w-xs">
          <label htmlFor="name" className="sr-only">
            Email
          </label>
          <Input
            type="text"
            name="filter"
            // value={name}
            // onChange={(e: any) => {
            //   setName(e.target.value);
            // }}
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
      </form>
    </div>
  );
};

export default SearchForm;
