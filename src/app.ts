import Container from "./container";
import EventEmitter from "eventemitter3";

type State = {[key: string]: any};
type Config = {[key: string]: string|number|null|Config|[Config]}
type Func = (...args: any[]) => unknown;

enum EVENTS {
    BEFORE = "BEFORE",
    AFTER = "AFTER"
}

class App {
    private EE: EventEmitter;
    public readonly states: Container<State>;
    public readonly functions: Container<Func>;
    public readonly dependencies: Container<Function>;
    public readonly config: Config|undefined;

    constructor(config?: Config) {
        this.EE = new EventEmitter();
        this.config = Object.freeze(config);
        this.states = new Container<State>();
        this.functions = new Container<Func>();
        this.dependencies = new Container<Function>();
    }

    run(functionName: string, params: any[]){
        const func = this.functions.get(functionName);
        func(...params);
    }

    addLogger(logger: (message: string) => void, config?: { before: boolean, after: boolean }){
        if(!config || config && config.before){
            this.EE.addListener(EVENTS.BEFORE, logger);
        }
        if(!config || config && config.after){
            this.EE.addListener(EVENTS.AFTER, logger);
        }
    }

    addState(name: string, state: {}){
        this.states.add(name, Object.seal(state));
    }

    private wrapFunction(func: Func, handler?: (error: Error) => unknown){
        if(handler){
            return async (...args: any[]) => {
                try {
                    return func(...args);
                } catch (error) {
                    return handler(error);
                }
            }
        }
        return func;
    }

    addFunction(name: string, fun: Func, handler?: (error: Error) => unknown){
        const func = async (...args: any[]) => {
            this.EE.emit(EVENTS.BEFORE, { event: EVENTS.BEFORE, name });
            const params = args.length === 0 ? [this.states.container, this.functions.container, this.dependencies.container] : args;
            const result = await fun(...params);
            this.EE.emit(EVENTS.AFTER, { event: EVENTS.AFTER, name });
            return result;
        }
        this.functions.add(name, this.wrapFunction(func, handler));
    }

    addDependencies(deps: { [key: string]: Function }){
        for( const name in deps ){
            this.dependencies.add(name, deps[name]);
        }
    }

    getState(name: string){
        return this.states.get(name);
    }

    getFunction(name: string){
        return this.functions.get(name);
    }

    getDependency(name: string){
        return this.dependencies.get(name);
    }

    removeState(name: string){
        this.states.remove(name);
    }

    removeFunction(name: string){
        this.functions.remove(name);
    }

    removeDependency(name: string){
        this.dependencies.remove(name);
    }
}

export default App;