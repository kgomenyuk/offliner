import { Hash } from "crypto";

export class Client{
    public id?: Hash;
    public gender: string;
    public maxAge: number;
    public minAge: number;
    public forBreakfast?: number;
    public forLunch?: number;
    public forDinner?: number;
}