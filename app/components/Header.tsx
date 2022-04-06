import { Link } from "remix";

import { useAuth } from "~/context/auth";

const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <header style={{ padding: "10px 20px" }}>
        <Link to="/" style={{ marginRight: 30 }}>
          홈
        </Link>
        <Link to="/promotions" style={{ marginRight: 30 }}>
          프로모션
        </Link>
        {isLoggedIn === true ? <Link to="/logout">로그아웃</Link> : null}
      </header>
      <hr />
    </>
  );
};

export default Header;
