const app = getApp();
const event = require('../../../utils/event.js');
let $ = require('../../../utils/util.js');
let {
	server
} = require('../../../configs/serverConfig.js');
Page({
	data: {
		selfAssessment: '',
		maxlength: 1000
	},
	onLoad: function(options) {
		if (options.msg == 'null') {
			options.msg = '';
		}
		this.setData({
			selfAssessment: options.msg,
			resume_id: options.resume_id,
			windowHeight: wx.getSystemInfoSync().windowHeight
		})
	},
	textareaInput: function(e) {
		this.setData({
			selfAssessment: e.detail.value
		})
	},
	save: function() {
		//wx.request
		let _this = this;
		$.ajax({
			url: `${server}/resume/updateSelfAssessment`,
			method: 'POST',
			data: {
				selfAssessment: this.data.selfAssessment,
				id: this.data.resume_id
			}
		}).then((res) => {
			if (res.data) {
				event.emit('resumeChanged', {
					key: 'selfAssessment',
					value: this.data.selfAssessment,
					event_type: 'change'
				})
				wx.navigateBack({})
			}
		})
	}
})