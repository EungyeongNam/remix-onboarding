import axios from "axios";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, useNavigate } from "remix";

import { useAuth, IProfile } from "../../context/auth";

type FormValues = {
  username: string;
  password: string;
};

const Login = () => {
  const { setProfile, setIsLoggedIn } = useAuth();
  const { register, handleSubmit } = useForm<FormValues>();
  const navigate = useNavigate();

  // 로그인 한 상태면 페이지 접속 금지
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    if(accessToken) {
      return navigate('/');
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post("/api/oauth/token", {
        ...data,
        grant_type: "password",
      });

      if (response.status === 200) {
        const { profile, access_token, refresh_token } = response.data;
        // 전역 context 값 변경
        setProfile(profile as IProfile);
        setIsLoggedIn(true);
        // 로컬 스토리지에 저장
        localStorage.setItem("profile", JSON.stringify(profile));
        localStorage.setItem("access_token", access_token as string);
        localStorage.setItem("refresh_token", refresh_token as string);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("username")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  로그인
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
