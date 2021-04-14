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

		app.resume('resume/getProjects', 'GET', {
			resume_id: options.resume_id
		}).then((res) => {
			if (res.data) {
				this.setData({
					'resume.projects': res.data
				})
				app.hiddenLoader(this);
			}
		})

		event.on('resumeChanged', this, event.cb.bind(this));
	},
	onUnload: function() {
		event.remove('resumeChanged', this);
	},
	toEditProject: function(e) {
		if (e.currentTarget.dataset.flag == 'true') {
			wx.navigateTo({
				url: 'editProject/editProject?end_date=' + e.currentTarget.dataset.end_date + '&start_date=' + e.currentTarget.dataset.start_date + '&name=' + e.currentTarget.dataset.name + '&duty=' + e.currentTarget.dataset.duty + '&description=' + e.currentTarget.dataset.description + '&id=' + e.currentTarget.dataset.id + '&resume_id=' + e.currentTarget.dataset.resume_id + '&flag=' + true
			})
		} else {
			wx.navigateTo({
				url: `editProject/editProject?resume_id=${this.data.resume_id}&flag=false`
			})
		}
	}
})