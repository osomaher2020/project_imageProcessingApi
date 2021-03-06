import index from "../index";
import path from "path";
import supertest from "supertest";
import fs from "fs";

const img_width = 50;
const img_height = 40;

const testImgName = "encenadaport.jpg";
const testImgPath = path.join(__dirname, "..", "..", "images", testImgName);

const uploadPath = path.join(__dirname, "..", "..", "uploads");
const uploaded_img_name = path.parse(testImgName).name + "_" + img_width + "_" + img_height + path.extname(testImgName);
const uploaded_img_path = path.join(uploadPath, uploaded_img_name);


describe("server is running", () => {
    it("express server response 200", () => {
        return supertest(index.app)
            .get("/")
            .expect(200, "Server is Working Proberly");
    });
});


describe("suite image upload POST", () => {

    it("is test-image uploaded and resized", () => {

        return supertest(index.app)
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

    // teardown --the uploaded testImg-- after testing
    afterAll(() => {
        if (fs.existsSync(uploaded_img_path)) {
            fs.unlinkSync(uploaded_img_path);
        }
    });
});
