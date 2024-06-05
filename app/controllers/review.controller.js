const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Review = db.UserReview;
const GameReq = db.GameRequests;

//pobranie tokena json
var jwt = require("jsonwebtoken");


//Funkcja, która dodaję recenzje o użytkowniku
exports.addReview = async (req, res) => {
    const reviewerId = req.userId;
    const {username, stars, description} = req.body;
    const localdate = new Date();

    try{
        //Sprawdzanie czy gracz wystawiający opinie istnieje
        const ifReviewerExist = await User.findOne({where: {ID_USER: Number(reviewerId)}});
        
        if(!ifReviewerExist){
            return res.status(403).send({message:"There is no such user. Id of reviewer is incorrect!"});
        }

        //Pobieranie Id gracza na podstawie imienia
        const ifUserExist = await User.findOne({where: {username: username}, attributes: ['ID_USER']});

        //Sprawdzanie czy gracz, któremu wystawiają opinie istnieje
        //const ifUserExist = await User.findOne({where: {ID_USER: Number(aboutId)}});
        
        if(!ifUserExist){
            return res.status(404).send({message:"There is no such user. Username is incorrect!"});
        }
        const aboutId = ifUserExist.ID_USER;
        //Sprawdzanie czy ktoś nie wystawia opini o samym sobie
        if(reviewerId == aboutId){
            return res.status(405).send({message:"Users can't leave reviews for themself!"});
        }
        
        //Sprawdzanie czy gracz nie wystawił już wcześniej opini temu graczowi
        const ifReviewExist = await Review.findOne({where: {ID_REVIEWER: Number(reviewerId), ID_ABOUT: Number(aboutId)}});
        
        if(ifReviewExist){
            return res.status(406).send({message:"Reviewer has alrady leave review about this user!"});
        }


        //Sprawdzanie czy ocena jest podana w skali całkowitej w przedziale <1, 5>
        if(stars<1 || stars>5 || (parseInt(stars) != stars)){
            return res.status(407).send({message:"Stars are incorrect!"});
        }


        //Dodawanie recenzji
        const newReview = await Review.create({
            ID_REVIEWER: reviewerId,
            ID_ABOUT: aboutId,
            stars: stars,
            description: description,
            date: (localdate.getUTCFullYear()+"-"+(localdate.getUTCMonth()+1)+"-"+localdate.getUTCDate()),
            time: (localdate.getUTCHours()+":"+localdate.getUTCMinutes()+":"+localdate.getUTCSeconds())
          });
      
          res.status(200).send({
            message: "Review was added to database.",
            newRewievDetails: {
              ID_REVIEW: newReview.ID_REVIEW,
              ID_REVIEWER: newReview.ID_REVIEWER,
              ID_ABOUT: newReview.ID_ABOUT,
              stars: newReview.stars,
              description: newReview.description,
              date: newReview.date,
              time: newReview.time
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding review : "+error.message});
    }     

};

//Funkcja, która dodaję prośbę na temat gry
exports.addGameReq = async (req, res) => {
    const user_id = 1;//req.userId;
    //const sender_id = 1;
    const {name_game, description} = req.body;

    try{
        //Sprawdzanie czy gracz wysyłający prośbę istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }

        //Sprawdzanie czy gracz, który wysyła prośbę istnieje
        const ifSenderExist = await User.findOne({where: {ID_USER: Number(sender_id)}});
        
        if(!ifSenderExist){
            return res.status(404).send({message:"There is no such user. Id of sender is incorrect!"});
        }

        //Dodawanie recenzji
        const newGameReq = await GameReq.create({
            ID_USER: user_id,
            ID_SENDER: sender_id,
            GameName: name_game,
            Description: description
        });
      
        res.status(200).send({
            message: "Game request was send.",
            gameRequestDetails: {
              ID_REQUEST: newGameReq.ID_REQUEST,
              ID_USER: newGameReq.ID_USER,
              ID_SENDER: newGameReq.ID_SENDER,
              GameName: newGameReq.GameName,
              Description: newGameReq.Description
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding review : "+error.message});
    }     

};

//Funkcja, która dodaję prośbę na temat gry
exports.reportUser = async (req, res) => {
    const user_id = req.userId;
    const {username, description} = req.body;

    try{
        //Sprawdzanie czy gracz wysyłający prośbę istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }

        //Pobieranie Id gracza na podstawie imienia
        const ifReportedExist = await User.findOne({where: {username: username}, attributes: ['ID_USER']});
        
        if(!ifReportedExist){
            return res.status(404).send({message:"There is no such user. Username is incorrect!"});
        }

        //Dodawanie recenzji
        const newReported = await GameReq.create({
            ID_USER: user_id,
            ID_Reported: ifReportedExist.ID_USER,
            Description: description
        });
      
        res.status(200).send({
            message: "A request was send.",
            gameRequestDetails: {
              ID_REPORT: newReported.ID_REQUEST,
              ID_USER: newReported.ID_USER,
              ID_Reported: newReported.ID_SENDER,
              Description: newReported.Description
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during sending report : "+error.message});
    }     

};

//Funkcja, która dodaję prośbę na temat gry
exports.sendMessage = async (req, res) => {
    const user_id = req.userId;
    const {name, message} = req.body;

    try{
        //Sprawdzanie czy gracz wysyłający prośbę istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}, attributes: ["email"]});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }
      
    }catch(error){
        res.status(500).send({message: "Error during adding review : "+error.message});
    }     

};
