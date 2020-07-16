import { RecAlgo } from "./RecAlgo";
import { RecResult } from "./RecResult";
import { Client } from "./Client";
import { Client as postgresClient}  from 'ts-postgres';

export class RecClientCat extends RecAlgo{
    //реализованный алгоритм knn 
    public k: number
    public pt: any[]
    public classifiers: number[]
    public data: any[][]
    private _results: any[] = []

    public calculate(): any[] {
        this.data.forEach((point: any) => {
            this._results.push({distance: this.eucidianDistance(point, this.pt, 2), result: point})
        })
        this._results = this._results.sort((a: any, b: any) =>
            a.distance < b.distance ? -1 : 1).slice(0, this.k)
        return this._results
    }

    async run(client: Client): Promise<Array<RecResult>> {
        const arrayResult = new Array<RecResult>();
        const db = new postgresClient();
        await db.connect(this.dbConfig);
        try {
            const resultIterator = db.query(
                `SELECT position_id, row_number() OVER(ORDER BY age-${client.minAge} DESC) as place 
                FROM contents WHERE gender = ${client.gender} AND age BETWEEN ${client.minAge} AND ${client.maxAge}
                ORDER BY age-${client.minAge} DESC`,
            );
        
            for await (const row of resultIterator) {
                let result = new RecResult();
                result.productId = row.get('position_id');
                result.place = row.get('place');
                arrayResult.push(result);
            }
        } finally {
            await db.end();
        }
        return arrayResult;
    }

}