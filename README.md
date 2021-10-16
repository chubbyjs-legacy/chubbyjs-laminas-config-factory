# chubbyjs-laminas-config-factory

[![CI](https://github.com/chubbyjs/chubbyjs-laminas-config-factory/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyjs/chubbyjs-laminas-config-factory/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyjs/chubbyjs-laminas-config-factory/badge.svg?branch=master)](https://coveralls.io/github/chubbyjs/chubbyjs-laminas-config-factory?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyjs/chubbyjs-laminas-config-factory/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyjs/chubbyjs-laminas-config-factory/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-laminas-config-factory&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-laminas-config-factory)

## Description

Chubbyjs container adapter using laminas service manager configuration.

## Requirements

 * node: 12
 * [@chubbyjs/psr-container][2]: ^1.0

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyjs/chubbyjs-laminas-config-factory][1].

```sh
npm i @chubbyjs/chubbyjs-laminas-config-factory@1.0.0
```

## Usage

```ts
import ServiceA from './ServiceA';
import ServiceB from './ServiceB';
import ServiceC from './ServiceC';
import ServiceBFactory from './ServiceBFactory';
import AbstractBaseFactory, { Invokable } from '@chubbyjs/chubbyjs-laminas-config-factory/dist/BaseFactory';
import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';

const ServiceAFactory = Invokable(class extends AbstractBaseFactory {
    public __invoke(container: ContainerInterface): ServiceA {
        return new ServiceA(
            this.resolveConfig(container.get('config').serviceA ?? {}),
            this.resolveDependency<ServiceB>(container, ServiceB.name,  ServiceBFactory),
            this.resolveDependency<ServiceC>(container, ServiceC.name,  ServiceCFactory),
        );
    }
});

// ContainerInterface
const container = ...;

// without name
const serviceA = ServiceAFactory()(container);

// with name
const serviceA = ServiceAFactory('default')(container);
```

## Copyright

Dominik Zogg 2021

[1]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-laminas-config-factory

[2]: https://www.npmjs.com/package/@chubbyjs/psr-container
