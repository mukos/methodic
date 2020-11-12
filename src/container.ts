class Container<Type>{
    private readonly container: {[key: string]: Type};

    constructor() {
        this.container = Object.create(null);
    }

    getContainer(){
        return this.container;
    }

    getEntry(key: string){
        if(!this.container[key]){
            throw new Error('Entry Does Not Exist');
        }
        return this.container[key];
    }

    addEntry(key: string, value: Type){
        if(this.container[key]){
            throw new Error('Entry Already Exists');
        }
        this.container[key] = value;
    }

    removeEntry(key: string){
        if(this.container[key]){
            delete this.container[key];
        }
    }
}

export default Container;