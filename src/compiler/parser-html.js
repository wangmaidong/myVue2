const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div> 
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/ //匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
let root = null; //ast语法树的树根
let currentParent; // 标识当前父亲是谁
let stack = []
const ELEMENT_TYPPE = 1
const TEXT_TYPE = 3
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPPE,
    children: [],
    attrs,
    parent: null
  }
}
function start(tagName, attrs) {
  // 遇到开始标签就创建一个ast元素
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element;
  }
  currentParent = element //把当前元素标记成父ast树
  stack.push(element)
}
function chars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}
function end(tagName) {
  let element = stack.pop()
  // 要标识当前这个结束标签属于哪个元素的
  currentParent = stack[stack.length - 1]
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element) //实现了一个树的父子关系
  }
}
// ast语法树 是用对象来描述原生语法  虚拟dom 是用对象来描述 dom节点的
export function parseHTML(html) {
  // 不停的解析html字符串
  // html会被不停的截取
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) { 
      // 若果当前索引为0 肯定是一个标签 开始标签 或者 结束标签
      let startTagMatch = parseStartTag() // 通过这个方法获取到匹配的结果 tagName, attrs
      if (startTagMatch) { // 如是开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue; // 如果开始标签解析完毕了就跳出该次循环
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue;
      }
    }
    let text
    if (textEnd >= 0) {
      text  = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  // 解析开始标签
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 获取到的标签名 div
        attrs: []
      }
      advance(start[0].length) // 把<div截取掉
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 如果截取掉<div 后的文本内容不是以>开头那就说明有属性
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }

  }
  // 截取字符串方法
  function advance(n) {
    html = html.substring(n)
  }
  return root
}
// 解析结束标签