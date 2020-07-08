"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";
import express from "express";
import request from "request";
import postgres from "ts-postgres";


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

    const pgconfig = express.application.get("pgdb");
    
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
