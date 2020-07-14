"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import express from "express";
import request from "request";
import postgres from "ts-postgres";
import {createRecomendation} from "../recomendation_system/main";
import {Client} from "../recomendation_system/Client";
import { json } from "body-parser";


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
    const recommended_goods = createRecomendation(
                 {
            gender: req.params.gender,
            // eslint-disable-next-line @typescript-eslint/camelcase
            max_age: Number(req.params.agemin),
            // eslint-disable-next-line @typescript-eslint/camelcase
            min_age: Number(req.params.agemax)
        });
    res.json({
        query:{gender:"", agemin:0, agemax:0},
        result:[]
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
