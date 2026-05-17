import router from "@/router";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Canceler,
} from "axios";
import Cookies from "js-cookie";

const HOST = import.meta.env.VITE_APP_ROOT_API;

// import AuthService from '@/AuthService';
// const auth = new AuthService();
export class HTTPSingleton {
  private static instance: HTTPSingleton;
  private static config: AxiosRequestConfig = {
    baseURL: HOST,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "vi",
      "Access-Control-Allow-Origin": "*",
    },
    timeout: 1000000,
    responseType: "json",
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    onUploadProgress: (progressEvent: any) => { },
    onDownloadProgress: (progressEvent: any) => { },
    cancelToken: new axios.CancelToken((cancel: Canceler) => { }),
  };

  private HTTP: AxiosInstance;
  private constructor() {
    this.HTTP = axios.create(HTTPSingleton.config);
    this.setAccessToken();
  }

  static getInstance() {
    if (!HTTPSingleton.instance) HTTPSingleton.instance = new HTTPSingleton();

    return HTTPSingleton.instance;
  }

  getHTTP(): AxiosInstance {
    return this.HTTP;
  }

  setAccessToken(): void {
    this.HTTP.interceptors.request.use(
      async (config) => {
        // Do something before request is sent

        if (Cookies.get("auth-token")) {
          const token = Cookies.get("auth-token")?.replace(/^"(.*)"$/, "$1");

          if (token) config.headers.Authorization = `Bearer ${token}`;
        } else {
          const refreshToken = Cookies.get("refresh-token")?.replace(
            /^"(.*)"$/,
            "$1",
          );

          if (refreshToken) {
            try {
              const response = await axios.get(
                `${HOST}/api/user/refresh-token`,
                {
                  withCredentials: true,
                  headers: {
                    Authorization: `Bearer ${refreshToken}`,
                  },
                },
              );

              const newToken = response.data?.accessToken;
              const newRefreshToken = response.data?.refreshToken;

              if (newToken && newRefreshToken) {
                Cookies.set("auth-token", newToken);
                Cookies.set("refresh-token", newRefreshToken);
                config.headers.Authorization = `Bearer ${newToken}`;
              }
            } catch (err) {
              router.push("/login");
            }
          } else {
            router.push("/login");
          }
        }

        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      },
    );
    this.HTTP.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("userData");
          localStorage.removeItem("auth-token");
          localStorage.removeItem("userAbilities");
          router.push("/login");
        }
        if (error.response?.status === 404) {
          router.push({ name: "not-authorized" }); // hoặc 404 page
        }

        return Promise.reject(error); // ❗ Đừng quên reject để .catch hoạt động
      },
    );
  }
}
export const HTTP: AxiosInstance = HTTPSingleton.getInstance().getHTTP();
export class HTTPDownloadSingleton {
  private static instance: HTTPDownloadSingleton;
  private static config: AxiosRequestConfig = {
    baseURL: HOST,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "vi"
      // 'Access-Control-Allow-Origin': '*',
    },
    timeout: 1000000,
    responseType: "blob",
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withCredentials: true,
    onUploadProgress: (progressEvent: any) => { },
    onDownloadProgress: (progressEvent: any) => { },
    cancelToken: new axios.CancelToken((cancel: Canceler) => { }),
  };

  private HTTP: AxiosInstance;
  private constructor() {
    this.HTTP = axios.create(HTTPDownloadSingleton.config);
    this.setAccessToken();
  }

  static getInstance() {
    if (!HTTPDownloadSingleton.instance)
      HTTPDownloadSingleton.instance = new HTTPDownloadSingleton();

    return HTTPDownloadSingleton.instance;
  }

  getHTTP(): AxiosInstance {
    return this.HTTP;
  }

  setAccessToken(): void {
    // this.HTTP.interceptors.request.use(async (config) => {
    //    // Do something before request is sent
    //    let userToken = await auth.getAccessToken();
    //    config.headers['Authorization'] = `Bearer ${userToken}`;
    //    return config;
    // }, function (error) {
    //    // Do something with request error
    //    return Promise.reject(error);
    // });
    /// /if (store.state.user && store.state.user.AccessToken && store.state.user.AccessToken.Token) {
    /// /    this.HTTP.defaults.headers.common['access_token'] = store.state.user.AccessToken.Token;
    /// /}
  }
}
export const HTTPDownload: AxiosInstance =
  HTTPDownloadSingleton.getInstance().getHTTP();
