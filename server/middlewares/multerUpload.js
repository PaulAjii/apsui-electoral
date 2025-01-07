import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Not an image! Please upload an image.'));
	}
};

export const upload = multer({
	storage,
	limits: { fileSize: 5000000 },
	fileFilter,
});
