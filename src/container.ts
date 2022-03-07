class Container<Type> extends Object {
    // @ts-ignore
    [s: string] : Type
    constructor(content: Object = {}) {
        super(content);
        return new Proxy(this, {
            get(object, property){
                if (!Reflect.has(object, property)) {
                    throw new Error('Entry Does Not Exist');
                }
                return Reflect.get(object, property);
            },
            set(object, property, value){
                if (Reflect.has(object, property)) {
                    throw new Error('Entry Already Exists');
                }
                return Reflect.set(object, property, value);
            },
            has(object, property){
                return Reflect.has(object, property)
            },
            deleteProperty(object, property){
                if (!Reflect.has(object, property)) {
                    throw new Error('Entry Does Not Exist');
                }
                return Reflect.deleteProperty(object, property)
            }
        });
    }
}

export default Container;
