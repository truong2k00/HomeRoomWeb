import { BaseApi } from "@/Api/BaseApi";
import { HTTP } from "@/HTTPServices";
import type { UserLoginDTO } from "@/models/UserDTO";
import axios from "@axios";

class Authentication extends BaseApi {
  login(user: UserLoginDTO) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/User/login", {
        ...user,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Login in Google
  loginExtend(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/User/loginExternal", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Register in Google
  registerExternal(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/User/registerExternal", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  register(externalUser: any) {
    return new Promise((resolve, reject) => {
      HTTP.post("api/User/register", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  refreshtoken() {
    return new Promise((resolve, reject) => {
      HTTP.get("api/User/refresh-token")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Register in Google
  changePassword(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/Users/changePassword", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // sendEmailResetPass
  sendEmailResetPass(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/Users/sendEmailResetPass", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // reset by user
  resetPasswordByUser(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("api/Users/resetPasswordByUser", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // ----------------------- FB--------------------
  async loginFB() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(FB.login);
    if (!authResponse) return;

    return await this.loginExtendFB({
      loginProvider: "Facebook",
      acccessToken: authResponse.accessToken,
    });
  }

  async apiAuthenticate(accessToken: any) {
    // authenticate with the api using a facebook access token,
    // on success the api returns an account object with a JWT auth token
    return new Promise<any>((resolve: any, reject: any) => {
      axios
        .get(
          `https://graph.facebook.com/me?fields=email,name&access_token=${accessToken}`
        )
        .then((response) => {
          resolve(response.data); // Call API
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Login in Google
  async loginExtendFB(externalUser: any) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.post("Api/User/loginExternalFB", externalUser)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // ----------------------- FB end--------------------
}
export default new Authentication();
