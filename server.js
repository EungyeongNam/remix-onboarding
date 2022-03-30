import express from "express";
import qs from "qs";
import axios from "axios";
import jwtDecode from "jwt-decode";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import * as serverBuild from "@remix-run/dev/server-build";
import "dotenv/config";

const app = express();

app.use(compression());
app.disable("x-powered-by"); // x-powered-by 헤더 비활성화
app.use(express.json());

app.use(express.static("public", { maxAge: "1h" }));
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));

// 로그인 (내 로컬)
app.post("/api/oauth/token", async (req, res) => {
  let payload;
  const { username, password, grant_type, refresh_token } = req.body;

  const {
    OAUTH_TOKEN_ENDPOINT: tokenEndPoint,
    OAUTH_CLIENT_ID: clientId,
    OAUTH_CLIENT_SECRET: clientSecret,
    OAUTH_SCOPE: scope,
  } = process.env;

  const basicHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  if (!tokenEndPoint || !clientId || !clientSecret) {
    return res.status(401).send({
      error: "oauth 값이 존재하지 않습니다",
    });
  }

  if (grant_type === "password") {
    payload = qs.stringify({
      username,
      password,
      grant_type,
      scope,
    });
  } else {
    payload = qs.stringify({
      grant_type,
      refresh_token,
    });
  }

  // token 발급 API
  try {
    const response = await axios.post(tokenEndPoint, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: `Basic ${basicHeader}`,
      },
    });

    if (grant_type === "password") {
      const { email, sub } = jwtDecode(response.data.id_token);

      res.json({
        ...response.data,
        profile: {
          email,
          sub,
        },
      });
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    res.json(error);
  }
});

// 로그아웃
app.post("/api/oauth/revoke", async (req, res) => {
  const {
    OAUTH_TOKEN_ENDPOINT: tokenEndPoint,
    OAUTH_TOKEN_REVOKE_ENDPOINT: tokenRevokeEndPoint,
    OAUTH_CLIENT_ID: clientId,
    OAUTH_CLIENT_SECRET: clientSecret,
  } = process.env;

  if (!tokenEndPoint || !tokenRevokeEndPoint || !clientId || !clientSecret) {
    return res.status(401).send({
      error: "env 값이 없습니다.",
    });
  }

  const { token_type_hint, token } = req.body;
  const basicHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const payload = qs.stringify({
    token_type_hint,
    token,
  });

  try {
    const response = await axios.post(tokenRevokeEndPoint, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: `Basic ${basicHeader}`,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.all(
  "*",
  createRequestHandler({
    build: serverBuild,
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
