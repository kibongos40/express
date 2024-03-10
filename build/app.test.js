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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
let token = "";
let id = "";
let testBlogId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(process.env.MONGODB_URI);
    let res = yield (0, supertest_1.default)(app_1.default).post("/login").send({
        username: "admin",
        password: "atlp2024",
    });
    token = res.body.token;
    // Blog to use in testing:
    let blog = {
        title: "Blog Monday",
        description: "Testing blog",
        content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
        picture: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    };
    let creating = yield (0, supertest_1.default)(app_1.default)
        .post("/blogs")
        .send(blog)
        .set("Authorization", `Bearer ${token}`);
    testBlogId = creating.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.close();
}));
describe("Testing the root path", () => {
    test("Should respond Welcome", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.default).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Welcome");
    }));
});
// Login
describe("Testing the login", () => {
    test("Invalid request", () => __awaiter(void 0, void 0, void 0, function* () {
        let str = `{
		}`;
        let r = yield (0, supertest_1.default)(app_1.default).post("/login");
        expect(r.status).toBe(400);
    }));
});
// Blogs
describe("Testing the blogs endpoint", () => {
    test("All blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.default).get("/blogs");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
    }));
    test("Single blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.default).get("/blogs");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        // Single blog
        response = yield (0, supertest_1.default)(app_1.default).get("/blogs/" + testBlogId);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        // Single 404 blog
        response = yield (0, supertest_1.default)(app_1.default).get("/blogs/65dcba65121111");
        expect(response.status).toBe(404);
    }));
    test("Create, Update and Delete a blog", () => __awaiter(void 0, void 0, void 0, function* () {
        let blog = {
            title: "Blog Monday",
            description: "Testing blog",
            content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
            picture: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        };
        let fake = `{
			"title: "Blog Monday",
			description: "Testing blog",
			content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
			picture:
				"https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
		}`;
        let fakeBlog = {
            description: "Testing blog",
            content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
            picture: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        };
        let updateBlog = {
            title: "Blog Update",
            description: "Update blog",
            content: "jhfdjsd fmnsd fms dfsdfjkdsbf sdfj dsmfsfdn",
        };
        // Tests
        let creating = yield (0, supertest_1.default)(app_1.default)
            .post("/blogs")
            .send(blog)
            .set("Authorization", `Bearer ${token}`);
        id = creating.body._id;
        console.log(creating.body.message);
        expect(creating.status).toBe(201);
        // Fake blog
        let fakeCreating = yield (0, supertest_1.default)(app_1.default)
            .post("/blogs")
            .send(fakeBlog)
            .set("Authorization", `Bearer ${token}`);
        id = creating.body._id;
        expect(fakeCreating.status).toBe(400);
        // Updating the blog
        let updating = yield (0, supertest_1.default)(app_1.default)
            .put("/blogs/" + id)
            .send(updateBlog)
            .set("Authorization", `Bearer ${token}`);
        expect(updating.status).toBe(200);
        // Fake
        updating = yield (0, supertest_1.default)(app_1.default)
            .put("/blogs/sampleinvalidid")
            .send(updateBlog)
            .set("Authorization", `Bearer ${token}`);
        expect(updating.status).toBe(400);
        // Fake
        updating = yield (0, supertest_1.default)(app_1.default)
            .put("/blogs/65e5bf385df7a724c7805bba")
            .send(updateBlog)
            .set("Authorization", `Bearer ${token}`);
        expect(updating.status).toBe(404);
        // Deleting the blog
        let deleting = yield (0, supertest_1.default)(app_1.default)
            .delete("/blogs/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(deleting.status).toBe(200);
        // Deleting An invalid blog
        let deletingInvalid = yield (0, supertest_1.default)(app_1.default)
            .delete("/blogs/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(deletingInvalid.status).toBe(404);
        // Deleting An invalid blog
        deletingInvalid = yield (0, supertest_1.default)(app_1.default)
            .delete("/blogs/")
            .set("Authorization", `Bearer ${token}`);
        expect(deletingInvalid.status).toBe(404);
    }));
});
// Comments
describe("Testing Comments Endpoint", () => {
    test("Get all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        let all = yield (0, supertest_1.default)(app_1.default).get("/comments");
        expect(all.status).toBe(200);
    }));
    test("Get a comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        let all = yield (0, supertest_1.default)(app_1.default).get("/comments/" + testBlogId);
        expect(all.status).toBe(200);
    }));
    test("Get a comment by invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        let all = yield (0, supertest_1.default)(app_1.default).get("/comments/??");
        expect(all.status).toBe(200);
    }));
    test("Create and delete a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        let newComment = {
            userName: "Kibongo",
            comment: "This is a test comment",
            blogId: testBlogId,
        };
        let fakeComment = {
            userName: "Kibongo",
            comment: "This is a test comment",
        };
        let create = yield (0, supertest_1.default)(app_1.default).post("/comments").send(newComment);
        let failCreate = yield (0, supertest_1.default)(app_1.default)
            .post("/comments")
            .send(fakeComment);
        let commentId = create.body.id;
        expect(create.status).toBe(201);
        expect(failCreate.status).toBe(400);
        // Deleting a comment
        let deleteComment = yield (0, supertest_1.default)(app_1.default)
            .delete("/comments/" + commentId)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteComment.status).toBe(200);
        // Deleting a comment again
        let deleteComment2 = yield (0, supertest_1.default)(app_1.default)
            .delete("/comments/" + commentId)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteComment2.status).toBe(404);
    }));
    test("Deleting invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        // Invalid comment ID
        let deleteComment3 = yield (0, supertest_1.default)(app_1.default)
            .delete("/comments/invalidid")
            .set("Authorization", `Bearer ${token}`);
        expect(deleteComment3.status).toBe(404);
    }));
    test("Sending Invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Invalid comment ID
        let deleteComment3 = yield (0, supertest_1.default)(app_1.default)
            .delete("/comments/invalidid")
            .set("Authorization", `Bearer Token`);
        expect(deleteComment3.status).toBe(403);
    }));
    test("Sending no token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Invalid comment ID
        let deleteComment3 = yield (0, supertest_1.default)(app_1.default)
            .delete("/comments/invalidid");
        expect(deleteComment3.status).toBe(401);
    }));
});
// Messages
describe("Testing Messages Endpoint", () => {
    test("New Message", () => __awaiter(void 0, void 0, void 0, function* () {
        let newMessage = yield (0, supertest_1.default)(app_1.default).post("/messages").send({
            name: "kibongo",
            email: "someone@gmail.com",
            message: "abcde",
        });
        expect(newMessage.status).toBe(201);
        let id = newMessage.body.id;
        // All messages
        let all = yield (0, supertest_1.default)(app_1.default)
            .get("/messages")
            .set("Authorization", `Bearer ${token}`);
        expect(all.status).toBe(200);
        // Invalid message
        newMessage = yield (0, supertest_1.default)(app_1.default).post("/messages").send({
            name: "kibongo",
            email: "someone@gmail.com",
        });
        expect(newMessage.status).toBe(400);
        // Delete message
        let deleteMessage = yield (0, supertest_1.default)(app_1.default)
            .delete("/messages/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteMessage.status).toBe(200);
        // Delete invalid message
        deleteMessage = yield (0, supertest_1.default)(app_1.default)
            .delete("/messages/" + id)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteMessage.status).toBe(404);
    }));
    test("Get all Messages", () => __awaiter(void 0, void 0, void 0, function* () {
        let all = yield (0, supertest_1.default)(app_1.default).get("/messages")
            .set("Authorization", `Bearer ${token}`);
        expect(all.status).toBe(404);
    }));
});
// Profile
describe("Testing Profile", () => {
    test("Getting Profile", () => __awaiter(void 0, void 0, void 0, function* () {
        let getProfile = yield (0, supertest_1.default)(app_1.default).get("/profile");
        expect(getProfile.status).toBe(200);
    }));
    test("Updating Profile", () => __awaiter(void 0, void 0, void 0, function* () {
        let setProfile = yield (0, supertest_1.default)(app_1.default).patch("/profile")
            .set("Authorization", `Bearer ${token}`).send({
            "intro": "Sample introduction as requested"
        });
        expect(setProfile.status).toBe(200);
        // Invalid Profile
        setProfile = yield (0, supertest_1.default)(app_1.default)
            .patch("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
            int: "Sample introduction as requested",
        });
        expect(setProfile.status).toBe(400);
    }));
});
