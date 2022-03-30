import {
  Link,
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

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function loader() {
  return {
    ENV: {
      API_ENDPOINT: process.env.API_ENDPOINT,
    },
  }
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
          <header style={{ padding: "10px 20px" }}>
            <Link to="/" style={{ marginRight: 30 }}>
              홈
            </Link>
            <Link to="/login" style={{ marginRight: 30 }}>로그인</Link>
            <Link to="/logout">로그아웃</Link>
          </header>
          <hr />

          <Outlet />
        </AuthContext>

        <ScrollRestoration />
        <script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(data.ENV)}` }} />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        <Scripts />
      </body>
    </html>
  );
}
