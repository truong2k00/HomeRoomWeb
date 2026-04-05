export default {
  loginBegin(state: any) {
    state.login = true
  },
  loginSuccess(state: any, authToken: any) {
    state.isAuthentication = true
    state.login = true
    state.token = authToken
  },

  loginErr(state: any, err: any) {
    state.loading = false
    state.error = err
  },

  logoutBegin(state: any) {
    state.loading = true
  },

  logoutSuccess(state: any, data: any) {
    state.loading = false
    state.isAuthentication = false
    state.login = false
    state.token = null
  },

  logoutErr(state: any, err: any) {
    state.loading = false
    state.error = err
  },
}
