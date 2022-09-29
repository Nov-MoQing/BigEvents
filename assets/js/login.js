$(function () {
  // 从 layui 获取 form 属性
  const form = layui.form
  const layer = layui.layer

  // 切换盒子
  $('.goReg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })
  $('.goLogin').on('click', function () {
    $('.login-wrap').show()
    $('.reg-wrap').hide()
  })



  // 密码与验证规则
  form.verify({
    // 添加规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 确认密码框
    repwd: function (value) {
      // 与密码进行比较
      // 属性选择器 $('[ name="password" ]')
      if ($('#password').val() !== value) {
        return '两次密码不一致,请重新输入。'
      }
    }
  })

  // 表单的提交事件
  $('#formReg').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      // contentType: 'application/json',
      // data:JSON.stringify({
      //   username: $('#formReg [name="username"]').val(),
      //   password: $('#formReg [name="password"]').val(),
      //   repassword: $('#formReg [name="repassword"]').val(),
      // }),
      url: '/api/reg',
      // 获取表单的所有数据，然后再转为 json 字符串
      data:$(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg('注册成功,请登录!')
        // $('.goLogin').click()
        $('.goLogin').trigger('click')
      }
    })
  })

  // 说明一下: video里面的请求地址不用了，用新的http://big-event-vue-api-t.itheima.net
  // 原来的: Content-Type: 'application/x-ww-form-urlencoded' ——> key1=value1&key2=value2
  // 现在的: Content-Type 需要指定: 'application/json' ——> '{"key1": "value1"，"key2" : "value2" }'

  $('#formLogin').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/api/login',
      // contentType:'application/json',
      data: $(this).serialize(),
      success({code,message,token}) {
        if(code !== 0) return layer.msg(message)
        layer.msg(message)
        localStorage.setItem('big_news_token',token)
        location.href = '/home.html'
      }
    })
  })
})