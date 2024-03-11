"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileModel_1 = __importDefault(require("../models/profileModel"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mime_types_1 = __importDefault(require("mime-types"));
const isAdmin_1 = __importDefault(require("./isAdmin"));
const joi_1 = __importDefault(require("joi"));
const cors_1 = __importDefault(require("cors"));
const profileRoute = express_1.default.Router();
profileRoute.use((0, cors_1.default)());
profileRoute.use(express_1.default.urlencoded({
    extended: true,
}));
profileRoute.use(express_1.default.json());
profileRoute.use((0, express_fileupload_1.default)());
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
profileRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let profile = yield profileModel_1.default.find({});
    if (profile.length == 0) {
        let newProfile = new profileModel_1.default();
        newProfile.intro = initIntro;
        newProfile.picture = initPicture;
        newProfile.save();
        res.status(200).json({
            status: "success",
            message: newProfile,
        });
    }
    else {
        res.send(profile);
    }
}));
// Update profile info
function validateIntro(data) {
    let schema = joi_1.default.object().keys({
        intro: joi_1.default.string().required().min(30)
    });
    return schema.validate(data);
}
profileRoute.patch("/", isAdmin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let del = yield profileModel_1.default.deleteMany({});
    if (del) {
        // Pass
    }
    let isEmpty = false;
    let profile = yield profileModel_1.default.find({});
    if (profile.length == 0) {
        isEmpty = true;
    }
    let check = validateIntro(req.body);
    if (check.error) {
        return res.status(400).json({
            "status": "fail",
            "error": check.error.message
        });
    }
    if (req.files && req.files.picture != undefined) {
        let picture = req.files.picture;
        let type = mime_types_1.default.extension(picture.mimetype);
        let filePath = "public/images/" + "Me" + Date.now() + "." + type;
        picture.mv(filePath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    "error": "File upload error"
                });
            }
            else {
                if (isEmpty) {
                    let newProfile = new profileModel_1.default();
                    newProfile.picture = filePath;
                    newProfile.intro = req.body.intro;
                    yield newProfile.save();
                    res.json({ message: "Profile Created" });
                }
                else {
                    yield profileModel_1.default.updateMany({}, { $set: { intro: req.body.intro, picture: filePath } });
                    res.json({ message: "Profile Updated" });
                }
            }
        }));
    }
    else {
        if (!req.body.intro) {
            return res.status(400).json({
                "error": "Picture/Intro is required"
            });
        }
        if (isEmpty) {
            let newProfile = new profileModel_1.default();
            newProfile.intro = req.body.intro;
            newProfile.save();
            res.json({ message: "Profile intro created" });
        }
        else {
            yield profileModel_1.default.updateMany({}, {
                intro: req.body.intro,
            });
            res.json({ message: "Profile intro Updated" });
        }
    }
}));
exports.default = profileRoute;
