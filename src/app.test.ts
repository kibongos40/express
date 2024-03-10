import request, { Request } from "supertest";
import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

let token = "";
let id = "";
let testBlogId: string = "";

beforeAll(async () => {
	mongoose.connect(process.env.MONGODB_URI as string);
	let res = await request(app).post("/login").send({
		username: "admin",
		password: "atlp2024",
	});
	token = res.body.token;

	// Blog to use in testing:
	let blog: object = {
		title: "Blog Monday",
		description: "Testing blog",
		content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn"
	};
	let creating = await request(app)
		.post("/blogs")
		.send(blog)
		.set("Authorization", `Bearer ${token}`);
	testBlogId = creating.body.message._id;
});

afterAll(async () => {
	mongoose.connection.close();
});

describe("Testing the root path", () => {
	test("Should respond Welcome", async () => {
		let response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.body.message).toBe("Welcome");
	});
});

// Login

describe("Testing the login", () => {
	test("Invalid request", async () => {
		let str = `{
		}`;
		let r = await request(app).post("/login");
		expect(r.status).toBe(400);
	});
});

// Blogs
describe("Testing the blogs endpoint", () => {
	test("All blogs", async () => {
		let response = await request(app).get("/blogs");
		expect(response.status).toBe(200);
		expect(response.body.status).toBe("success");
	});
	test("Single blogs", async () => {
		let response = await request(app).get("/blogs");
		expect(response.status).toBe(200);
		expect(response.body.status).toBe("success");

		// Single blog
		response = await request(app).get("/blogs/" + testBlogId);
		expect(response.status).toBe(200);
		expect(response.body.status).toBe("success");

		// Single 404 blog
		response = await request(app).get("/blogs/65dcba65121111");
		expect(response.status).toBe(404);
	});
	test("Create, Update and Delete a blog", async () => {
		let blog: object = {
			title: "Blog Monday",
			description: "Testing blog",
			content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
		};
		let fake = `{
			"title: "Blog Monday",
			description: "Testing blog",
			content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn"
		}`;
		let fakeBlog: object = {
			description: "Testing blog",
			content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
		};
		let updateBlog: object = {
			title: "Blog Update",
			description: "Update blog",
			content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
		};

		// Tests

		let creating = await request(app)
			.post("/blogs")
			.send(blog)
			.set("Authorization", `Bearer ${token}`);
		id = creating.body.message._id;
		console.log(creating.body.message);
		expect(creating.status).toBe(201);
		// Fake blog

		let fakeCreating = await request(app)
			.post("/blogs")
			.send(fakeBlog)
			.set("Authorization", `Bearer ${token}`);
		id = creating.body.message._id;
		expect(fakeCreating.status).toBe(400);
		// Updating the blog

		let updating = await request(app)
			.put("/blogs/" + id)
			.send(updateBlog)
			.set("Authorization", `Bearer ${token}`);
		expect(updating.status).toBe(200);
		// Fake
		updating = await request(app)
			.put("/blogs/sampleinvalidid")
			.send(updateBlog)
			.set("Authorization", `Bearer ${token}`);
		expect(updating.status).toBe(400);
		// Fake
		updating = await request(app)
			.put("/blogs/65e5bf385df7a724c7805bba")
			.send(updateBlog)
			.set("Authorization", `Bearer ${token}`);
		expect(updating.status).toBe(404);

		// Deleting the blog

		let deleting = await request(app)
			.delete("/blogs/" + id)
			.set("Authorization", `Bearer ${token}`);
		expect(deleting.status).toBe(200);

		// Deleting An invalid blog

		let deletingInvalid = await request(app)
			.delete("/blogs/" + id)
			.set("Authorization", `Bearer ${token}`);
		expect(deletingInvalid.status).toBe(404);
		// Deleting An invalid blog

		deletingInvalid = await request(app)
			.delete("/blogs/")
			.set("Authorization", `Bearer ${token}`);
		expect(deletingInvalid.status).toBe(404);
	});
});

// Comments

