export default {
  Test: {
    hello (root, args, context) {
      return root.hello
    }
  },
  Query: {
    Test (root, args, context) {
      return {
        hello: 'hello'
      }
    }
  }
}
