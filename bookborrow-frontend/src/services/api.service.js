import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accpect: "application/json",
  },
};

export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};