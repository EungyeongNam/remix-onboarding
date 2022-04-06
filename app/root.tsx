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

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthContext>
          <Header />
          <Outlet />
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
