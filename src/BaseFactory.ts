import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';

type Factory = (name: string) => (container: ContainerInterface) => unknown;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && Object.keys(value).length !== 0;

abstract class AbstractBaseFactory {
    constructor(protected name: string) {}

    protected resolveDependency<D>(container: ContainerInterface, id: string, factory?: Factory): D {
        if (container.has(id + this.name) || undefined === factory) {
            return container.get(id + this.name);
        }

        return factory(this.name)(container) as D;
    }

    protected resolveConfig<C>(config: C): C {
        if ('' === this.name) {
            return config;
        }

        return (isRecord(config) && config[this.name] ? config[this.name] : undefined) as C;
    }

    protected resolveValue<V>(container: ContainerInterface, value: unknown): V {
        if (isRecord(value)) {
            const resolvedValue: Record<string, unknown> = {};
            for (let [subKey, subValue] of Object.entries(value)) {
                resolvedValue[subKey] = this.resolveValue(container, subValue);
            }

            return resolvedValue as V;
        }

        return (typeof value === 'string' && container.has(value) ? container.get(value) : value) as V;
    }

    protected callSetters<CS>(container: ContainerInterface, object: unknown, config: Record<string, unknown>): CS {
        for (let [subKey, subValue] of Object.entries(config)) {
            (object as Record<string, Function>)['set' + subKey[0].toUpperCase() + subKey.substr(1)](
                this.resolveValue(container, subValue),
            );
        }

        return object as CS;
    }

    public abstract __invoke(container: ContainerInterface): unknown;
}

export const Invokable = <I>(className: {
    new (name: string): AbstractBaseFactory;
}): ((name?: string) => (container: ContainerInterface) => I) => {
    return (name: string = '') => {
        const factory = new className(name);
        return (container: ContainerInterface) => {
            return factory.__invoke(container) as I;
        };
    };
};

export default AbstractBaseFactory;
