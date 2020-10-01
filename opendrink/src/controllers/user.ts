import async from "async";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User, UserDocument, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import * as password from "../util/password";
import * as userEntity from "../entity/user";
import {getRepository} from "typeorm";

/**
 * GET /login
 * Login page.
 */
export const getLogin = (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/login", {
        title: "Login"
    });
};

/**
 * POST /login
 * Sign in using email and password.
 */


/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
};

/**
 * GET /signup
 * Signup page.
 */
export const getSignup = (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/signup", {
        title: "Create Account"
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
    await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    console.log(req.body.email);
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.redirect("/signup");
    }
    
    const userDB = await getRepository(User).find({where: {email:req.body.email}});
    if (userDB.length>0){
        req.flash("errors", { msg: "Account with that email address already exists." });
        return res.redirect("/signup");
    }
    const truepass = password.generateHashPassword(req.body.password);
    const newUser = new userEntity.User();
    newUser.email=req.body.email;
    newUser.hash=(await truepass).hash;
    newUser.salt=(await truepass).salt;
    newUser.iterations=(await truepass).iterations;
    getRepository(User).save(newUser);
};

/**
 * GET /account
 * Profile page.
 */
export const getAccount = (req: Request, res: Response) => {
    res.render("account/profile", {
        title: "Account Management"
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */

/**
 * POST /account/password
 * Update current password.
 */


/**
 * POST /account/delete
 * Delete user account.
 */
export const postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    User.remove({ _id: user.id }, (err) => {
        if (err) { return next(err); }
        req.logout();
        req.flash("info", { msg: "Your account has been deleted." });
        res.redirect("/");
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */


/**
 * GET /reset/:token
 * Reset Password page.
 */


/**
 * POST /reset/:token
 * Process the reset password request.
 */


/**
 * GET /forgot
 * Forgot Password page.
 */
export const getForgot = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("account/forgot", {
        title: "Forgot Password"
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */

