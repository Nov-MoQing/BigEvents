$(function () {
  const layer = layui.layer
  const form = layui.form
  // 初始化富文本编辑器
  initEditor()

  loadCateList()
  // 获取-文章分类
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: 'http://big-event-vue-api-t.itheima.net/my/cate/list',
      headers: {
        Authorization: localStorage.getItem('big_news_token') || ''
      },
      success(res) {
        if (res.code !== 0) return layer.msg('文章分类列表获取失败！')
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').empty().html(htmlStr)

        form.render()
      }
    })
  }

  // 裁剪
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮，绑定点击事件处理函数
  $('.btnPub').on('click', function () {
    file.click()
  })

  // 让 file 文本框
  $('#file').on('change', function (e) {
    const fileList = e.target.files
    if (fileList.length === 0) return layer.msg('请选择文件')
    const imgUrl = URL.createObjectURL(fileList[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', imgUrl)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  let state = '已发布'
  // 点击发布草稿的按钮时，让状态改为草稿
  $('#btnDraft').on('click', function () {
    state = '草稿'
  })
  // 监听表单提交事件
  $('#pubForm').on('submit', function (e) {
    e.preventDefault()
    const fd = new FormData($(this)[0])
    fd.append('state', state)

    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)

        $.ajax({
          method: 'POST',
          url: 'http://big-event-vue-api-t.itheima.net/my/article/add',
          data: fd,
          headers: {
            Authorization: localStorage.getItem('big_news_token') || ''
          },
          // 注意:如果向服务器提交的是FormData 格式的数据，必须添加以下两个配置项
          contentType: false,
          processData: false,
          success(res) {
            if (res.code !== 0) return layer.msg('文章发表失败！')

            layer.msg('文章发表成功！')
            location.href = './article_list.html'
          }
        })
      })
  })
})