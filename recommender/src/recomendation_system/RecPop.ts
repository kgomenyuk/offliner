import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";

export class RecPop extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>>{
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);
        await db.connect();
        try {
            const sql = "";
            const resultIterator = db.query(sql, [client.timeHours]);
            
            for await (const row of resultIterator) {
                const result = new RecResult();
                result.productId = row.get("position_id") as string;
                result.place = row.get("place") as number;
                arrayResult.push(result);
            }
        }

        catch(e){
            console.log("DB error");
        }
        await db.end();
        return arrayResult;
    }

}