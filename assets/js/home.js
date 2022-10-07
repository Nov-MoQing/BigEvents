const layer = layui.layer
$(function () {
  getUserInfo()
})


// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('big_news_token') || ''
    // },
    success(res) {
      if (res.code !== 0) return layer.msg(reg.message)
      renderAvatar(res.data)
    }
  })
}
// 渲染头像函数
const renderAvatar = (data) => {
  // 欢迎字体替换为用户名
  const uuname = data.nickname || data.username
  $('.text').html(`欢迎&nbsp;&nbsp;${uuname}`)
  // 如果有图片头像，隐藏字体图片，替换原来的src路径显示图片头像
  if (data.user_pic) {
    $('.text-avatar').hide()
    $('.layui-nav-img').attr('src', data.user_pic).show()
  } else {
    // 如果没有图片头像，隐藏图片头像，获取用户名的第一个字母变为大写，填到字体头像里面
    $('.layui-nav-img').hide()
    const char = uuname.charAt(0).toUpperCase()
    // const char = uuname[0].toUpperCase()
    $('.text-avatar').html(char).show()
  }
}

// 退出功能
$('#btnLogOut').on('click',function(){
  // 第一种写法
  // const result = confirm('您确认要退出吗？')
  // if(result) {
  //   localStorage.removeItem('big_news_token')
  //   location.href = '/login.html'
  // }
  // 第二种写法
  layer.confirm('您确认要退出吗？', {icon: 3, title:'提示'}, function(index){
    //do something
    // 删除 token
    localStorage.removeItem('big_news_token')
    // 跳转页面
    location.href = '/login.html'
    // 关闭弹窗
    layer.close(index);
  })
})