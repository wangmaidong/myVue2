import { parseHTML } from './parser-html.js'
import { generate } from './generate.js'
export function compileToFunction(template) {
  // 1.解析html字符串 ， 将html字符串 => ast语法树
  let root = parseHTML(template)
  // console.log('root==>', root)
  // 2.将ast语法树 生成最终的render函数  就是字符串拼接 （模板引擎）
  let code = generate(root)
  // console.log('code==>', code)
  // 3.所有的模板引擎实现 都需要new Function + with
  let renderFn = new Function(`with(this) { return ${code}}`)
  // console.log("renderFn==>", renderFn)
  return renderFn
}