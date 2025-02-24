import { USER_URL } from "../constService";
import CrudService from "../crudService";

export default class UserService extends CrudService {
    url = USER_URL;
}
