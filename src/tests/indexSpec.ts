import index from "../index";
import path from "path";
import supertest from "supertest";
import fs from "fs";

describe("server running", () => {
    it("express server response 200", () => {
        return supertest(index.app)
                .get("/")
                .expect(
                    200,
                    "Server is Working Proberly"
                );
    });
});

describe("image upload", () => {

    const testImgName = "testImg.jpg";
    const testImgPath = path.join(__dirname, "..", "..", testImgName);
    const uploadPath = path.join(__dirname, "..", "..", "uploads");

    it("is test-image uploaded", async () => {

        if (!fs.existsSync(testImgPath)) {
            throw new Error("file not exist" + testImgPath);
        }

        return supertest(index.app)
            .post("/api/resize")
            .set("Content-Type", "multipart/form-data")
            .field("img_width", 60)
            .field("img_height", 40)
            .attach("img_file", testImgPath)
            .expect(
                200,
                {
                    message: "Uploaded Successfully",
                    img_path: path.join(uploadPath, testImgName)
                }
            )
            .catch((err) => {
                throw new Error("Error: " + err);
            });
    });

    // teardown -- the uploaded testImg.png -- after testing
    afterAll( () => {
        if(fs.existsSync("uploads/"+testImgName)){
            fs.unlinkSync("uploads/"+testImgName);
        }
    });
});
