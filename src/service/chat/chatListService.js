
import { CHAT_LIST_URL } from "../constService";
import CrudService from "../crudService";

export default class ChatListService extends CrudService {
  url = CHAT_LIST_URL;
}
