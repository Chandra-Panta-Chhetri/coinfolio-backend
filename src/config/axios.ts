import axios from "axios";

axios.defaults.headers.get = {
  Accept: "application/json"
};

export default axios;
