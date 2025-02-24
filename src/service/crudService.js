import HTTPClient from "./http";

export default class CrudService extends HTTPClient {
    url = "";

    getAll(filter = {}) {
        return this.get(this.url, { params: filter });
    }

    getById(id) {
        return this.get(`${this.url}/${id}`);
    }

    update(id, data) {
        return this.put(`${this.url}/${id}`, data);
    }

    create(data) {
        return this.post(this.url, data);
    }

    deleteById(id) {
        return this.delete(`${this.url}/${id}`);
    }
}
