const { INTEGER } = require("sequelize");
const db = require("../models");
const User = db.User;
const ReportUser = db.UserReport;

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

exports.addReport = async (req, res, user_id, username, description) => {  
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

exports.getReport = async (req, res, page, size) => {
    const { limit, offset } = getPagination(page, size);

    try{
        const allUser = await ReportUser.count();

        const UserSet = await ReportUser.findAll({
            limit,
            offset,
            attributes: ['ID_REPORT', 'ID_REPORTING','ID_REPORTED', 'Description']
        });

        if (UserSet.length == 0) {
            return res.status(404).send({ message: "There is no report!" });
        }

        let name_user_set=[];
        var id;
        var sender;
        var reported;
        var description;
        var reportedId;
        for(let i=0; i< UserSet.length; i++){
            id=UserSet[i].ID_REPORT;
            sender = await User.findOne({ where: {ID_USER: UserSet[i].ID_REPORTING}, attributes: ['username']});
            sender = sender.username;
            reported = await User.findOne({ where: {ID_USER: UserSet[i].ID_REPORTED}, attributes: ['username']});
            reportedId = UserSet[i].ID_REPORTED;
            reported = reported.username;
            description = UserSet[i].Description;
            name_user_set.push({id, sender, reported, reportedId, description});
        }
    
        const numberOfPages = Math.ceil(allUser / limit);

        res.status(200).json({User: name_user_set, Pages: numberOfPages});

    }catch(error){
        res.status(500).send({message: "Error during sending report list : "+error.message});
    }     
};

exports.deleteReportMiddle = async (req, res, r_id) => {
    try {
        if (!r_id) {
            return res.status(400).send({ message: "Report ID is required" });
        }

        // Sprawdzanie, czy zgłoszenie istnieje
        const ifExist = await ReportUser.findOne({ where: { ID_REPORT: Number(r_id) } });
        
        if (!ifExist) {
            return res.status(404).send({ message: "There is no such report!" });
        }

        // Usuwanie zgłoszenia z listy
        await ifExist.destroy();

        res.status(200).send({ message: "Delete User report." });
    } catch (error) {
        res.status(500).send({ message: "Error during deleting report: " + error.message });
    }     
};
