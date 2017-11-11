import JSON from 'graphql-type-json'

import Query from './Query'
import Post from './Query/Post'
import PostConnection from './Query/PostConnection'
import Test from './Query/Test'
import User from './Query/User'
import DateTime from './scalars/DateTime'

export default {
  JSON,
  DateTime,
  Query,
  Post,
  PostConnection,
  Test,
  User
}
