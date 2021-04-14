const app = getApp();
let {
	server
} = require('../../configs/serverConfig.js');
let $ = require('../../utils/util.js');
let event = require('../../utils/event.js');
Page({
	data: {
		loading: true,
		hiddenLoader: false
	},
	onLoad() {
		//获取消息
		this.getMsg();
		event.on('length--', this, (data) => {
			let msg = this.data.msg;
			msg[data.key]--;
			this.setData({
				msg: msg
			})
		})
		event.on('ws_msg', this, () => {
			this.getMsg();
		})
	},
	onUnload() {
		event.remove('length--', this);
	},
	getMsg() {
		//wx.request
		app.getUserInfo((res) => {
			$.ajax({
				url: `${server}/msg/getUnReadLength`,
				method: 'POST',
				data: {
					openid: res.openid
				}
			}).then((res) => {
				if (res.statusCode == 200) {
					this.setData({
						msg: res.data
					})
				} else {
					$.toast('获取消息失败', this, false)
				}
				app.hiddenLoader(this);
			}).catch(error => {
				app.hiddenLoader(this);
				$.toast('获取消息失败', this, false)
			})
		})
	},
	navigateTo(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	}
})