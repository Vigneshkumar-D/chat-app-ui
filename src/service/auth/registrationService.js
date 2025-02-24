import { Component } from "react";
import axios from "axios";
import { REGISTRATION_URL } from "../constService";

export default class RegistrationService extends Component {
  url = REGISTRATION_URL;
  post(data) {
    return axios.post(this.url, data);
  }
}
