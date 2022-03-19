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
const index_1 = __importDefault(require("../index"));
const path_1 = __importDefault(require("path"));
const supertest_1 = __importDefault(require("supertest"));
const fs_1 = __importDefault(require("fs"));
describe("server running", () => {
    it("express server response 200", () => {
        return (0, supertest_1.default)(index_1.default.app)
            .get("/")
            .expect(200, "Server is Working Proberly");
    });
});
describe("image upload", () => {
    const testImgName = "testImg.jpg";
    const testImgPath = path_1.default.join(__dirname, "..", "..", testImgName);
    const uploadPath = path_1.default.join(__dirname, "..", "..", "uploads");
    it("is test-image uploaded", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(testImgPath)) {
            throw new Error("file not exist" + testImgPath);
        }
        return (0, supertest_1.default)(index_1.default.app)
            .post("/api/resize")
            .set("Content-Type", "multipart/form-data")
            .field("img_width", 60)
            .field("img_height", 40)
            .attach("img_file", testImgPath)
            .expect(200, {
            message: "Uploaded Successfully",
            img_path: path_1.default.join(uploadPath, testImgName)
        })
            .catch((err) => {
            throw new Error("Error: " + err);
        });
    }));
    afterAll(() => {
        if (fs_1.default.existsSync("uploads/" + testImgName)) {
            fs_1.default.unlinkSync("uploads/" + testImgName);
        }
    });
});
