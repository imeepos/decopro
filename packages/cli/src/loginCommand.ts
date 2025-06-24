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
        flags: `--email [email]`,
        description: `邮箱`,
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
        const data = {
            email: this.email || this.env.get("EMAIL"),
            password: this.password || this.env.get("PASSWORD")
        };
        const response = await fetch(url, {
            method: "post",
            keepalive: true,
            body: JSON.stringify(data),
            headers: {
                Authorization: `Basic ZGVmYXVsdGtleTo=`,
                [`Content-Type`]: `application/json`
            }
        });
        const body = await response.json();
        const { token, refresh_token } = body;
        if (!token) {
            console.log(`登陆失败`, data);
            return;
        }
        const root = join(this.env.homeDir, ".decopro");
        await ensureDir(root);
        if (token) {
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
            console.log(`登陆成功，保存路径: ${join(root, "config.json")}`);
        }
    }
}
