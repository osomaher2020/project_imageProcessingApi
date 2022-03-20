"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
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
describe("suite image upload", () => {
    const img_width = 60;
    const img_height = 40;
    const testImgName = "encenadaport.jpg";
    const testImgPath = path_1.default.join(
        __dirname,
        "..",
        "..",
        "images",
        testImgName
    );
    const uploadPath = path_1.default.join(__dirname, "..", "..", "uploads");
    const uploaded_img_name =
        path_1.default.parse(testImgName).name +
        "_" +
        img_width +
        "_" +
        img_height +
        path_1.default.extname(testImgName);
    const uploaded_img_path = path_1.default.join(
        uploadPath,
        uploaded_img_name
    );
    it("image file is found", () => {
        expect(fs_1.default.existsSync(testImgPath)).toBeTruthy();
    });
    it("is test-image uploaded", () => {
        if (!fs_1.default.existsSync(testImgPath)) {
            throw new Error("file not exist" + testImgPath);
        }
        return (0, supertest_1.default)(index_1.default.app)
            .post("/api/resize")
            .set("Content-Type", "multipart/form-data")
            .field("img_width", img_width)
            .field("img_height", img_height)
            .attach("img_file", testImgPath)
            .expect(200, {
                message: "Uploaded Successfully",
                img_path: uploaded_img_path,
            })
            .catch((err) => {
                throw new Error("Error: " + err);
            });
    });
    afterAll(() => {
        if (fs_1.default.existsSync(uploaded_img_path)) {
            fs_1.default.unlinkSync(uploaded_img_path);
        }
    });
});
