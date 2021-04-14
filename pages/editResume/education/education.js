let event = require('../../../utils/event.js');
let app = getApp();
Page({
	data: {
		resume: {},
		loading: true
	},
	onLoad: function(options) {
		this.setData({
			resume_id: options.resume_id
		});

		app.resume('resume/getEducations', 'GET', {
			resume_id: options.resume_id
		}).then((res) => {
			if (res.data) {
				this.setData({
					'resume.educations': res.data
				})
				app.hiddenLoader(this);
			}
		})

		event.on('resumeChanged', this, event.cb.bind(this));
	},
	onUnload: function() {
		event.remove('resumeChanged', this);
	},
	toEditEducation: function(e) {
		if (e.currentTarget.dataset.flag == 'true') {
			wx.navigateTo({
				url: 'editEducation/editEducation?graduation_year=' + e.currentTarget.dataset.graduation_year + '&school=' + e.currentTarget.dataset.school + '&degree=' + e.currentTarget.dataset.degree + '&major=' + e.currentTarget.dataset.major + '&id=' + e.currentTarget.dataset.id + '&resume_id=' + e.currentTarget.dataset.resume_id + '&flag=' + 'true'
			})
		} else {
			wx.navigateTo({
				url: `editEducation/editEducation?resume_id=${this.data.resume_id}&flag=false`
			})
		}
	}
})