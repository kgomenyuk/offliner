import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";

export class RecPop extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>>{
        return [];
    }
}