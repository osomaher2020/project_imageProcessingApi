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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resizeImage_1 = __importDefault(require("../../utilities/resizeImage"));
const img_width = 60;
const img_height = 40;
const testImgName = "encenadaport.jpg";
const testImgPath = path_1.default.join(__dirname, "..", "..", "..", "images", testImgName);
const uploaded_img_name = path_1.default.parse(testImgName).name + "_" + img_width + "_" + img_height + path_1.default.extname(testImgName);
describe("resizeImage --Module--", () => {
    it("testImage file is found", () => {
        expect(fs_1.default.existsSync(testImgPath)).toBeTruthy();
    });
    it("image successfully resized 60*40", () => {
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, resizeImage_1.default)(testImgPath, img_width, img_height, uploaded_img_name);
        })).not.toThrow();
    });
});
