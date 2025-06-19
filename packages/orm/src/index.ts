import {createClassDecorator, createPropertyDecorator} from "@decopro/core";

export const Entity = createClassDecorator(`ENTITY`);
export const Column = createPropertyDecorator(`Column`);
export const ManyToOne = createPropertyDecorator(`ManyToOne`);
export const OneToMany = createPropertyDecorator(`OneToMany`);
export const ManyToMany = createPropertyDecorator(`ManyToMany`);
export const OneToOne = createPropertyDecorator(`OneToOne`);
