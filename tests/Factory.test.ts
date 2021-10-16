import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';
import { describe, expect, test } from '@jest/globals';
import ContainerDouble from './Double/Psr/Container/ContainerDouble';
import AbstractBaseFactory, { Invokable } from '../src/BaseFactory';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';

const mockByCalls = new MockByCalls();

const randomString = (): string => {
    return Math.random().toString(16).substr(2, 8);
};

class Dependency {
    constructor(public name?: string) {}

    public setName(name: string) {
        this.name = name;
    }
}

const names = [{ name: undefined }, { name: 'name-' + randomString() }, { name: 'name-' + randomString() }];

const toString = (value: string | undefined) => (undefined !== value ? value : '');

describe('Factory', () => {
    names.forEach((data) => {
        test(`${JSON.stringify(data)}`, async () => {
            const container = mockByCalls.create<ContainerInterface>(ContainerDouble);

            const Factory = Invokable(
                class extends AbstractBaseFactory {
                    public __invoke(container: ContainerInterface): Record<string, string> {
                        return { name: this.name };
                    }
                },
            );

            const factory = undefined !== data.name ? Factory(data.name) : Factory();
            const service = factory(container);

            expect(service).toEqual({ name: toString(data.name) });

            expect(mockByCallsUsed(container)).toBe(true);
        });
    });

    describe('resolveDependency', () => {
        names.forEach((data) => {
            test(`with existing service: ${JSON.stringify(data)}`, async () => {
                const dependency = new Dependency(toString(data.name));

                const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
                    Call.create('has')
                        .with(Dependency.name + toString(data.name))
                        .willReturn(true),
                    Call.create('get')
                        .with(Dependency.name + toString(data.name))
                        .willReturn(dependency),
                ]);

                const Factory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): typeof Dependency {
                            return this.resolveDependency(container, Dependency.name);
                        }
                    },
                );

                const factory = undefined !== data.name ? Factory(data.name) : Factory();
                const service = factory(container);

                expect(service).toBe(dependency);

                expect(mockByCallsUsed(container)).toBe(true);
            });

            test(`without existing service: ${JSON.stringify(data)}`, async () => {
                const DependencyFactory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): Dependency {
                            return new Dependency(toString(data.name));
                        }
                    },
                );

                const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
                    Call.create('has')
                        .with(Dependency.name + toString(data.name))
                        .willReturn(false),
                ]);

                const Factory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): Dependency {
                            return this.resolveDependency(container, Dependency.name, DependencyFactory);
                        }
                    },
                );

                const factory = undefined !== data.name ? Factory(data.name) : Factory();
                const service = factory(container);

                expect(service).toBeInstanceOf(Dependency);
                expect((service as Dependency).name).toBe(toString(data.name));

                expect(mockByCallsUsed(container)).toBe(true);
            });
        });
    });

    describe('resolveConfig', () => {
        const config = {
            key1: 'value1',
            key2: 2,
            key3: {
                key31: 'value31',
                key32: 5,
            },
        };

        names.forEach((data) => {
            test(`${JSON.stringify(data)}`, async () => {
                const container = mockByCalls.create<ContainerInterface>(ContainerDouble);

                const Factory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): Record<string, unknown> {
                            return {
                                config:
                                    '' === this.name
                                        ? this.resolveConfig(config)
                                        : this.resolveConfig({ [this.name]: config }), // fake nesting to get the same result,
                            };
                        }
                    },
                );

                const factory = undefined !== data.name ? Factory(data.name) : Factory();
                const service = factory(container);

                expect((service as { config: unknown }).config).toBe(config);

                expect(mockByCallsUsed(container)).toBe(true);
            });
        });

        test('missing', () => {
            const container = mockByCalls.create<ContainerInterface>(ContainerDouble);

            const Factory = Invokable(
                class extends AbstractBaseFactory {
                    public __invoke(container: ContainerInterface): unknown {
                        return this.resolveConfig({});
                    }
                },
            );

            const factory = Factory('name');

            const config = factory(container);

            expect(config).toBe(undefined);

            expect(mockByCallsUsed(container)).toBe(true);
        });
    });

    describe('resolveValue', () => {
        const value = {
            key1: 'value1',
            key2: 2,
            key3: {
                key31: 'value31',
                key32: 5,
            },
        };

        names.forEach((data) => {
            test(`${JSON.stringify(data)}`, async () => {
                const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
                    Call.create('has').with('value1').willReturn(false),
                    Call.create('has').with('value31').willReturn(true),
                    Call.create('get').with('value31').willReturn('value333'),
                ]);

                const Factory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): Record<string, unknown> {
                            return {
                                value: this.resolveValue(container, value),
                            };
                        }
                    },
                );

                const factory = undefined !== data.name ? Factory(data.name) : Factory();
                const service = factory(container);

                expect((service as { value: unknown }).value).toEqual({
                    ...value,
                    key3: { ...value.key3, key31: 'value333' },
                });

                expect(mockByCallsUsed(container)).toBe(true);
            });
        });
    });

    describe('callSetter', () => {
        names.forEach((data) => {
            test(`${JSON.stringify(data)}`, async () => {
                const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
                    Call.create('has').with(toString(data.name)).willReturn(false),
                ]);

                const Factory = Invokable(
                    class extends AbstractBaseFactory {
                        public __invoke(container: ContainerInterface): Record<string, unknown> {
                            return this.callSetters(container, new Dependency(), { name: toString(data.name) });
                        }
                    },
                );

                const factory = undefined !== data.name ? Factory(data.name) : Factory();
                const service = factory(container);

                expect((service as Dependency).name).toBe(toString(data.name));

                expect(mockByCallsUsed(container)).toBe(true);
            });
        });
    });
});
