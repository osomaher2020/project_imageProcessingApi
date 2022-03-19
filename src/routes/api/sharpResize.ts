import express from "express";
import { promises as fsPromises } from "fs";
import fs from "fs";
import fileupload from "express-fileupload";
import sharp from "sharp";
import cors from "cors";
import path from "path";

const sharpResize = express.Router();

// middleware
sharpResize.use(cors());
sharpResize.use(fileupload());

sharpResize.post("/", (req, res) => {
    try {
        // resize dimensions
        const img_width = parseInt(req.body.img_width);
        const img_height = parseInt(req.body.img_height);

        // uploaded image file
        const imageFile = req.files?.img_file as fileupload.UploadedFile;
        const image_name = imageFile.name;

        const upload_path = path.join(__dirname, "..", "..", "..", "uploads");

        // check - if image exists in uploads
        if (fs.existsSync("uploads/" + image_name)) {
            res.status(200)
                .json({
                    message: "Image Existed !",
                    img_path: path.join(upload_path, image_name)
                });
            return;
        }

        // check image Extension
        const imgExt = path.extname(image_name);
        if (imgExt !== ".jpg") {
            res.status(415)
                .json({
                    message: "Use only .jpg"
                });
            return;
        }

        // check - if request has a file
        if (!req.files || Object.keys(req.files).length == 0) {
            res.status(400)
                .json({
                    message: "no image selected"
                });
            return;
        }

        // check - if image size <= 4MB
        const imgSizelimit = 4 * 1024 * 1024;
        if (imageFile.size > imgSizelimit) {
            res.status(413)
                .json({
                    message: "max size = 4 MB"
                });
            return;
        }

        // resize image
        sharp(imageFile.data)
            .resize({
                width: img_width,
                height: img_height,
            })
            .toBuffer()
            .then( (data) => {
                fsPromises.writeFile("uploads/"+image_name, data, "utf-8");
            })
            .then(()=>{
                res.status(200)
                    .json({
                        message: "Uploaded Successfully",
                        img_path: path.join(upload_path, image_name)
                    });
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (e) {
        res.send((e as Error).message);
    }
});

export default sharpResize;
