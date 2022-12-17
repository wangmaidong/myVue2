function bar() {
  console.log(1)
  return
}
function foo() {
  bar()
  return
  console.log(2)
}
foo()