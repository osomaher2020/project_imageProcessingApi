"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const sharp_1 = __importDefault(require("sharp"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_query_parser_1 = require("express-query-parser");
const sharpResize = express_1.default.Router();
sharpResize.use((0, cors_1.default)());
sharpResize.use((0, express_fileupload_1.default)());
const qParse = (0, express_query_parser_1.queryParser)({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
});
sharpResize.get("/", qParse, (req, res) => {
    try {
        const img_width = req.query.width;
        const img_height = req.query.height;
        const image_name = req.query.img;
        const selected_image_path = path_1.default.join(
            __dirname,
            "..",
            "..",
            "..",
            "images",
            image_name
        );
        const upload_path = path_1.default.join(
            __dirname,
            "..",
            "..",
            "..",
            "uploads"
        );
        const uploaded_img_name =
            path_1.default.parse(image_name).name +
            "_" +
            img_width +
            "_" +
            img_height +
            path_1.default.extname(image_name);
        const uploaded_img_path = path_1.default.join(
            upload_path,
            uploaded_img_name
        );
        if (fs_1.default.existsSync(uploaded_img_path)) {
            res.status(200).sendFile(uploaded_img_path);
            return;
        }
        const imgExt = path_1.default.extname(image_name);
        if (imgExt !== ".jpg") {
            res.status(415).json({
                message: "Use only .jpg",
            });
            return;
        }
        (0, sharp_1.default)(selected_image_path)
            .resize(img_width, img_height)
            .toFile("uploads/" + uploaded_img_name)
            .then(() => {
                res.status(200).sendFile(uploaded_img_path);
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (e) {
        res.send(e.message);
    }
});
sharpResize.post("/", (req, res) => {
    var _a;
    try {
        const img_width = parseInt(req.body.img_width);
        const img_height = parseInt(req.body.img_height);
        const imageFile =
            (_a = req.files) === null || _a === void 0 ? void 0 : _a.img_file;
        const image_name = imageFile.name;
        const upload_path = path_1.default.join(
            __dirname,
            "..",
            "..",
            "..",
            "uploads"
        );
        const uploaded_img_name =
            path_1.default.parse(image_name).name +
            "_" +
            img_width +
            "_" +
            img_height +
            path_1.default.extname(image_name);
        const uploaded_img_path = path_1.default.join(
            upload_path,
            uploaded_img_name
        );
        if (fs_1.default.existsSync(uploaded_img_path)) {
            res.status(200).json({
                message: "Image Existed !",
                img_path: uploaded_img_path,
            });
            return;
        }
        const imgExt = path_1.default.extname(image_name);
        if (imgExt !== ".jpg") {
            res.status(415).json({
                message: "Use only .jpg",
            });
            return;
        }
        if (!req.files || Object.keys(req.files).length == 0) {
            res.status(400).json({
                message: "no image selected",
            });
            return;
        }
        const imgSizelimit = 4 * 1024 * 1024;
        if (imageFile.size > imgSizelimit) {
            res.status(413).json({
                message: "max size = 4 MB",
            });
            return;
        }
        (0, sharp_1.default)(imageFile.data)
            .resize({
                width: img_width,
                height: img_height,
            })
            .toFile(uploaded_img_path)
            .then(() => {
                res.status(200).json({
                    message: "Uploaded Successfully",
                    img_path: uploaded_img_path,
                });
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (e) {
        res.send(e.message);
    }
});
exports.default = sharpResize;
