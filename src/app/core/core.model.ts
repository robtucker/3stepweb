export default class BaseModel {

    protected api;

    protected storage;
    
    constructor(api, storage) {
        this.api = api;
        this.storage = storage
    }
}

