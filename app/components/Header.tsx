import { Fragment, useState } from "react";
import { Link, useLocation } from "remix";
import { Dialog, Transition } from "@headlessui/react";
import {
  MenuIcon,
  HomeIcon,
  GiftIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";

const Header = () => {
  const location = useLocation();
  const [navSidebarOpen, setNavSidebarOpen] = useState(false);

  const navigate = [
    { name: "Home", href: "/", icon: HomeIcon },
    {
      name: "Promotions",
      href: "/promotions",
      icon: GiftIcon,
    },
  ];

  return (
    <div>
      <Transition.Root show={navSidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setNavSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setNavSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {navigate.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        item.href === location.pathname
                          ? "bg-indigo-800 text-white"
                          : "text-white hover:bg-indigo-600 hover:bg-opacity-75"
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    >
                      <item.icon
                        className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                        aria-hidden="true"
                        style={{
                          color: "rgb(165 180 252)",
                          opacity: "0.7",
                          marginRight: "0.75rem",
                        }}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                <div className="flex items-center">
                  <div>
                    <UsersIcon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">Tom Cook</p>
                    <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                      View profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </Dialog>
      </Transition.Root>

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <h1 className="flex items-center flex-shrink-0 px-4 text-white text-2xl">
              PROJECT LION
            </h1>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigate.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.href === location.pathname
                      ? "bg-indigo-800 text-white"
                      : "text-white hover:bg-indigo-600 hover:bg-opacity-75"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                    aria-hidden="true"
                    style={{
                      color: "rgb(165 180 252)",
                      opacity: "0.7",
                      marginRight: "0.75rem",
                    }}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div>
                <UsersIcon className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Tom Cook</p>
                <Link
                  to="/logout"
                  className="text-xs font-medium text-indigo-200 group-hover:text-white"
                >
                  로그아웃
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setNavSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
