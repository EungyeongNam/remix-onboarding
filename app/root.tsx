import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";

import AuthContext from "./context/auth";
import styles from "./styles/app.css";
import Header from "./components/Header";

import { HeaderContext, InitHeaderContext } from "./context/header";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function loader() {
  return {
    ENV: {
      API_ENDPOINT: process.env.API_ENDPOINT,
    },
  };
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const data = useLoaderData();
  const headerContext = InitHeaderContext();

  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <AuthContext>
          <HeaderContext.Provider value={headerContext}>
            <Header />
            <main className="md:pl-64 flex flex-col flex-1">
              <div
                className="px-4 sm:px-6 md:px-8"
                style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
              >
                <Outlet />
              </div>
            </main>
          </HeaderContext.Provider>
        </AuthContext>

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        {process.env.NODE_ENV === "development" && <LiveReload />}
        <Scripts />
      </body>
    </html>
  );
}
