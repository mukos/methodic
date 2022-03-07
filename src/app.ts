import Container from "./container";
import EventEmitter from "eventemitter3";

type State = Record<string, any>;
type Func = (...args: any[]) => unknown;
type Config = Record<string, NonNullable<any>>

enum EVENTS {
    BEFORE = "BEFORE",
    AFTER = "AFTER"
}

class App {
    private readonly EE: EventEmitter;
    public readonly states: Container<State>;
    public readonly functions: Container<Func>;
    public readonly dependencies: Container<Function>;
    public readonly config: Config = {
        logger: {
            before: true,
            after: true
        }
    };

    constructor(config: Config = {}) {
        this.EE = new EventEmitter();
        this.config = Object.freeze({ ...this.config, ...config });
        this.states = new Container<State>();
        this.functions = new Container<Func>();
        this.dependencies = new Container<Function>();
    }

    run(functionName: string, params: any[] = []){
        const func = this.functions[functionName];
        func(...params);
    }

    addLogger(logger: (message: string) => void){
        if(this.config.logger?.before){
            this.EE.addListener(EVENTS.BEFORE, logger);
        }
        if(this.config.logger?.after){
            this.EE.addListener(EVENTS.AFTER, logger);
        }
    }

    addState(name: string, state: {}){
        this.states[name] = Object.seal(state);
    }

    private wrapFunction(func: Func, handler?: (error: Error) => unknown){
        if(handler){
            return (...args: any[]) => {
                try {
                    return func(...args);
                } catch (error) {
                    return handler(error as Error);
                }
            }
        }
        return func;
    }

    addFunction(name: string, func: Func, handler?: (error: Error) => unknown){
        this.functions[name] = this.wrapFunction((...args: any[]) => {
            this.EE.emit(EVENTS.BEFORE, { event: EVENTS.BEFORE, name });

            let result = func(this.states, this.functions, this.dependencies);
            if(typeof result === 'function'){
                result = result(...args);
            }
            this.EE.emit(EVENTS.AFTER, { event: EVENTS.AFTER, name });
            return result;
        }, handler);
    }

    addDependencies(deps: Record<string, Function>){
        for(const name in deps){
            this.dependencies[name] = deps[name];
        }
    }
}

export default App;
