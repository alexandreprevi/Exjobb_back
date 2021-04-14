import { StorageResponse, ServiceError } from './storageService.types'

export interface StorageService {
  uploadMultipleImages: (uid: string, projectId: string, files) => Promise<StorageResponse | ServiceError>
  deleteOneImage: (image: string, projectId: string) => Promise<StorageResponse | ServiceError>
  deleteAllImages: (projectId: string) => Promise<StorageResponse | ServiceError>
}

export const StorageService = ({ storage }): StorageService => {
  const uploadMultipleImages = async (uid: string, projectId: string, files) => {
    try {
      let promises = []
      files.forEach((image, index) => {
        const gcsname = uid + '' + Date.now() + index
        const file = storage.bucket().file(projectId + '/' + gcsname)

        const promise = new Promise((resolve, reject) => {
          const stream = file.createWriteStream({
            metadata: {
              contentType: image.mimetype,
            },
          })

          stream.on('finish', async () => {
            try {
              files[index].cloudStorageObject = gcsname
              await file.makePublic()
              files[index].cloudStoragePublicUrl = `https://storage.googleapis.com/exjobb-dev.appspot.com/${gcsname}`
              resolve('done')
            } catch (error) {
              reject(error)
            }
          })

          stream.on('error', err => {
            files[index].cloudStorageError = err
            reject(err)
          })

          stream.end(image.buffer)
        })

        promises.push(promise)
      })
      await Promise.all(promises)
      promises = []
      return Promise.resolve({ success: true, data: 'IMAGES UPLOADED' })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE IMAGES FROM STORAGE' })
    }
  }
  const deleteOneImage = async (image: string, projectId: string) => {
    try {
      const filename = image.substr(54) // TODO: Find a better way to do this
      const bucket = storage.bucket()
      const file = bucket.file(projectId + '/' + filename)
      const result = file.delete()
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE IMAGE FROM STORAGE' })
    }
  }
  const deleteAllImages = async (projectId: string) => {
    try {
      const bucket = storage.bucket()
      const result = bucket.deleteFiles({
        prefix: `${projectId}/`,
      })
      return Promise.resolve({ success: true, data: result })
    } catch (error) {
      return Promise.resolve({ success: false, data: 'COULD NOT DELETE IMAGES FROM STORAGE' })
    }
  }
  return { uploadMultipleImages, deleteOneImage, deleteAllImages }
}
