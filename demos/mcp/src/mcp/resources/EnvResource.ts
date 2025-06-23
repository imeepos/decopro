import { injectable } from "@decopro/core";
import { Resource } from "@decopro/mcp";

@injectable()
export class EnvResource {
    @Resource({
        name: `env`,
        uriOrTemplate: `env`,
        config: {}
    })
    async getEnvResource(): Promise<string> {
        return `env`;
    }
}
