import { Action, Commander } from "@decopro/commander";

@Commander({
    name: "online",
    description: `上线`
})
export class OnlineCommand {
    @Action({})
    async run() {}
}
