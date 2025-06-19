import "reflect-metadata";
import {Injector, Input, bootstrap, inject} from "@decopro/core";
import {Commander, Action, Option, Argument} from "@decopro/commander";
import {z} from "zod";
import {CommanderAppInit} from "./CommanderAppInit";
@Commander({
  name: `start`,
  description: `启动命令`
})
export class StartCommander {
  @Argument({
    name: `[type]`,
    description: `启动类型 mcp-server`
  })
  @Input({})
  type: `mcp-server`;

  @Option({
    flags: `--port [port]`,
    description: `端口号`,
    zod: z.coerce.number()
  })
  @Input({})
  port: number;

  @Option({
    flags: "--host [host]",
    description: `主机地址`,
    zod: z.coerce.string()
  })
  @Input({})
  host: string;

  constructor(@inject(Injector) private injector: Injector) {}
  @Action({})
  async action() {
    console.log(this.injector.toJson(this, StartCommander));
  }
}
async function main() {
  await bootstrap([CommanderAppInit]);
}
main();
