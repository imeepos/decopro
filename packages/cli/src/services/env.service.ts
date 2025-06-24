import { injectable, singleton } from "@decopro/core";
import { homedir } from "os";
import { config } from "dotenv";
import { join } from "path";
import { exists } from "fs-extra";
@injectable()
@singleton()
export class EnvService {
    config: { token: string; refresh_token: string };
    constructor() {
        config({
            path: join(this.decopro, ".env")
        });
    }

    async onInit() {
        const configPath = join(this.decopro, "config.json");
        const isExisits = await exists(configPath);
        if (isExisits) {
            this.config = require(configPath);
        }
    }

    get(key: string): string | undefined {
        if (key === "token" && this.config) return this.config.token;
        if (key === "refresh_token" && this.config)
            return this.config.refresh_token;
        const val = Reflect.get(process.env, key as string);
        return val;
    }

    get baseUrl() {
        return this.get(`API_URL`) || `https://nakama.bowong.cc`;
    }

    get homeDir() {
        return homedir();
    }

    get decopro() {
        return join(this.homeDir, ".decopro");
    }
}
