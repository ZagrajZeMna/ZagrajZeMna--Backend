const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const userReportMiddleware = require("../middleware/userReport.middleware");
const gameRequestsMiddleware = require("../middleware/gameRequests.middleware");
const reviewMiddleware = require("../middleware/usersReviews.middleware");
const userMiddleware = require("../middleware/user.middleware");
const userReviewsModel = require("../models/userReviews.model");

//Funkcja, która dodaję recenzje o użytkowniku
exports.addReview = async (req, res) => {
    const reviewerId = req.userId;
    const {username, stars, description} = req.body;
    reviewMiddleware.addReview(req, res, reviewerId, username, stars, description);
};

//Funkcja, która dodaję prośbę na temat gry
exports.addGameReq = async (req, res) => {
    const user_id = req.userId;
    const {name_game, description} = req.body;
    gameRequestsMiddleware.addGameReq(req, res, user_id, name_game, description);
};

//Funkcja, która dodaję prośbę na temat gry
exports.reportUser = async (req, res) => {
    const user_id = req.userId;
    const {username, description} = req.body;
    userReportMiddleware.addReport(req, res, user_id, username, description);
};

//Funkcja, która wysyła maila
exports.sendMessage = async (req, res) => {
    const user_id = req.userId;
    const {name, message} = req.body;
    userMiddleware.sendMessage(req, res, user_id, name, message);

};

//Funkcja, która wysyła listę zgłoszeń
exports.getReportUser = async (req, res) => {
    const {page, size} = req.query;
    userReportMiddleware.getReport(req, res, page, size);
};

//Funkcja, która wysyła listę próśb
exports.getRequestGame = async (req, res) => {
    const {page, size} = req.query;
    gameRequestsMiddleware.getGameReq(req, res, page, size);
};

//Funkcja, usuwająca próśbe z listy
exports.deleteGameReq = async (req, res) => {
    const { request_id } = req.body;
    gameRequestsMiddleware.deleteGameReqMiddle(req, res, request_id);
};

//Funkcja, usuwająca zgłoszenia z listy
exports.deleteReport = async (req, res) => {
    const { report_id } = req.body;
    userReportMiddleware.deleteReportMiddle(req, res, report_id);
};

//Funkcja która wysyła opinie o danym użytkowniku
exports.sendReviews = async (req, res) => {
    const { page, size } = req.body;
    const ID_USER = req.userId;
    reviewMiddleware.sendReviewsMiddle(req, res, ID_USER, page, size);
};

exports.sendReviewsByUrl = async (req, res) =>{
    const { id } = req.query;
    const { page, size } = req.body;
    reviewMiddleware.sendReviewsMiddle(req, res, id, page, size);
}