export default typeof window === 'undefined' ? null : [
  'mobile',
  'tablet',
  'tablet pc',
  'ipad',
  'kindle',
  'silk',
  'playbook',
  'phone',
  'ipod',
  'iphone',
  'blackberry'
].map(type => window.navigator.userAgent.toLowerCase().indexOf(type) !== -1).indexOf(true) !== -1
