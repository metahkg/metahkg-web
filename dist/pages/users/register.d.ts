/// <reference types="react" />
import "./css/register.css";
/**
 * Register component for /users/register
 * initially 3 text fields and a Select list (Sex)
 * When verification is pending
 * (waiting for user to type verification code sent to their email address),
 * there would be another textfield alongside Sex for the verification code
 * a captcha must be completed before registering, if registering fails,
 * the captcha would reload
 * process: register --> verify --> account created -->
 * redirect to query.returnto if exists, otherwise homepage after verification
 * If user already logged in, he is redirected to /
 * @returns register page
 */
export default function Register(): JSX.Element;
