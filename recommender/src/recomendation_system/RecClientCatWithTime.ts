import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";

export class RecClientCatWithTime extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);

        const timeSchedule = [9, 15, 21];

        await db.connect();
        try {
            let i = 0;
            const distances = [];
            const curPeriod = [0, 0, 0];
            for await (const timestamp of timeSchedule) {
                const dist = Math.abs(new Date().getHours() - timeSchedule[i]);
                i++;
                distances.push(dist);
            }
            i = 0;
            for await (const distance of distances) {
                if (distance == Math.min(distances[0], distances[1], distances[2])) {
                    curPeriod[i] = 1;
                    break;
                }
                i++;
            }

            const queries = ["select position_id:: text from menu where forbreakfast = 1:: int", "select position_id::text from menu where forlunch = 1::int","select position_id::text from menu where fordinner = 1::int"];
            const menuFilter = db.query(queries[i]);

            const recAll = `SELECT position_id::text, agemin::int, agemax::int, order_date::date from contents
	        order by gender <-> $1::text, cube(agemin,agemax) <-> cube($2::int,$3::int)::cube asc, abs(order_date::date-now()::date) asc, abs(order_day_of_week::int-$4) asc
	        limit 20`;
 
            const resultIterator = db.query(recAll, [client.gender, client.minAge, client.maxAge, new Date().getDay()]);

            let placei: number = 0;            

            for await (const row of resultIterator) {
                for await (const item of menuFilter) {
                    if (item.get("position_id") == row.get("position_id")) {
                        const result = new RecResult();
                        result.productId = row.get("position_id") as string;
                        result.place = placei;
                        arrayResult.push(result);
                        placei++;
                    }
                }
            }
        }
        catch(e){
            console.log("DB error");
        }
        await db.end();
        return arrayResult;
    }

}