const db = require("../models");
const User = db.User;
const Review = db.UserReview;

exports.addReview = async (req, res, reviewerId, username, stars, description) => {
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
   
   
}
