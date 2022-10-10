$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage



  template.defaults.imports.formatTimg = (time) => {
    let date = new Date(time)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2, '0')
    const d = (date.getDate() + '').padStart(2, '0')
    const hh = (date.getHours() + '').padStart(2, '0')
    const mm = (date.getMinutes() + '').padStart(2, '0')
    const ss = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }


  const qs = {
    pagenum: 1,    // 当前页码数
    pagesize: 2,    // 当前页面需要的数据条数
    cate_id: '',    // 文章分类id(注意不是文章id)
    state: '',    // 文章状态("已发布"和"草稿")2种值
  }

  articleList()
  // 获取-文章列表
  function articleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败！')
        const str = template('tpl-List', res)
        $('tbody').empty().html(str)
        // 调用渲染分页的功能，在res有total的属性 里面有数据的总数
        renderPager(res.total)
      }
    })
  }


  loadCateList()
  // 获取-文章分类
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('文章分类列表获取失败！')
        const htmlStr = template('tpl-cate', res)
        $('[name="cate_id"]').empty().html(htmlStr)

        form.render()
      }
    })
  }

  // 筛选功能
  $('#listForm').on('submit', function (e) {
    e.preventDefault()
    // 获取框内的内容
    const cate_id = $('[name="cate_id"]').val()
    const state = $('[name="state"]').val()
    // 赋值给分类和状态
    qs.cate_id = cate_id
    qs.state = state
    // 渲染文章列表
    articleList()
  })

  // 渲染分页功能
  function renderPager(total) {
    laypage.render({
      // 指向存放分页的容器，值可以是容器ID、DOM对象。
      elem: document.querySelector('#pagerWrapper'),
      count: total,    // 数据总数。一般通过服务端得到
      limit: qs.pagesize,   // 每页显示的条数。
      curr: qs.pagenum, // 起始页。
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // jump回调触发的时机:1、初次渲染分页组件的时候﹑2、主动切换页码值的时候
      jump(obj, first) {
        qs.pagenum = obj.curr
        qs.pagesize = obj.limit

        // 如果直接进行调用的话，会导致死循环的问题
        // 应该是用户主动切换页码值的时候去加载列表
        // if(!first) {
        //   articleList()
        // }

        if (typeof first === 'undefined') articleList()

        // 根据最新的 q 获取对应的数据列表，并渲染表格
      }
    })
  }



  // 删除功能
  $('tbody').on('click', '.btnDelete', function () {
    let len = $('.btnDelete').length
    const result = confirm('您确认要删该数据吗？')
    if (result) {
      const id = $(this).attr('addID')
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除失败！')

          layer.msg('删除成功！')

          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据如果没有剩余的数据了,则让页码值-1之后
          // 当前页面的删除按钮的长度为 1 的时候，就让页
          if(len === 1) {
            // 如果页码是第一页就不动，不是第一页就减一
            qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
          }
          // 再重新调用initTable方法
          articleList()
        }
      })
    }
  })
})