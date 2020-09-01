import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from "ts-postgres";

export class RecClientCat extends RecAlgo{
    //реализованный алгоритм knn 
    public k: number
    public pt: any[]
    public classifiers: number[]
    public data: any[][]
    private _results: any[] = []

    public calculate(): any[] {
        this.data.forEach((point: any) => {
            this._results.push({distance: this.eucidianDistance(point, this.pt, 2), result: point});
        });
        this._results = this._results.sort((a: any, b: any) =>
            a.distance < b.distance ? -1 : 1).slice(0, this.k);
        return this._results;
    }

    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient(this.dbConfig);
        await db.connect();
        try {
            //const sql = `SELECT position_id::text, (row_number() OVER(ORDER BY agemin-$2::int asc, count(*) DESC))::int as place 
            //FROM contents WHERE gender = $1::text AND agemin BETWEEN $2::int AND $3::int
            //group by position_id, agemin
            //ORDER BY place asc
            //limit 20`;

            const sql = `SELECT position_id::text, agemin::int, agemax::int, order_date::date from contents
	        order by gender <-> $1::text, cube(agemin,agemax) <-> cube($2::int,$3::int)::cube asc, abs(order_date::date-now()::date) asc, abs(order_day_of_week::int-$4) asc
	        limit 20`;
            

            const resultIterator = db.query(sql, [client.gender, client.minAge, client.maxAge, new Date().getDay()]);

            let placei: number = 0;

            for await (const row of resultIterator) {
                const result = new RecResult();
                placei++;
                result.productId = row.get("position_id") as string;
                result.place = placei;
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