import { Component } from "react";
import axios from "axios";
import { FORGET_PASSWORD_URL } from "../constService";
import CrudService from "../crudService";

export default class ForgetPasswordService extends CrudService {
  url = FORGET_PASSWORD_URL;
  // post(data) {
  //   return axios.post(this.url, data);
  // }
}
