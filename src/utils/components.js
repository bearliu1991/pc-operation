// 加载所有plugins下所有的vue组件
const pubComponent = require.context('@/pubComponent', false, /\.vue$/)
const modules = {}

pubComponent.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = pubComponent(key).default
})
export default modules
