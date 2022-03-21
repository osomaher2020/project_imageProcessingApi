import express from "express";
import fs from "fs";
import fileupload from "express-fileupload";
import cors from "cors";
import path from "path";
import {queryParser} from "express-query-parser";
// utilities (Modules)
import resizeImage from "../../utilities/resizeImage";

const sharpResize = express.Router();

// middleware
sharpResize.use(cors());
sharpResize.use(fileupload());
// query-parser converts URL numerical strings into numbers
const qParse = queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
});

// GET endpoint for Browser URL
sharpResize.get("/", qParse, async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        // resize dimensions
        const img_width: number = req.query.width as unknown as number;
        const img_height: number = req.query.height as unknown as number;

        // image_name from "images" dir
        const image_name: string = req.query.img as unknown as string;
        const selected_image_path = path.join(__dirname, "..", "..", "..", "images", image_name);

        const upload_path = path.join(__dirname, "..", "..", "..", "uploads");
        const uploaded_img_name = path.parse(image_name).name + "_" + img_width + "_" + img_height + path.extname(image_name);
        const uploaded_img_path = path.join(upload_path, uploaded_img_name);

        // check - if image exists in uploads
        if (fs.existsSync(uploaded_img_path)) {
            res.status(200).sendFile(uploaded_img_path);
            return;
        }

        // check image Extension
        const imgExt = path.extname(image_name);
        if (imgExt !== ".jpg") {
            res.status(415).json({
                message: "Use only .jpg",
            });
            return;
        }


        // make "Uploads" directory if not exist
        if(!fs.existsSync(upload_path)){
            fs.mkdirSync(upload_path);
        }

        // resizing the image
        const isUploaded = await resizeImage(selected_image_path, img_width, img_height, uploaded_img_name);
        if(isUploaded){
            res.status(200).sendFile(uploaded_img_path);
        }
        else{
            throw new Error("Problem with uploading and resizing the image");
        }

    } catch (e) {
        res.send((e as Error).message);
    }
});

// POST endpoint for GUI
sharpResize.post("/", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        // resize dimensions
        const img_width: number = parseInt(req.body.img_width);
        const img_height: number = parseInt(req.body.img_height);

        // uploaded image file
        const imageFile = req.files?.img_file as fileupload.UploadedFile;
        const image_name = imageFile.name;

        const upload_path = path.join(__dirname, "..", "..", "..", "uploads");
        const uploaded_img_name = path.parse(image_name).name + "_" + img_width + "_" + img_height + path.extname(image_name);
        const uploaded_img_path = path.join(upload_path, uploaded_img_name);

        // check - if image exists in uploads
        if (fs.existsSync(uploaded_img_path)) {
            res.status(200).json({
                message: "Image Existed !",
                img_path: uploaded_img_path,
            });
            return;
        }

        // check image Extension
        const imgExt = path.extname(image_name);
        if (imgExt !== ".jpg") {
            res.status(415).json({
                message: "Use only .jpg",
            });
            return;
        }

        // check - if request has a file
        if (!req.files || Object.keys(req.files).length == 0) {
            res.status(400).json({
                message: "no image selected",
            });
            return;
        }

        // check - if image size <= 4MB
        const imgSizelimit = 4 * 1024 * 1024;
        if (imageFile.size > imgSizelimit) {
            res.status(413).json({
                message: "max size = 4 MB",
            });
            return;
        }

        // make "Uploads" directory if not exist
        if(!fs.existsSync(upload_path)){
            fs.mkdirSync(upload_path);
        }

        // resizing the image
        const isUploaded = await resizeImage(imageFile.data, img_width, img_height, uploaded_img_name);
        if(isUploaded){
            res.status(200).json({
                message: "Uploaded Successfully",
                img_path: uploaded_img_path,
            });
        }
        else{
            throw new Error("Problem with uploading and resizing the image");
        }

    } catch (e) {
        res.send((e as Error).message);
    }
});

export default sharpResize;
