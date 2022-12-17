1.第一步进进行 vue 的初始化操作
// 我们需要将template转换成render函数
      /**
       * <div id="app">
           <p>{{name}}</p>
           <span>{{age}}</span>
         </div> */ 
/**
 * render() {
 * return _c("div", {id:app}, _c('p', undefined, _v(_s(name))), _c('span', undefined, _v(_s(age))) )
 */

 let root = {
   tag: 'div',
   attrs: [{name: 'id', value: 'app'}],
   parent: null,
   type: 1, 
   children: [{
     tag: 'p',
     attrs: [],
     parent: root,
     type: 1, 
     children: [
       {
         text: '{{name}}',
         type: 3
       }
     ]
   }]
 }