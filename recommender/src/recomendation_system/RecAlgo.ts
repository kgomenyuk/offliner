import { Client } from "./Client";
import { RecResult } from "./RecResult";

export class RecAlgo{
    //конфигурация подключения к базе данных
    public dbConfig: any;

    mClient: Client;


    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init(client: Client): void{
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.mClient = client;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async getRecomendation(): Promise<Array<RecResult>>{

        let arrResult = [] as Array<RecResult>;
        if(this.mClient != null){
            arrResult = await this.run(this.mClient);
        }
        
        return arrResult;
    }
    // реализуйте этот метод в своем классе
    // основной мето алгоритма
    async run(client: Client): Promise<Array<RecResult>> {
        return [];
    }
    // расчет расстояния евклида
    eucidianDistance (a: any[], b: any[], dimensions: number) {
        if (a.length !== b.length) { return null; }
        let sum = 0;
        for (let i = 0; i < dimensions; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return Math.sqrt(sum);
    }

    // расчет расстояния хэмминга
    hammingDistance (a: any[], b: any[]) {
        if (a.length !== b.length) { return null; }
        let d = 0;
        let i: number = a.length;
        while (i--) {
            if (a[i] !== b[i]) { d++; }
        }
        return d;
    }
}