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
let token = '';
let id = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(process.env.MONGODB_URI);
    let res = yield (0, supertest_1.default)(app_1.default).post("/login").send({
        "username": "admin",
        "password": "atlp2024"
    });
    token = res.body.token;
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
describe("Testing the blogs endpoint", () => {
    test("Should Return blogs", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(app_1.default).get("/blogs");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
    }));
    test("Create, Update and Delete a blog", () => __awaiter(void 0, void 0, void 0, function* () {
        let blog = {
            title: "Blog Monday",
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
        expect(creating.status).toBe(201);
        // Updating the blog
        let updating = yield (0, supertest_1.default)(app_1.default)
            .put("/blogs/" + id)
            .send(updateBlog)
            .set("Authorization", `Bearer ${token}`);
        expect(updating.status).toBe(200);
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
    }));
});
