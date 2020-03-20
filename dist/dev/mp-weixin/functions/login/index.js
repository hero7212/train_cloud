// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "dev-im8b3"
})

const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main =async (event, context) => {
	let res = {}
	let code = 0
	try {
		res = await db.collection('accounts').where({
			account: event.account,
			password: event.password
		}).get()
		code = res.data.length ? 0 : -1
	} catch(e) {
		code = -1
	}
	console.log('event是：', event)
	console.log('context是：', context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
	const wxContext = cloud.getWXContext()

	return {
		code,
		res,
		event,
		// openid: wxContext.OPENID,
		// appid: wxContext.APPID,
		// unionid: wxContext.UNIONID,
		// env: wxContext.ENV,
	}
}
