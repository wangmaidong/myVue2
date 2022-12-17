import { parseHTML } from './parser-html.js'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      // style="color: red;" ==> {style:{coloe:'red'}}
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0,-1)}}`
}
function genChildren(el) {
  let children = el.children
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}
function gen(node) {
  if (node.type == 1) {
    return generate(node)
  } else {
    let text = node.text;
    let tokens = []
    let match, index
    let lastIndex = defaultTagRE.lastIndex = 0
    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(text.slice(lastIndex))
    }
    
    return `_v(${tokens.join('+')})`
  }
}
function generate(el) {
  const children = genChildren(el) // 获取孩子节点
  let code = `_c("${el.tag}",${el.attrs.length? genProps(el.attrs):'undefined'}${children? `,${children}`: ''})`
  return code
}
export function compileToFunction(template) {
  // 1.解析html字符串 ， 将html字符串 => ast语法树
  let root = parseHTML(template)
  console.log('root==>', root)
  // 2.将ast语法树 生成最终的render函数  就是字符串拼接 （模板引擎）
  let code = generate(root)
  console.log('code==>', code)
  // 3.所有的模板引擎实现 都需要new Function + with
  let renderFn = new Function(`with(this) { return ${code}}`)
  console.log("renderFn==>", renderFn)
  return renderFn
}