import { useEffect } from "react";
import { useNavigate } from "remix";

export default function Index() {
  const navigate = useNavigate();

  let isTokenAvailable = false;

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken !== null && refreshToken !== null) {
      isTokenAvailable = true;
    }

    if (!isTokenAvailable) {
      return navigate("/login");
    }
  }, []);

  return <h1>메인화면</h1>;
}
