import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";

export class RecClientCatWithTime extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);
        const startLunch = 12;
        const startDinner = 17;
        await db.connect();
        try {
            let ingestion: string;
            if (client.timeHours.getHours() >= startLunch || client.timeHours.getHours() <= startDinner){
                ingestion = "forlunch"
            }
            else if (client.timeHours.getHours() >= startDinner){
                ingestion = "fordinner"
            }
            else{
                ingestion = "forbreakfast"
            }
            let sql: string;
            sql = `SELECT position_id::text, (row_number() OVER(ORDER BY agemin-$2::int asc, count(*) DESC))::int as place 
            FROM contents WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::text = 1
            group by position_id, agemin
            ORDER BY place asc
            limit 20`;
            
            const resultIterator = db.query(sql, [client.gender, client.minAge, client.maxAge, ingestion]);
            
            for await (const row of resultIterator) {
                const result = new RecResult();
                result.productId = row.get("position_id") as string;
                result.place = row.get("place") as number;
                // сохраняем новый объект в массив с результатами
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