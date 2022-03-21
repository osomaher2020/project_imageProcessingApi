"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const resizeImage = (image, width, height, uploaded_img_name) => {
    return new Promise((resolve, reject) => {
        try {
            const doResize = (0, sharp_1.default)(image)
                .resize(width, height)
                .toFile("uploads/" + uploaded_img_name)
                .then(() => {
                return "success";
            })
                .catch((err) => {
                throw new Error(err.message);
            });
            resolve(doResize);
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.default = resizeImage;
