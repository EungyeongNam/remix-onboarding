import { useContext } from "react";
import { HeaderContext } from "~/context/header";

export function useHeader() {
  const { navigate, setNavigate } = useContext(HeaderContext);

  const onClickCurrentPage = (item: any) => {
    const currentPage = navigate.map((list) => {
      return { ...list, current: list.name === item.name };
    });
    setNavigate(currentPage);
  };

  return {
    navigate,
    setNavigate,
    onClickCurrentPage,
  };
}
