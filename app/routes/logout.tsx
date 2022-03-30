import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "remix";

import { useAuth } from "../context/auth";

const Logout = () => {
  const { setProfile, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const revokeToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      const response = await axios.post("/api/oauth/revoke", {
        token_type_hint: "refresh_token",
        token: refreshToken,
      });

      if (response.status === 200) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("profile");
        setProfile(null);
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void revokeToken();
  }, []);

  return <div>Loading...</div>;
};

export default Logout;
