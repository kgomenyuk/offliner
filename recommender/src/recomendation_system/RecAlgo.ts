import { Client } from "./Client";
import { RecResult } from "./RecResult";

export class RecAlgo{


    mClient: Client;


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init(client: Client): void{
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.mClient = client;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getRecomendation(): Array<RecResult>{

        let arrResult = [];
        if(this.mClient != null){
            arrResult = this.run(this.mClient);
        }
        
        return arrResult;
    }
    run(client: Client): Array<RecResult> {
        return [];
    }


}