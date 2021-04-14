let {
	ws
} = require('../configs/serverConfig');

export default class Websocket {
	constructor() {}
	open({
		openid,
		data = {},
		method = 'POST'
	}) {
		wx.connectSocket({
			url: `${ws}?openid=${openid}`,
			method: method,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: res => console.log('success'),
			fail: error => console.log(error)
		})
	}
	onOpen(cb) {
		wx.onSocketOpen(cb);
	}
	onError(cb) {
		wx.onSocketError(cb);
	}
	send({
		data,
		success,
		fail
	}) {
		wx.sendSocketMessage({
			data: data,
			success: success,
			fail: fail
		})
	}
	on(cb) {
		wx.onSocketMessage(cb)
	}
	close() {
		wx.closeSocket()
	}
	onClose(cb) {
		wx.onSocketClose(cb)
	}
}