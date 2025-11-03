const cloudinary = require('cloudinary').v2;

// ----------------------
// DELETE IMAGE UTILITY
// ----------------------
// THIS FUNCTION DELETES AN IMAGE FROM CLOUDINARY BASED ON ITS URL
// IT EXTRACTS THE PUBLIC_ID FROM THE URL AND CALLS THE CLOUDINARY API
const deleteImg = (imgUrl) => {
  // ----------------------
  // EXTRACT IMAGE NAME AND FOLDER FROM URL
  // ----------------------
  const imgSplit = imgUrl.split('/');
  const nameSplit = imgSplit.at(-1).split('.')[0];   // IMAGE NAME WITHOUT EXTENSION
  const folderSplited = imgSplit.at(-2);            // FOLDER NAME
  const public_id = `${folderSplited}/${nameSplit}`; // CLOUDINARY PUBLIC_ID

  console.log('Attempting to delete image with public_id:', public_id);

  // ----------------------
  // CALL CLOUDINARY API TO DELETE IMAGE
  // ----------------------
  cloudinary.uploader.destroy(public_id, (error, result) => {
    if (error) {
      console.error('Error deleting image:', error);
    } else {
      console.log('Image deleted successfully:', result);
    }
  });
};

// ----------------------
// EXPORT
// ----------------------
module.exports = { deleteImg };
