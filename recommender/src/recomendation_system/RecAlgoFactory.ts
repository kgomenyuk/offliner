import { Client } from "./Client";
import { RecAlgo } from "./RecAlgo";
import { RecClientCat } from "./RecClientCat";
import { RecPop } from "./RecPop";
import { RecClientCatWithTime } from "./RecClientCatWithTime";


export class RecAlgoFactory{
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public getAlgo(client: Client): RecAlgo{
        let result: RecAlgo;
        if (client.gender != null && client.minAge > 0 && client.maxAge > 0 && client.timeHours != null) {
            result = new RecClientCatWithTime();
        }
        else if(client.gender != null || client.minAge > 0 || client.maxAge > 0){
            result = new RecClientCat();
        }
        else{
            result = new RecPop();
        }
        return result;
    }
}
