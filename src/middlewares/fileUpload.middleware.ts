import firebase from 'firebase-admin'
import multer from 'multer'
import path from 'path'

const getPublicUrl = filename => {
    return `https://storage.googleapis.com/exjobb-dev.appspot.com/${filename}`
}

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

export const sendUploadToGCS = (req, res, next) => {
    const authorId = req['uid']

    if (!req.files) {
        return next()
    }

    let promises = []
    req.files.forEach((image, index) => {
        const gcsname = authorId + '' + Date.now() + index
        const file = firebase.storage().bucket().file(gcsname)

        const promise = new Promise((resolve, reject) => {
            const stream = file.createWriteStream({
                metadata: {
                    contentType: image.mimetype,
                },
            })

            stream.on('finish', async () => {
                try {
                    req.files[index].cloudStorageObject = gcsname
                    await file.makePublic()
                    req.files[index].cloudStoragePublicUrl = getPublicUrl(gcsname)
                    resolve('done')
                } catch (error) {
                    reject(error)
                }
            })

            stream.on('error', err => {
                req.files[index].cloudStorageError = err
                reject(err)
            })

            stream.end(image.buffer)
        })

        promises.push(promise)
    })

    Promise.all(promises)
        .then(_ => {
            promises = []
            next()
        })
        .catch(next)
}