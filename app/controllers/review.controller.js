const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Review = db.UserReview;
const GameReq = db.GameRequests;
const ReportUser = db.UserReport;


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
    const user_id = req.userId;
    const {name_game, description} = req.body;

    try{
        //Sprawdzanie czy gracz wysyłający prośbę istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }

        //Dodawanie recenzji
        const newGameReq = await GameReq.create({
            ID_USER: user_id,
            GameName: name_game,
            Description: description
        });
      
        res.status(200).send({
            message: "Game request was send.",
            gameRequestDetails: {
              ID_REQUEST: newGameReq.ID_REQUEST,
              ID_USER: newGameReq.ID_USER,
              GameName: newGameReq.GameName,
              Description: newGameReq.Description,
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding request: "+error.message});
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
        const ifReportedExist = await User.findOne({where: {username: username}, attributes: ['ID_USER', 'isBanned']});
        
        if(!ifReportedExist){
            return res.status(404).send({message:"There is no such user. Username is incorrect!"});
        }

        if(ifReportedExist.isBanned){
            return res.status(405).send({message:"This user is already banned!"});
        }

        //Dodawanie zgłoszenia
        const newReported = await ReportUser.create({
            ID_REPORTING: user_id,
            ID_REPORTED: ifReportedExist.ID_USER,
            Description: description
        });
      
        res.status(200).send({
            message: "A report was send.",
            gameRequestDetails: {
                ID_REPORT: newReported.ID_REPORT,
                ID_USER: newReported.ID_REPORTING,
                ID_Reported: newReported.ID_REPORTED,
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
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}, attributes: ["username", "email"]});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }

        const regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

        if(!(regex.test(ifUserExist.email))){
            return res.status(404).send({message:"Email of user is incorect!"});
        }

        nodemailer.sendQuestion(
            name,
            message+"\n\n"+ifUserExist.username+"\n"+ifUserExist.email
        );

          res.status(200).send({message:"Email was send!"});

    }catch(error){
        res.status(500).send({message: "Error during adding review : "+error.message});
    }     

};

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

//Funkcja, która wysyła listę zgłoszeń
exports.getReportUser = async (req, res) => {
    const {page, size} = req.query;

    const { limit, offset } = getPagination(page, size);
    
    try{
        const allUser = await ReportUser.count();

        const UserSet = await ReportUser.findAll({
            limit,
            offset,
            attributes: ['ID_REPORTING','ID_REPORTED', 'Description']
        });

        if (UserSet.length == 0) {
            return res.status(404).send({ message: "There is no report!" });
        }

        let name_user_set=[];
        var sender;
        var reported;
        var description;
        for(let i=0; i< UserSet.length; i++){
            sender = await User.findOne({ where: {ID_USER: UserSet[i].ID_REPORTING}, attributes: ['username']});
            sender = sender.username;
            reported = await User.findOne({ where: {ID_USER: UserSet[i].ID_REPORTED}, attributes: ['username']});
            reported = reported.username;
            description = UserSet[i].Description;
            name_user_set.push({sender, reported, description});
        }
    
        const numberOfPages = Math.ceil(allUser/ limit);


        res.status(200).json({User: name_user_set, Pages: numberOfPages});

    }catch(error){
        res.status(500).send({message: "Error during sending report list : "+error.message});
    }     

};

//Funkcja, która wysyła listę próśb
exports.getRequestGame = async (req, res) => {
    const {page, size} = req.query;

    const { limit, offset } = getPagination(page, size);
    
    try{
        const allGame = await GameReq.count();

        const gameSet = await GameReq.findAll({
            limit,
            offset,
            attributes: ['ID_USER','GameName', 'Description']
        });

        if (gameSet.length == 0) {
            return res.status(404).send({ message: "There is no request!" });
        }

        let game_user_set=[];
        var user;
        var name;
        var description;
        for(let i=0; i< gameSet.length; i++){
            user = await User.findOne({ where: {ID_USER: gameSet[i].ID_USER}, attributes: ['username']});
            user = user.username;
            name = gameSet[i].GameName;
            description = gameSet[i].Description;
            game_user_set.push({user, name, description});
        }
    
        const numberOfPages = Math.ceil(allGame/ limit);


        res.status(200).json({game: game_user_set, Pages: numberOfPages});

    }catch(error){
        res.status(500).send({message: "Error during sending report list : "+error.message});
    }     

};
