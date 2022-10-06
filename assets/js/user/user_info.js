$(function(){
  const form = layui.form
  const layer = layui.layer
  // 表单规则
  form.verify({
    nickname:function(value){
      if(value.length > 6) {
        return '用户昵称的长度必须是1 ~ 6位字符串'
      }
    }
  })
  // 调用获取用户信息函数
  initInfo()

  // 获取用户信息
  function initInfo(){
    $.ajax({
      // method:'GET',  默认就是 GET 请求
      url:'/my/userinfo',
      success(res){
        if(res.code !== 0) return layer.msg(res.message)
        // console.log(res)
        // 给指定表单集合的元素赋值，回显数据
        form.val('userForm',res.data)
      }
    })
  }

  // 点击重置按钮天加点击事件
  $('#btnReset').on('click',(e)=>{
    e.preventDefault()
    initInfo()
  })
  
  // 监听表单提交事件
  $('.layui-form').on('submit',function(e){
    e.preventDefault()
    // 获取表单的数据
    // console.log(form.val('userForm'))  // { key:value,key:value}
    // console.log($(this).serialize())   // key=value&key=value
    $.ajax({
      method:'PUT',
      url:'/my/userinfo',
      data:form.val('userForm'),
      success(res){
        if(res.code !== 0) return layer.msg('用户信息获取失败！')
        layer.msg(res.message)
        // 刷新整体页面
        // 由 var 声明的变量和 function声明的函数 会默认存在 window全局变量上，但是 let / const 不会
        window.parent.getUserInfo()
      }
    })
  })
})