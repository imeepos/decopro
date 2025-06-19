# 示例代码


# rest

```ts
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
```

# commander
```ts
import "reflect-metadata";
import { Input, bootstrap } from "@decopro/core";
import { Commander, Argument, Action, Option, CommanderAppInit } from "@decopro/commander";
import { z } from 'zod'
@Commander({
  name: `start`,
  description: `启动服务器`
})
export class StartCommander {

  @Argument({
    name: `command`,
    description: `启动的服务`
  })
  @Input({})
  command: string;

  @Option({
    flags: `--port`,
    description: `端口号`,
    zod: z.coerce.number()
  })
  @Input({})
  port: number;

  @Option({
    flags: '--host',
    description: `主机地址`,
    zod: z.coerce.string()
  })
  @Input({})
  host: string;

  constructor() { }

  @Action({})
  async action() {
    console.log({})
  }
}

bootstrap([
  CommanderAppInit,
])
```