import request,{ Request } from "supertest";
import app from "./app";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config();

let token = '';
let id = '';

beforeAll(async()=>{
    mongoose.connect(process.env.MONGODB_URI as string);
    let res = await request(app).post("/login").send({
        "username":"admin",
            "password":"atlp2024"
    });
    token = res.body.token;
})

afterAll(async()=>{
    mongoose.connection.close();
})

describe("Testing the root path", ()=>{
    test("Should respond Welcome", async()=>{
        let response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Welcome");
    })
})

describe("Testing the blogs endpoint", () => {
	test("Should Return blogs", async () => {
        let response = await request(app).get("/blogs");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
	});
    test("Create, Update and Delete a blog", async()=>{
			let blog: object = {
				title: "Blog Monday",
				description: "Testing blog",
				content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
				picture:
					"https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
			id = creating.body._id;
			expect(creating.status).toBe(201);

			// Updating the blog

			let updating = await request(app)
				.put("/blogs/" + id)
				.send(updateBlog)
				.set("Authorization", `Bearer ${token}`);
			expect(updating.status).toBe(200);

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
		});
});