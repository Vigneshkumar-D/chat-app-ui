import { WEBSOCKET_URL } from "../constService";
import CrudService from "../crudService";

export default class WebSocketService extends CrudService {
  url = WEBSOCKET_URL;
}
