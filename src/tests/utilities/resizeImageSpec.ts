import fs from "fs";
import path from "path";
// utilities (Modules)
import resizeImage from "../../utilities/resizeImage";

const img_width = 60;
const img_height = 40;

const testImgName = "encenadaport.jpg";
const testImgPath = path.join(__dirname, "..", "..", "..", "images", testImgName);

const uploaded_img_name = path.parse(testImgName).name + "_" + img_width + "_" + img_height + path.extname(testImgName);


describe("resizeImage --Module--", () => {

    it("testImage file is found", () => {
        expect(fs.existsSync(testImgPath)).toBeTruthy();
    });

    it("image successfully resized 60*40", () => {
        expect(async () => {
            await resizeImage(testImgPath, img_width, img_height, uploaded_img_name);
        }).not.toThrow();
    });
});