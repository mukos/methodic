import { MapInterface, TypedObject } from "./types";

class Container<Type> implements MapInterface<Type> {
    public readonly content: TypedObject<Type>

    constructor(content: TypedObject<Type> = {}) {
        this.content = content;
    }

    has(key: string){
        return this.content[key] !== undefined;
    }

    get(key: string){
        if(!this.content[key]){
            throw new Error('Entry Does Not Exist');
        }
        return this.content[key];
    }

    add(key: string, value: Type) {
        if(this.content[key]){
            throw new Error('Entry Already Exists');
        }
        this.content[key] = value;
    }

    remove(key: string){
        if(this.content[key]){
            delete this.content[key];
            return true;
        }
        return false;
    }
}

export default Container;