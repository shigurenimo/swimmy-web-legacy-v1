import { Meteor } from 'meteor/meteor'
import Storage from '@google-cloud/storage'

export default function (bucketName, srcPath, distPath) {
  return new Promise((resolve, reject) => {
    if (this.userId) {
      const error = new Error('server only')
      return reject(error)
    }
    const {projectId, keyFilename} = Meteor.settings.private.googleCloud
    const storage = Storage({
      projectId: projectId,
      // eslint-disable-next-line no-undef
      keyFilename: Assets.absoluteFilePath(keyFilename)
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
