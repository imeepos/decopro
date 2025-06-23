import { Action, Commander, Option } from "@decopro/commander";
import { inject, Injector } from "@decopro/core";
import { generateTSKnowledges } from '@decopro/docs'
import { writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";

@Commander({
    name: `docs`,
    description: `文档`
})
export class DocsCommand {
    @Option({
        flags: `--path [path]`,
        description: `项目地址`,
        zod: z.coerce.string()
    })
    path: string;
    constructor(@inject(Injector) private injector: Injector) { }
    @Action({})
    async run() {
        let root = this.path
        if (root.startsWith('./')) {
            root = path.join(process.cwd(), root)
        }
        const knowledges = generateTSKnowledges(root)
        const readMe = path.join(root, 'README.md')
        await writeFile(readMe, JSON.stringify(knowledges, null, 2))
    }
}