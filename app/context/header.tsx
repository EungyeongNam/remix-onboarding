import { createContext, useState } from "react";
import { HomeIcon, GiftIcon } from "@heroicons/react/outline";

type Header = {
  name: string;
  href: string;
  icon: any;
  current: boolean;
};

interface IHeaderContext {
  navigate: Array<Header>;
  setNavigate: Function;
}

export const HeaderContext = createContext<IHeaderContext>({
  navigate: [],
  setNavigate: () => {},
});

export function InitHeaderContext(): IHeaderContext {
  const [navigate, setNavigate] = useState([
    { name: "Home", href: "/", icon: HomeIcon, current: true },
    {
      name: "Promotions",
      href: "/promotions",
      icon: GiftIcon,
      current: false,
    },
  ]);

  return {
    navigate,
    setNavigate,
  };
}
