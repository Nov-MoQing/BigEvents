$(function () {
  const layer = layui.layer
  const form = layui.form
  loadCateList()
  // 获取-文章分类
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('文章分类列表获取失败！')
        const htmlStr = template('tol-cate', res)
        $('tbody').empty().html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  let index = null
  $('#btnAdd').on('click', function () {
    // 增加弹出层弹出层
    index = layer.open({
      type: 1,
      area: ['450px', '250px'],
      title: '添加文章分类',
      content: $('#addDialog').html(),  // 把 script 里面的标签当做弹出层的内容
    })
  })

  let isEdit = false // 用来记录当前是什么状态

  // 代理方式绑定表单提交事件
  $('body').on('submit', '#addForm', function (e) {
    // 阻止默认提交动作
    e.preventDefault()
    if (isEdit) {
      // 修改
      const id = $(this).attr('data-id')
      $.ajax({
        method: 'PUT',
        url: '/my/cate/info',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('修改分类失败！')
          layer.msg('修改分类成功！')
          // 重新渲染列表
          loadCateList()
        }
      })
    } else {
      // 添加
      $.ajax({
        method: 'POST',
        url: '/my/cate/add',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('添加分类失败！')
          layer.msg(res.message)
          // 重新渲染列表
          loadCateList()
        }
      })
    }
    isEdit = false
    // 关闭弹出层
    layer.close(index)
  })

  // 需要通过代理给编辑按钮添加点击事件
  $('tbody').on('click', '.btnEdit', function () {
    // 用户点击修改按钮的时候,把状态置为 true
    isEdit = true


    // 增加弹出层弹出层
    // 与添加按钮共同用一个弹窗
    index = layer.open({
      type: 1,
      area: ['450px', '250px'],
      title: '修改文章分类',
      content: $('#addDialog').html(),  // 把 script 里面的标签当做弹出层的内容
    })

    const id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: `/my/cate/info?id=${id}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章分类失败！')
        // 快速填充表单内容
        form.val('addFormFilter', res.data)
      }
    })
  })


  // 删除分类功能
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确认要删除该分类吗？')
    const id = $(this).attr('data-id')
    $.ajax({
      method: 'DELETE',
      url: `/my/cate/del?id=${id}`,
      success(res) {
        if (res.code !== 0) return layer.msg('该分类删除失败！')
        layer.msg('该分类删除成功！')
        // 重新渲染列表
        loadCateList()
      }
    })
  })
})