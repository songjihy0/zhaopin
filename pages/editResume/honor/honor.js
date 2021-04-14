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

		app.resume('resume/getHonors', 'GET', {
			resume_id: options.resume_id
		}).then((res) => {
			if (res.data) {
				this.setData({
					'resume.honors': res.data
				})
				app.hiddenLoader(this);
			}
		})

		event.on('resumeChanged', this, event.cb.bind(this));
	},
	onUnload: function() {
		event.remove('resumeChanged', this);
	},
	toEditHonor: function(e) {
		if (e.currentTarget.dataset.flag == 'true') {
			wx.navigateTo({
				url: 'editHonor/editHonor?date=' + e.currentTarget.dataset.date + '&name=' + e.currentTarget.dataset.name + '&prize=' + e.currentTarget.dataset.prize + '&id=' + e.currentTarget.dataset.id + '&resume_id=' + e.currentTarget.dataset.resume_id + '&flag=' + true
			})
		} else {
			wx.navigateTo({
				url: `editHonor/editHonor?resume_id=${this.data.resume_id}&flag=false`
			})
		}
	}
})