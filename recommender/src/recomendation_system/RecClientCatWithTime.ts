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
            let sql = `SELECT contents.position_id::int, (row_number() OVER(ORDER BY $2::int asc, count(*) DESC))::int as place
            FROM contents JOIN menu ON contents.position_id = menu.position_id WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::int AND forbreakfast = 1
            group by contents.position_id, agemin
            ORDER BY place asc
            limit 20`;

            if (client.timeHours.getHours() >= startLunch || client.timeHours.getHours() < startDinner){
                sql = `SELECT contents.position_id::int, (row_number() OVER(ORDER BY $2::int asc, count(*) DESC))::int as place
            FROM contents JOIN menu ON contents.position_id = menu.position_id WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::int AND forlunch = 1
            group by contents.position_id, agemin
            ORDER BY place asc
            limit 20`;
            }
            else (client.timeHours.getHours() >= startDinner);{
                sql = `SELECT contents.position_id::int, (row_number() OVER(ORDER BY $2::int asc, count(*) DESC))::int as place
            FROM contents JOIN menu ON contents.position_id = menu.position_id WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::int AND fordinner = 1
            group by contents.position_id, agemin
            ORDER BY place asc
            limit 20`;
            }
            
            const resultIterator = db.query(sql, [client.gender, client.minAge, client.maxAge]);
            
            for await (const row of resultIterator) {
                const result = new RecResult();
                result.productId = row.get("position_id") as string;
                result.place = row.get("place") as number;
                // сохраняем новый объект в массив с результатами
                arrayResult.push(result);
            }
        }
        catch(e){
            console.log(e);
        }
        await db.end();
        return arrayResult;
    }

}