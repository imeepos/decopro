import { Action, Commander } from "@decopro/commander";
import { Injector, inject } from "@decopro/core";
import { runTest } from "@decopro/test";
@Commander({
    name: `test`,
    description: `单元测试`
})
export class TestCommand {
    constructor(@inject(Injector) private injector: Injector) { }
    @Action({})
    async test() {
        const errors = await runTest(this.injector);
        const errMsg = errors
            .filter((it) => !it.result)
            .map((it) => {
                return `${it.target.name}.${it.options.description || it.property.toString()
                    }: Failed`;
            })
            .join("\n");
        console.log(`-------测试结果-----`)
        console.log(errMsg);
    }
}
