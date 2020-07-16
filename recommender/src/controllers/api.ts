"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import express from "express";
import request from "request";
import postgres from "ts-postgres";
import {Client} from "../recomendation_system/Client";
import { json } from "body-parser";
import { RecAlgoFactory } from "../recomendation_system/RecAlgoFactory";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

export const getUsercategory = async (req: Request, res: Response)=>{
    const app = express();
    const pgconfig = app.get("pgdb");
    // eslint-disable-next-line @typescript-eslint/camelcase
    const factory = new RecAlgoFactory();

    // объект с параметрами рекомендательного метода
    const pClient = {
        gender: req.params.gender,
        // eslint-disable-next-line @typescript-eslint/camelcase
        maxAge: Number(req.params.agemin),
        // eslint-disable-next-line @typescript-eslint/camelcase
        minAge: Number(req.params.agemax)
    };
    // подобрать алгоритм рекомендаций
    const algo = factory.getAlgo(pClient);
    algo.dbConfig = pgconfig;
    // задать параметры клиента, для которого надо подготовить рекомедованные товары
    algo.init(pClient);
    // сформировать список рекомендованных позиций меню
    const recommended = await algo.getRecomendation();
    
    res.json({
        query:{client: pClient},
        result:recommended
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};
