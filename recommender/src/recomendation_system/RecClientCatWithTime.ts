import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient} from "ts-postgres";

export class RecClientCatWithTime extends RecAlgo{
    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);

        const timeSchedule = [9, 15, 21];

        await db.connect();
        try {
            //FOR TIME TESTS:
            //const t1 = new Date().getTime();


            const distances = [];
            for (let j = 0; j < timeSchedule.length; j++) { distances.push(Math.abs(new Date().getHours() - timeSchedule[j])); }
            let i = 0;
            for await (const distance of distances) {
                if (distance == Math.min(distances[0], distances[1], distances[2])) { break; }
                i++;
            }

            const selectPart = "SELECT contents.position_id::text, agemin::int, agemax::int, order_date, gender from contents left join menu on contents.position_id = menu.position_id WHERE ";
            const timezoneParts = ["forbreakfast = 1", "forlunch = 1", "fordinner = 1 "];
            const knnPart = "order by gender <-> $1::text, cube(agemin,agemax) <-> cube($2::int,$3::int)::cube asc, abs(order_date::date-now()::date) asc, abs(order_day_of_week::int-$4) asc limit 100";

            const recAll = selectPart+timezoneParts[i]+knnPart;
 
            const resultIterator = db.query(recAll, [client.gender, client.minAge, client.maxAge, new Date().getDay()]);

            let placei: number = 0;            

            for await (const row of resultIterator) {
                const result = new RecResult();
                placei++;
                result.productId = row.get("position_id") as string;
                result.place = placei;
                arrayResult.push(result);
            }



            //FOR TIME TESTS:
            //console.log(new Date().getTime() - t1, "ms");
        }
        catch(e){
            console.log("DB error");
        }
        await db.end();
        return arrayResult;
    }

}