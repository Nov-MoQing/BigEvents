$(function () {
  const form = layui.form
  const layer = layui.layer

  // 定义密码规则
  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: (value) => {
      if (value === $('[name="old_pwd"]').val()) {
        return '新旧密码不能一致！'
      }
    },
    rePwd: (value) => {
      if (value !== $('[name="new_pwd"]').val()) {
        return '两次密码输出的不一致！'
      }
    }
  })


  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'PATCH',
      url: '/my/updatepwd',
      // 获取表单数据
      // data:$(this).serialize()
      data: form.val('pwdForm'),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        // 重置表单
        // $('#btnReset').click()  // 调用 type="reset" 按钮
        $('.layui-form')[0].reset()
      }
    })
  })
})