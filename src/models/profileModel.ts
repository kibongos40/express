import mongoose, {Model, Document, Schema} from "mongoose";

export interface IProfile extends Document{
    picture: string,
    intro: string
}

let profileSchema: Schema = new Schema({
	picture: {
		type: String,
		required: [true, "Picture is required"],
		default: "assets/images/me.png",
	},
	intro: {
		type: String,
		required: [true, "Introduction is required"],
	},
});

const Profile = mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;