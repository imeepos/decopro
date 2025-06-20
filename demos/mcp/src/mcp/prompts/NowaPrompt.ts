import { injectable } from "@decopro/core";
import { Prompt } from "@decopro/mcp";


@injectable()
export class NowaPrompt {
    @Prompt({
        name: 'nowa'
    })
    async prompt() {
        return [
            { content: ``, role: 'user' }
        ]
    }
}