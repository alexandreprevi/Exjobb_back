import { StorageResponse, ServiceError } from './storageService.types'

export interface StorageService {
    deleteImage: (image: string) => Promise<StorageResponse | ServiceError>
}

export const StorageService = ({ storage }): StorageService => {
    const deleteImage = async (image: string) => {
        try {
            // TODO: Find a better way to do this
            const filename = image.substr(54)
            const bucket = storage.bucket()
            const file = bucket.file(filename)
            const result = file.delete()
            return Promise.resolve({ success: true, data: result })
        } catch (error) {
            return Promise.resolve({ success: false, data: 'COULD NOT DELETE IMAGES FROM STORAGE' })
        }
    }
    return { deleteImage }
}