describe("Testing Comments Endpoint", () => {
	test("Get all comments", async () => {
		let all = await request(app).get("/comments");
		expect(all.status).toBe(200);
	});
	test("Get a comment by id", async () => {
		let all = await request(app).get("/comments/" + testBlogId);
		expect(all.status).toBe(200);
	});
	test("Get a comment by invalid id", async () => {
		let all = await request(app).get("/comments/??");
		expect(all.status).toBe(200);
	});
	test("Create and delete a comment", async () => {
		console.log(testBlogId);
		let newComment = {
			userName: "Kibongo",
			comment: "This is a test comment",
			blogId: testBlogId,
		};
		let fakeComment = {
			userName: "Kibongo",
			comment: "This is a test comment",
		};
		let create = await request(app).post("/comments").send(newComment);
		let failCreate = await request(app)
			.post("/comments")
			.send(fakeComment);
		let commentId = create.body.id;
		expect(create.status).toBe(201);
		expect(failCreate.status).toBe(400);

		// Deleting a comment

		let deleteComment = await request(app)
			.delete("/comments/" + commentId)
			.set("Authorization", `Bearer ${token}`);
		expect(deleteComment.status).toBe(200);

		// Deleting a comment again

		let deleteComment2 = await request(app)
			.delete("/comments/" + commentId)
			.set("Authorization", `Bearer ${token}`);
		expect(deleteComment2.status).toBe(404);
	});
	test("Deleting invalid comment", async () => {
		// Invalid comment ID
		let deleteComment3 = await request(app)
			.delete("/comments/invalidid")
			.set("Authorization", `Bearer ${token}`);
		expect(deleteComment3.status).toBe(404);
	});
	test("Sending Invalid token", async () => {
		// Invalid comment ID
		let deleteComment3 = await request(app)
			.delete("/comments/invalidid")
			.set("Authorization", `Bearer Token`);
		expect(deleteComment3.status).toBe(403);
	});
	test("Sending no token", async () => {
		// Invalid comment ID
		let deleteComment3 = await request(app)
			.delete("/comments/invalidid");
		expect(deleteComment3.status).toBe(401);
	});
});

// Messages

describe("Testing Messages Endpoint", () => {
	test("New Message",async()=>{
		let newMessage = await request(app).post("/messages").send({
			name: "kibongo",
			email: "someone@gmail.com",
			message: "abcde",
		});
		expect(newMessage.status).toBe(201);
		let id = newMessage.body.id;

		// All messages

		let all = await request(app)
			.get("/messages")
			.set("Authorization", `Bearer ${token}`);
		expect(all.status).toBe(200);

		// Invalid message
		newMessage = await request(app).post("/messages").send({
			name: "kibongo",
			email: "someone@gmail.com",
		});
		expect(newMessage.status).toBe(400);

		// Delete message
		let deleteMessage = await request(app)
			.delete("/messages/" + id)
			.set("Authorization", `Bearer ${token}`);
		expect(deleteMessage.status).toBe(200);

		// Delete invalid message
		deleteMessage = await request(app)
			.delete("/messages/" + id)
			.set("Authorization", `Bearer ${token}`);
		expect(deleteMessage.status).toBe(404);
	})
	test("Get all Messages", async () => {
		let all = await request(app).get("/messages")
		.set("Authorization", `Bearer ${token}`);
		expect(all.status).toBe(200);
	});
})

// Profile

describe("Testing Profile", ()=>{
	test("Getting Profile",async()=>{
		let getProfile = await request(app).get("/profile");
		expect(getProfile.status).toBe(200);
	});
	test("Updating Profile", async () => {
		let setProfile = await request(app).patch("/profile")
		.set("Authorization", `Bearer ${token}`).send({
			"intro": "Sample introduction as requested"
		});
		expect(setProfile.status).toBe(200);
	
	// Invalid Profile

	setProfile = await request(app)
			.patch("/profile")
			.set("Authorization", `Bearer ${token}`)
			.send({
				int: "Sample introduction as requested",
			});
		expect(setProfile.status).toBe(400);
	});
})