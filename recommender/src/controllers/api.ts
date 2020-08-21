"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import request from "request";
import postgres from "ts-postgres";
import {Client} from "../recomendation_system/Client";
import { json } from "body-parser";
import { RecAlgoFactory } from "../recomendation_system/RecAlgoFactory";
import { timeStamp } from "console";


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
    // считывыаем параметры подключения из текущего приложения (app)
    const pgconfig = req.app.get("pgdb");
    // eslint-disable-next-line @typescript-eslint/camelcase
    const factory = new RecAlgoFactory();

    // объект с параметрами рекомендательного метода
    const pClient = {
        gender: req.params.gender,
        // eslint-disable-next-line @typescript-eslint/camelcase
        maxAge: Number(req.params.agemax),
        // eslint-disable-next-line @typescript-eslint/camelcase
        minAge: Number(req.params.agemin),
        // eslint-disable-next-line @typescript-eslint/camelcase
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

export const getUserCategoryWithTime = async (req: Request, res: Response)=>{
    // считывыаем параметры подключения из текущего приложения (app)
    const pgconfig = req.app.get("pgdb");
    // eslint-disable-next-line @typescript-eslint/camelcase
    const factory = new RecAlgoFactory();

    const pClient = {
        gender: req.params.gender,
        // eslint-disable-next-line @typescript-eslint/camelcase
        maxAge: Number(req.params.agemax),
        // eslint-disable-next-line @typescript-eslint/camelcase
        minAge: Number(req.params.agemin),
        // eslint-disable-next-line @typescript-eslint/camelcase
        timeHours: new Date(parseInt(req.params.time) * 1000)
    };

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
