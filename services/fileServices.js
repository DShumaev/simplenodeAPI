const path = require('path')
const { v4: uuidv4 } = require('uuid')

class FileService {

    saveFile(file, dir) {
        try {
            const fileName = uuidv4() + '.jpg'
            const filePath = path.resolve(dir, fileName)
            file.mv(filePath)

            return fileName
        } catch {
            return false
        }
    }

}

module.exports = new FileService()