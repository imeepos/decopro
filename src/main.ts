import "reflect-metadata";
import {CONTROLLER_TOKEN, Controller} from "@decopro/rest";
import {Injector, Input, container} from "@decopro/core";

@Controller({})
export class HelloWorld {
  @Input({})
  title: string = `hello`;
}

const injector = container.resolve(Injector);
const controllers = injector.getAll(CONTROLLER_TOKEN);
const json = injector.toJson(new HelloWorld(), HelloWorld);
const instance = injector.fromJson(json);
console.log({json, instance, controllers});
