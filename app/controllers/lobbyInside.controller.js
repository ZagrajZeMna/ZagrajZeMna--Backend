const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const lobbyInsideMiddleware = require("../middleware/userInLobby.middleware");

//pobranie tokena json
var jwt = require("jsonwebtoken");

//Funkcja, która na podstawie id lobby zwraca nicki oraz ścieżki do awatara użytkowników, którzy są wewnątrz danego lobby
exports.getUserList = async (req, res) => {
    const {lobbyId} = req.query;
    lobbyInsideMiddleware.getUserInLobby(req, res, lobbyId);
};

//Funkcja, która na podstawie id lobby zwraca id i nickname właściciela.
exports.getOwnerLobbyData = async (req, res) => {
    const {lobbyId} = req.query;
    lobbyInsideMiddleware.getOwner(req, res, lobbyId);    
};

//Funkcja zmieniająca ustawienia lobby
exports.updateLobbyStillLooking = async (req, res) => {
    const {lobbyId} = req.query;
    lobbyInsideMiddleware.changeStillLoking(req, res, lobbyId);    
};

//Funkcja zmieniająca ustawienia lobby
exports.updateLobbyDescription = async (req, res) => {
    const {lobbyId, description} = req.query;
    lobbyInsideMiddleware.updateDescription(req, res, lobbyId, description);    
};

//Funkcja zmieniająca właściciela lobby
exports.changeLobbyOwner = async (req, res) => {
    const {lobbyId, newOwnerId} = req.query;
    lobbyInsideMiddleware.changeOwner(req, res, lobbyId, newOwnerId);    
};


//Funkcja, która na podstawie id gracza usuwa go z lobby.
exports.deleteUser = async (req, res) => {
    const {lobbyId, username} = req.query;
    lobbyInsideMiddleware.deleteUser(req, res, lobbyId, username);        
};

//Funkcja, która usuwa lobby.
exports.deleteLobby = async (req, res) => {
    const {lobbyId, userId} = req.query;
    lobbyInsideMiddleware.deleteLobby(req, res, lobbyId, userId);                    
};

exports.latest100messages = async (req,res) =>{
    const lobbyId = req.body.room;
    lobbyInsideMiddleware.latest100(req, res, lobbyId);
};
