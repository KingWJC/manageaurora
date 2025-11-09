export default class ErrorCode extends Error{
    init(name, message) {
        this.name = name;
        this.message = message;
        return this;
    }
}