import express, {Express, Request, Response, Router, application} from "express"
import Profile, {IProfile} from "../models/profileModel";
import fileUpload, {UploadedFile} from "express-fileupload";
import mimeTypes from "mime-types"
import isAdmin from "./isAdmin";
import Joi, { func } from "joi";
import cors from "cors";

const profileRoute: Router = express.Router();


profileRoute.use(cors());

profileRoute.use(
	express.urlencoded({
		extended: true,
	})
);
profileRoute.use(express.json());
profileRoute.use(fileUpload());
// Initial profile info:
let initPicture = "assets/images/me.png";
let initIntro = `
        <p style="font-size: 30px;">
            Hi, I am <span class="greener">KIBONGO Simon Peter</span>
        </p>
        <p style="letter-spacing: 2px;">
            I <span class="greener">CREATE</span><br>
            Innovative <span class="greener">solutions</span><br>
            With <span class="greener">clean</span> code and<br>
            <span class="greener">User-centric</span> design. 
        </p>
        <p>
            Let's embark on this coding journey together!
        </p>`;

// Send profile info

profileRoute.get("/", async(req: Request, res: Response)=>{
    let profile: IProfile[] = await Profile.find({});
    if(profile.length == 0){
        let newProfile = new Profile();
        newProfile.intro = initIntro;
        newProfile.picture = initPicture;
        newProfile.save();
        res.status(200).json({
					status: "success",
					message: newProfile,
				});
    }
    else{
        res.send(profile);
    }
})

// Update profile info
function validateIntro(data: object){
    let schema = Joi.object().keys({
        intro: Joi.string().required().min(30)
    });
    return schema.validate(data);
}

profileRoute.patch("/",isAdmin,async(req: Request, res: Response):Promise<any>=>{
    let del = await Profile.deleteMany({});
    if(del){
        // Pass
    }
    let isEmpty:boolean = false;
    let profile = await Profile.find({});

    if(profile.length == 0){
        isEmpty = true;
    }
    let check = validateIntro(req.body);
    if(check.error){
        return res.status(400).json({
            "status":"fail",
            "error": check.error.message
        });
    }
    if(req.files && req.files.picture != undefined){
        let picture: UploadedFile = req.files.picture as UploadedFile;
        let type = mimeTypes.extension(picture.mimetype);
        let filePath = "public/images/"+"Me"+Date.now()+"."+type;
        picture.mv(filePath,async (err:any)=>{
            if(err){
                console.log(err);
                return res.status(400).json({
                    "error": "File upload error"
                });
            }
            else{
                if(isEmpty){
                    let newProfile = new Profile();
                    newProfile.picture = filePath;
                    newProfile.intro = req.body.intro;
                    await newProfile.save();
                    res.json({message: "Profile Created"});
                }
                else{
                    await Profile.updateMany({},{$set:{intro: req.body.intro,picture: filePath}});
                    res.json({ message: "Profile Updated" });
                }
            }
        });
    }
    else{
        if(!req.body.intro){
            return res.status(400).json({
                "error": "Picture/Intro is required"
            });
        }
        if(isEmpty){
            let newProfile = new Profile();
            newProfile.intro = req.body.intro;
            newProfile.save();
            res.json({message: "Profile intro created"});
        }
        else{
            await Profile.updateMany({},{
                intro: req.body.intro,
            });
            res.json({ message: "Profile intro Updated" });
        }
    }
})

export default profileRoute;