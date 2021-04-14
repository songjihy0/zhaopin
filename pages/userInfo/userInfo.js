var app = getApp();

var $ = require('../../utils/util.js');
let event = require('../../utils/event.js');
const degrees = require('../../configs/data_configs').degrees;
const {
	server
} = require('../../configs/serverConfig.js');

Page({
	data: {
		userInfoFromWX: {},
		userInfo: {},
		sexArray: ['男', '女'],
		defaultDate: '1994-01-01',
		checkEmail: true,
		checkMobile: true,
		avatarChange: false,
		loading: true
	},
	onLoad: function(options) {
		this.setData({
			now: $.formatDate(new Date()),
			degrees: degrees
		})
		app.getUserInfoFromWX((data) => {
				this.setData({
					userInfoFromWX: data
				})
			})
			// app.getUserInfo((data) => {
			// 	// this.setData({
			// 	// 	userInfo: data
			// 	// })
			// 	if (data.city == '') {
			// 		app.getLocation((data) => {
			// 			this.setData({
			// 				'userInfo.city': data
			// 			})
			// 		})
			// 	}

		// 	//	app.hiddenLoader.call(this);
		// 	app.hiddenLoader(this);
		// })

		$.ajax({
			url: `${server}/seeker/getUserInfo`,
			data: {
				openid: app.globalData.session.openid
			}
		}).then((res) => {
			if (res.statusCode == 200) {
				app.globalData.userInfo = res.data;
				wx.setStorageSync('userInfo', res.data);
				this.setData({
					userInfo: res.data
				})
				if (res.data.city == '') {
					app.getLocation((data) => {
						this.setData({
							'userInfo.city': data
						})
					})
				}
			} else {
				app.getUserInfo((data) => {
					this.setData({
						userInfo: data
					})
				})
			}
			app.hiddenLoader(this);
		}).catch((res) => {
			app.getUserInfo((data) => {
				this.setData({
					userInfo: data
				})
			})
		})
		let _degree = this.data.userInfo.degree;
		if (!_degree) {
			this.setData({
				degreeIndex: 1
			})
		} else {
			this.setData({
				degreeIndex: $.inArray(_degree, degrees)
			})
		}
		event.on('cityChanged', this, function(data) {
			this.setData({
				'userInfo.city': data.city
			})
		}.bind(this))
	},
	onUnload: function() {
		event.remove('cityChanged', this);
	},
	chooseImg: function() {
		let _this = this;
		wx.chooseImage({
			count: 1,
			success: function(res) {
				_this.setData({
					filePath: res.tempFilePaths[0],
					avatarChange: true
				})
			}
		})
	},
	bindPickerChange: function(e) {
		this.setData({
			'userInfo.sex': this.data.sexArray[e.detail.value]
		})
	},
	bindDatePickerChange: function(e) {
		this.setData({
			'userInfo.birthday': e.detail.value
		})
	},
	bindDegreePickerChange: function(e) {
		this.setData({
			'userInfo.degree': degrees[e.detail.value]
		})
	},
	checkMobile() {
		this.setData({
			checkMobile: $.checkMobile(this.data.userInfo.telephone)
		})
	},
	checkEmail() {
		this.setData({
			checkEmail: $.checkEmail(this.data.userInfo.email)
		})
	},
	nameInput(e) {
		this.setData({
			'userInfo.name': e.detail.value
		})
	},
	phoneInput(e) {
		this.setData({
			'userInfo.telephone': e.detail.value
		})
	},
	emailInput(e) {
		this.setData({
			'userInfo.email': e.detail.value
		})
	},
	save: function() {
		let _this = this;
		let {
			userInfo
		} = this.data;
		if (!this.data.checkEmail || !this.data.checkMobile) {
			$.toast('您的输入格式错误', this)
			return;
		}
		$.ajax({
			url: `${server}/seeker/updateSeeker`,
			method: 'POST',
			data: {
				userInfo: JSON.stringify(userInfo),
				openid: app.globalData.session.openid
			}
		}).then((res) => {
			console.log(res);
			console.log(res.data == true)
			if (res.statusCode == 200 && res.data == true) {
				console.log(3);
				event.emit('resumeChanged', {
					event_type: 'change',
					key: 'userInfo',
					value: userInfo
				})
				event.emit('userInfoChanged', {
					userInfo: userInfo
				})
				wx.setStorageSync('userInfo', userInfo);
				app.globalData.userInfo = userInfo;
				wx.navigateBack();
				//	$.toast('保存成功', this)
			} else {
				$.toast('数据保存失败', this, false)
				console.log(5)
			}
		}).catch(res => {
			console.log(res)
			$.toast('数据保存失败', this, false);
			console.log(4)
		})
		if (this.data.avatarChange) {
			wx.uploadFile({
				url: `${server}/upload/avatar`,
				filePath: this.data.filePath,
				header: {
					'Content-Type': 'application/x-www-form-urlencoded;charset="UTF-8"',
					'Cookie': 'JSESSIONID=' + wx.getStorageSync('session').sessionId
				},
				name: 'avatar',
				formData: {
					openid: app.globalData.session.openid
				},
				success: (res) => {
					if (res.data != 'false') {
						_this.setData({
							'userInfo.avatarUrl': res.data
						})
						event.emit('userInfoChanged', {
							userInfo: _this.data.userInfo
						})
						userInfo.avatarUrl = res.data;
						event.emit('resumeChanged', {
							event_type: 'change',
							key: 'userInfo',
							value: _this.data.userInfo
						})
						console.log(res);
						wx.setStorageSync('userInfo', userInfo);
						app.globalData.userInfo = userInfo;
						//	wx.navigateBack();
						//	$.toast('头像修改成功', this)
					} else {
						$.toast('头像上传失败', this, false)
					}
				},
				fail: (res) => {
					$.toast('头像上传失败', this, false)
				}
			})
		}
	},
	toWorkplace() {
		wx.navigateTo({
			url: `../workplace/workplace?city=${this.data.userInfo.city}&flag=${'userInfo_city'}`
		})
	}
})