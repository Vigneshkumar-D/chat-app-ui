
import { CHAT_HISTORY_URL } from "../constService";
import CrudService from "../crudService";

export default class ChatHistoryService extends CrudService {
  url = CHAT_HISTORY_URL;
}
