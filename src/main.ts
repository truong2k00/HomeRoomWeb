/* eslint-disable import/order */
import "@/@fake-db/db";
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import ability from "@/plugins/casl/ability";
import i18n from "@/plugins/i18n";
import layoutsPlugin from "@/plugins/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import { abilitiesPlugin } from "@casl/vue";
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import { createPinia } from "pinia";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { createApp } from "vue";
import vue3GoogleLogin from "vue3-google-login";
import store from "./Store/store";
import { formatCurrency } from './plugins/utils/format'
import { useBeforeUnload } from './plugins/utils/useBeforeUnload'

loadFonts();
declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}
declare const FB: any;

// Create vue app
const app = createApp(App);

window.fbAsyncInit = function () {
  FB.init({
    appId: "990186343126102", // Thay YOUR_FACEBOOK_APP_ID bằng ID thực tế
    xfbml: true,
    version: "v16.0",
  });
};

(function (d, s, id) {
  if (d.getElementById(id)) return;
  const js = d.createElement(s);

  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";

  const fjs = d.getElementsByTagName(s)[0];

  fjs?.parentNode?.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

app.config.globalProperties.$formatCurrency = formatCurrency
app.config.globalProperties.$useBeforeUnload = useBeforeUnload
// Use plugins
app.use(vuetify);
app.use(vue3GoogleLogin, {
  clientId:
    "348705762963-utl8mi2v9igdmhmpdk4habin4n9cjv0u.apps.googleusercontent.com",
});
app.use(createPinia());
app.use(router);
app.use(store);
app.use(layoutsPlugin);
app.use(i18n);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

// Mount vue app
app.mount("#app");
