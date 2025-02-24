import { GROUP_CHAT_URL } from "../constService";
import CrudService from "../crudService";

export default class GroupChatService extends CrudService {
  url = GROUP_CHAT_URL;
}
