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
      projectId,
      // eslint-disable-next-line no-undef
      keyFilename: Assets.absoluteFilePath(keyFilename)
    })

    return storage
    .bucket(bucketName)
    .upload(srcPath, {
      destination: distPath,
      validation: 'crc32c'
    })
    .then(resolve)
    .catch(err => { reject(err) })
  })
}
