import Container from "./container";
import EventEmitter from "eventemitter3";
import { BEFORE, AFTER } from "./events";

type State = { [key: string]: any };
type Method = (states: Container<State>, methods: Container<Method>, dependencies: Container<Function>) => unknown;
type Func = (statesObject: object, methodsObject: object, dependenciesObject: object) => unknown;

class App extends EventEmitter {
    private readonly states: Container<State>;
    private readonly methods: Container<Method>;
    private readonly dependencies: Container<Function>;
    private readonly config: object;

    constructor(config: object) {
        super();
        this.config = Object.freeze(config);
        this.states = new Container<State>();
        this.methods = new Container<Method>();
        this.dependencies = new Container<Function>();
    }

    start(initialMethodName: string){
        const func = this.getMethod(initialMethodName);
        func(this.states, this.methods, this.dependencies);
    }

    addLogger(logger: (message: string) => void, config?: { before: boolean, after: boolean }){
        if(!config || config && config.before){
            this.addListener(BEFORE, logger);
        }
        if(!config || config && config.after){
            this.addListener(AFTER, logger);
        }
    }

    addState(name: string, state: object){
        this.states.addEntry(name, Object.seal(state));
    }

    addMethod(name: string, method: Func){
        this.methods.addEntry(name, async () => {
            this.emit(BEFORE, { event: BEFORE, name });
            await method(this.getStates(), this.getMethods(), this.getDependencies());
            this.emit(AFTER, { event: AFTER, name });
        });
    }

    addDependencies(deps: { [key: string]: Function }){
        for( const name in deps ){
            this.dependencies.addEntry(name, deps[name]);
        }
    }

    getMethods(){
        return this.methods.getContainer();
    }

    getStates(){
        return this.states.getContainer();
    }

    getDependencies(){
        return this.dependencies.getContainer();
    }

    getState(name: string){
        return this.states.getEntry(name);
    }

    getMethod(name: string){
        return this.methods.getEntry(name);
    }

    getDependency(name: string){
        return this.dependencies.getEntry(name);
    }

    removeState(name: string){
        this.states.removeEntry(name);
    }

    removeMethod(name: string){
        this.methods.removeEntry(name);
    }

    removeDependency(name: string){
        this.dependencies.removeEntry(name);
    }
}

export default App;