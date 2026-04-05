import mutations from "./mutations";
import Authentication from "@/Api/authen/authentication";
import type {
  RegisterUser,
  RegisterUserExteranlDTO,
  UserLoginDTO,
} from "@/models/UserDTO";

const stateToken = {
  token: localStorage.getItem("auth-token") || "",
  status: "",
};

const state = () => ({
  login: localStorage.getItem("logedIn"),
  loading: false,
  error: null,
  token: null,
  isAuthentication: false,
});

const actions = {
  async loginOld({ commit }: { commit: any }) {
    try {
      commit("loginBegin");
      localStorage.set("logedIn", "true");

      return commit("loginSuccess", true);
    } catch (err) {
      commit("loginErr", err);
    }
  },
  async logout({ commit }: { commit: any }) {
    try {
      localStorage.remove("auth-token");
      localStorage.removeItem("userAbilities");
      localStorage.removeItem("userData");
      commit("logoutSuccess", null);
    } catch (err) {
      commit("logoutErr", err);
    }
  },
  async login({ commit }: { commit: any }, use: UserLoginDTO) {
    return new Promise((resolve, reject) => {
      Authentication.login(use)
        .then((res) => {
          localStorage.removeItem("auth-token");
          // localStorage.setItem('auth-token', res.token) // stash the auth token in localStorage
          res.hocVien = {
            ...res.hocVien,
            role: res.roles,
          };
          localStorage.removeItem("user");

          const user = JSON.stringify(res.hocVien);

          localStorage.setItem("user", user); // stash the auth token in localStorage

          const x = localStorage.getItem("user");

          commit("loginSuccess", res.token);
          resolve(res);
        })
        .catch((err) => {
          localStorage.removeItem("auth-token");
          reject(err);
        });
    });
  },

  // Google-------------------------
  async loginExtend({ commit }: { commit: any }, use: UserLoginDTO) {
    return new Promise((resolve, reject) => {
      Authentication.loginExtend(use)
        .then((res) => {
          // Check Register or Created
          if (res.action == "Created") {
            localStorage.removeItem("auth-token");
            // localStorage.setItem('auth-token', res.token) // stash the auth token in localStorage
            res.hocVien = {
              ...res.hocVien,
              role: res.roles,
            };
            localStorage.removeItem("user");

            const user = JSON.stringify(res.hocVien);

            localStorage.setItem("user", user); // stash the auth token in localStorage

            const x = localStorage.getItem("user");

            commit("loginSuccess", res.token);
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch((err) => {
          localStorage.removeItem("auth-token");
          reject(err);
        });
    });
  },
  async register({ commit }: { commit: any }, inputData: RegisterUser) {
    return new Promise((resolve, reject) => {
      Authentication.register(inputData)
        .then((res) => {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user");
          commit("loginSuccess");
          resolve(res);
        })
        .catch((err) => {
          localStorage.removeItem("auth-token");
          reject(err);
        });
    });
  },

  // Register Google
  async registerExternal(
    { commit }: { commit: any },
    use: RegisterUserExteranlDTO,
  ) {
    return new Promise((resolve, reject) => {
      Authentication.registerExternal(use)
        .then((res) => {
          localStorage.removeItem("auth-token");
          // localStorage.setItem('auth-token', res.token) // stash the auth token in localStorage
          res.hocVien = {
            ...res.hocVien,
            role: res.roles,
          };
          localStorage.removeItem("user");

          const user = JSON.stringify(res.hocVien);

          localStorage.setItem("user", user); // stash the auth token in localStorage

          const x = localStorage.getItem("user");

          commit("loginSuccess", res.token);
          resolve(res);
        })
        .catch((err) => {
          localStorage.removeItem("auth-token");
          reject(err);
        });
    });
  },

  // FB-------------------------
  async loginExtendFB({ commit }: { commit: any }) {
    return new Promise((resolve, reject) => {
      Authentication.loginFB()
        .then((res) => {
          // Check Register or Created
          if (res.action == "Created") {
            localStorage.removeItem("auth-token");
            // localStorage.setItem('auth-token', res.token) // stash the auth token in localStorage
            res.hocVien = {
              ...res.hocVien,
              role: res.roles,
            };
            localStorage.removeItem("user");

            const user = JSON.stringify(res.hocVien);

            localStorage.setItem("user", user); // stash the auth token in localStorage

            const x = localStorage.getItem("user");

            commit("loginSuccess", res.token);
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch((err) => {
          localStorage.removeItem("auth-token");
          reject(err);
        });
    });
  },
};

export default {
  namespaced: false,
  state,
  actions,
  mutations,
};
