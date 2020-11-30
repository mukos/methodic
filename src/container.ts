class Container<Type> {
    public readonly container: {[key: string]: Type}

    constructor(contents: {} = {}) {
        this.container = contents;
    }

    has(key: string){
        return this.container[key] !== undefined;
    }

    get(key: string){
        if(!this.container[key]){
            throw new Error('Entry Does Not Exist');
        }
        return this.container[key];
    }

    add(key: string, value: Type){
        if(this.container[key]){
            throw new Error('Entry Already Exists');
        }
        this.container[key] = value;
    }

    remove(key: string){
        if(this.container[key]){
            delete this.container[key];
        }
    }
}

export default Container;