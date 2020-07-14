import { Client } from "./Client";
import { RecAlgo } from "./RecAlgo";
import { RecClientCat } from "./RecClientCat";
import { RecPop } from "./RecPop";

export class RecAlgoFactory{
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getAlgo(client: Client): RecAlgo{
        let result: RecAlgo;
        if(client.gender != null || client.min_age > 0 || client.max_age > 0){
            result = new RecClientCat();
        }
        else{
            result = new RecPop();
        }
        return result;
    }
}