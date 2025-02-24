
import { MESSAGE_URL } from "../constService";
import CrudService from "../crudService";

export default class MessageService extends CrudService {
  url = MESSAGE_URL;
}
