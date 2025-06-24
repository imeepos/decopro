import { Action, Commander, Option } from "@decopro/commander";
import { inject } from "@decopro/core";
import { z } from "zod";
import { EnvService } from "./services";
import { join } from "path";
import { ensureDir, writeFile } from "fs-extra";
@Commander({
    name: `login`,
    description: `登陆`
})
export class LoginCommand {
    constructor(@inject(EnvService) private env: EnvService) {}
    @Option({
        flags: `--email [email	]`,
        description: `油箱`,
        zod: z.coerce.string()
    })
    email: string;

    @Option({
        flags: `--password [password]`,
        description: `密码`,
        zod: z.coerce.string()
    })
    password: string;

    @Action({})
    async run() {
        const url = `${this.env.baseUrl}/v2/account/authenticate/email?create=false&=`;
        const response = await fetch(url, {
            method: "post",
            keepalive: true,
            body: JSON.stringify({
                email: this.email,
                password: this.password
            }),
            headers: {
                Authorization: `Basic ZGVmYXVsdGtleTo=`,
                [`Content-Type`]: `application/json`
            }
        });
        const body = await response.json();
        const { token, refresh_token } = body;
        const root = join(this.env.homeDir, ".decopro");
        await ensureDir(root);
        await writeFile(
            join(root, "config.json"),
            JSON.stringify(
                {
                    token,
                    refresh_token
                },
                null,
                2
            )
        );
        console.log(`登陆成功: ${token} path: ${join(root, "config.json")}`);
    }
}
