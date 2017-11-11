export default {
  _id (root, args, context) {
    return root._id
  },
  id (root, args, context) {
    return root._id
  },
  content (root, args, context) {
    return root.content
  },
  createdAt (root, args, context) {
    return root.createdAt
  },
  from (root, args, context) {
    return root.from
  },
  isPublic (root, args, context) {
    return !!root.owner
  },
  owner (root, args, context) {
    if (!context.owner) { return null }
    return root.owner
  },
  ownerId (root, args, context) {
    if (context.userId !== root._id) { return null }
    return root.ownerId
  },
  updatedAt (root, args, context) {
    return root.updatedAt
  }
}
