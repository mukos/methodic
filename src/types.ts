export class TypedObject<Type> extends Object {
    // @ts-ignore
    [s: string]: Type

    constructor(content: {[s: string]: Type}) {
        super(content);
    }
}

export interface MapInterface<Type> {
    content: TypedObject<Type>
    has(key: string) : boolean
    get(key: string) : Type
    add(key: string, value: Type) : void
    remove(key: string) : boolean
}

// class Cont<Type> {
//     private readonly content: Obj<Type>;
//
//     constructor(content: Obj<Type>){
//         this.content = content;
//     }
// }
//
// // type Obj<Type> = {[key: string]: Type};
//
// export class TypedObject<Type> extends Object {
//     // @ts-ignore
//     [s: string]: Type;
//
//     constructor(content: {[s: string]: Type}) {
//         super(content);
//     }
// }

// interface Obj<T> {
//     [key: string] : T
// }
