import {Hash} from "crypto";
import {Client} from "../recomendation_system/Client";

export class Content{
    public orderId: number;
    public userId: number;
    public client: Client;
    public positionId: number;
    public positionQ: number;
}