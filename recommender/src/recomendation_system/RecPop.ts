import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";

export class RecPop extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>>{
        return [];
    }

}