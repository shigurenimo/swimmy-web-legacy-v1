import { Meteor } from 'meteor/meteor'
import Storage from '@google-cloud/storage'

export default function (bucketName, fileNames) {
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

    bucket.getFiles((err, files, nextQuery, resp) => {
      if (err) {
        return reject(err)
      }
      for (let i = 0, len = files.length; i < len; ++i) {
        const file = files[i]
        console.log(file.name)
        if (!fileNames.includes(file.name)) continue
        file.makePublic((err, resp) => {
          if (err) {
            return reject(err)
          }
        })
      }
      resolve()
    })
  })
}
