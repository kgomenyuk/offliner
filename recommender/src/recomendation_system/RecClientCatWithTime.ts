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
            let forbreakfast = 0;
            let forlunch = 0;
            let fordiner = 0;

            if (client.timeHours.getHours() >= startLunch || client.timeHours.getHours() <= startDinner){
                forlunch = 1;
            }
            else if (client.timeHours.getHours() >= startDinner){
                fordiner = 1;
            }
            else{
                forbreakfast = 1;
            }

            const sql = `SELECT position_id::text, (row_number() OVER(ORDER BY agemin-$2::int asc, count(*) DESC))::int as place,
            forbreakfast::int, forlunch::int, fordinner::int
            FROM contents WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::text = 1
            AND forbreakfast = $4::int AND forlunch = $5::int AND fordinner = $6::int}
            group by position_id, agemin
            ORDER BY place asc
            limit 20`;
            
            const resultIterator = db.query(sql, [client.gender, client.minAge, client.maxAge, forbreakfast, forlunch, fordiner]);
            
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