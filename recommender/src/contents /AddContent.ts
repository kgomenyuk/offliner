import {Content} from "./Content";
import { Client as postgresClient}  from "ts-postgres";

export class AddContent{
    public dbConfig: any;
    public content: Content;
    public async Insert(): Promise<boolean> {
        const db = new postgresClient(this.dbConfig);
        await db.connect();
        try {
            let ngender = 0;

            if(this.content.client.gender=="m"){
                ngender = 1;
            }

            if(this.content.client.timeHours == null){
                this.content.client.timeHours = new Date();
            }
            const sql = `INSERT INTO contents (order_id, user_id, gender, agemin, agemax, position_id, position_q, ngender) VALUES ($1::int, $2::int, $3::text, $4::int, $5::int, 
                    $6::int, $7::int, $11::int) RETURNING contents_id
                `;
            
            const resultIterator = db.query(sql, [this.content.orderId, this.content.userId, this.content.client.gender,
                this.content.client.minAge, this.content.client.maxAge, this.content.positionId, this.content.positionQ, ngender]);
            
            for await (const row of resultIterator) {
                console.log(row.get("contents_id"));
            }
        }
        catch(e){
            console.log(e);
            return false;
        }
        await db.end();
        return true;
    }
}