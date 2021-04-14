import multer from 'multer'
import path from 'path'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const fileTypes = /jpeg|png|jpg/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    if (mimeType && extname) {
      return callback(null, true)
    }
    callback(new Error('Error: File upload only supports the following filetypes - ' + fileTypes))
  },
}).array('images', 10)
