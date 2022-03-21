import sharp from "sharp";

const resizeImage = (image: (string | Buffer), width: number, height: number, uploaded_img_name: string): Promise<string> => {

    return new Promise( (resolve, reject) => {
        try{

            const doResize = sharp(image)
                                .resize(width, height)
                                .toFile("uploads/"+ uploaded_img_name)
                                .then(() => {
                                    return "success";
                                })
                                .catch((err) => {
                                    throw new Error((err as Error).message);
                                });

            resolve(doResize);
        }
        catch(err){
            reject(err);
        }
    });
};

export default resizeImage;