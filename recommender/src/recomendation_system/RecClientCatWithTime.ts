import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";
import { forEach } from "async";
import { time } from "console";
import { cli } from "winston/lib/winston/config";

export class RecClientCatWithTime extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);

        const timeSchedule = [9, 15, 21]


        await db.connect();
        try {
            let curPeriod: number = 0;
            for await (const timestamp of timeSchedule) {
                if (new Date().getHours() - timestamp < 0) { break; }
                else { curPeriod = timestamp; }
            }

            const sql = `SELECT position_id::text, agemin::int, agemax::int, order_date::date from contents
	        order by gender <-> $1::text, cube(agemin,agemax) <-> cube($2::int,$3::int)::cube asc, cube(extract(hour from now())) <-> cube($5), abs(order_date::date-now()::date) asc, abs(order_day_of_week::int-$4) asc
	        limit 20`;
 
            const resultIterator = db.query(sql, [client.gender, client.minAge, client.maxAge, new Date().getDay(), curPeriod]);
            
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