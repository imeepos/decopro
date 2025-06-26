import { Client } from "./client";
import { Session } from "./session";

export interface AddAdminPlanRpcInput {
    name: string;
    description?: string;
    price: number;
    duration: number;
    features?: string;
    settings?: any;
    groupId?: string;
}
export interface AddAdminPlanRpcOutput {
    success: boolean;
    planId: string;
    groupId: string;
}
export class NakamaRpc {
    constructor(private client: Client, private session: Session) { }

    async addAdminPlanRpc(input: AddAdminPlanRpcInput): Promise<AddAdminPlanRpcOutput | undefined> {
        return await this.client.rpc(this.session, `add_admin_plan`, input).then(res => res.payload as AddAdminPlanRpcOutput)
    }
}