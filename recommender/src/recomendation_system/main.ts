import { Hash } from "crypto";

export interface User{
    id?: Hash;
    gender: string;
    max_age: number;
    min_age: number;
}

export function createRecomendation(config: User): {id?: Hash; gender: string; agemin: number; agemax: number}{
    return; 
}