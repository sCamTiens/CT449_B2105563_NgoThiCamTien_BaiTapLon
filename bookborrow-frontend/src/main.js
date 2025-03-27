import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faBook,
  faBuilding,
  faUser,
  faBookOpenReader,
  faUsers,
  faMagnifyingGlass,
  faRedo,
  faTrash,
  faRightFromBracket,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBook,
  faBuilding,
  faUser,
  faBookOpenReader,
  faUsers,
  faMagnifyingGlass,
  faRedo,
  faTrash,
  faRightFromBracket,
  faChartBar
);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router).mount("#app");
