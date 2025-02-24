import axios from "axios";
import Cookies from "js-cookie";

export default class HTTPClient {
  constructor() {
    this.token = Cookies.get("login_token");
  }

  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  get(url, config = {}) {
    return axios.get(url, {
      ...config,
      headers: { ...this.getAuthHeader(), ...config.headers },
    });
  }

  put(url, data, config = {}) {
    return axios.put(url, data, {
      ...config,
      headers: { ...this.getAuthHeader(), ...config.headers },
    });
  }

  post(url, data, config = {}) {
    return axios.post(url, data, {
      ...config,
      headers: { ...this.getAuthHeader(), ...config.headers },
    });
  }

  delete(url, config = {}) {
    return axios.delete(url, {
      ...config,
      headers: { ...this.getAuthHeader(), ...config.headers },
    });
  }
}
