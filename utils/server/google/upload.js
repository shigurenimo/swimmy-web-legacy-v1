import { Meteor } from 'meteor/meteor'
import Storage from '@google-cloud/storage'

export default function (bucketName, srcPath, distPath) {
  return new Promise((resolve, reject) => {
    if (this.userId) {
      const error = new Error('server only')
      return reject(error)
    }
    const {projectId, keyFilename} = Meteor.settings.private.googleCloud
    const path = {
      keyFilename: require('path').join(process.env.PWD, keyFilename)
    }
    const storage = Storage({
      projectId: projectId,
      keyFilename: path.keyFilename
    })
    const bucket = storage.bucket(bucketName)
    bucket.upload(srcPath, {
      destination: distPath,
      validation: 'crc32c'
    }, function (err, file) {
      if (err) {
        return reject(err)
      } else if (!file) {
        const error = new Error('file not found')
        return reject(error)
      } else {
        resolve(file)
      }
    })
  })
}
