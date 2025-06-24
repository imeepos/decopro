import { Action, Commander } from "@decopro/commander";
import { inject } from "@decopro/core";
import { EnvService } from "./services";

@Commander({
    name: `config`,
    description: `查看配置`
})
export class ConfigCommand {
    constructor(@inject(EnvService) private env: EnvService) {}
    @Action({})
    async run() {
        console.log(this.env.config);
    }
}
