
$.ajaxPrefilter(function (config) {
  // 将 key=value 形式的数据，转成json形式的字符串
  const format2Json = (sourec) => {
    let target = {}
    sourec.split('&').forEach(el => {
      let k = el.split('=')
      target[k[0]] = k[1]
    })
    return JSON.stringify(target)
  }

  // 统一设置基准地址
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url
  // 统一设置请求头 Content-Type值
  config.contentType = 'application/json'
  // 统一设置请求的参数  post 请求
  config.data = config.data && format2Json(config.data)
  // 统一设置请求头（有条件的加）
  // index0f startsWith endsWith includes包含，包括的意思
  if (config.url.includes('/my')) {
    config.headers = {
      Authorization: localStorage.getItem('big_news_token') || ''
    }
  }
  // 统一添加错误回调，或者 complete 回调
  config.error = function (err) {
    if (err.responseJSON?.code === 1 && err.responseJSON?.message === "身份认证失败！") {
      localStorage.removeItem('big_news_token')
      location.href = '/login.html'
    }
  }
})