import { CURRENT_USER_URL } from "../constService";
import CrudService from "../crudService";

export default class CurrentUserService extends CrudService {
    url = CURRENT_USER_URL;
}
