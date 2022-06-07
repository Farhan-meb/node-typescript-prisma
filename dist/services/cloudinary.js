"use strict";
// import { constants } from 'buffer';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// const uploadImage = async (file: any) => {
//     return new Promise<Package>((resolve, reject) => {
//         cloudinary.config({
//             cloud_name: 'sample',
//             api_key: '874837483274837',
//             api_secret: 'a676b67565c6767a6767d6767f676fe1',
//             secure: true,
//         });
//         console.log(file);
//         const readStream = fs.createReadStream(file.path);
//         const _upload = cloudinary.uploader.upload_stream(
//             readStream,
//             function (error: any, result: any) {
//                 if (error) {
//                     resolve(false);
//                 } else {
//                     resolve(true);
//                 }
//             }
//         );
//         return _upload;
//     });
//     //console.log('uploadeddddddd', _upload);
// };
// export default { uploadImage };
//# sourceMappingURL=cloudinary.js.map