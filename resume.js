// let resume = {
// 	userinfo: {
// 		name: '',
// 		email: '',
// 		sex: '',
// 		degree: '',
// 		city: '',
// 		telephone: '',
// 		birthday: '',
// 		avatarUrl: ''
// 	},
// 	educations: [{
// 		graduation_year: '',
// 		school: '',
// 		degree: '',
// 		major: ''
// 	}],
// 	interships: [{
// 		start_date: '',
// 		end_date: '',
// 		company: '',
// 		job: '',
// 		description: '',
// 	}],
// 	projects: [{
// 		start_date: '',
// 		end_date: '',
// 		name: '',
// 		duty: '',
// 		description: ''
// 	}],
// 	honors: [{
// 		date: '',
// 		prize: '',
// 		name: ''
// 	}],
// 	hope: {
// 		job: '',
// 		type: '',
// 		city: '',
// 		salary: '',
// 		otherDescription: ''
// 	},
// 	selfAssessment: '',
// }

// let input = 'Phone13728738411    性别男    sex女    出生2017-12-11    出 生年月2017-12-22    birthday2017-12    123城 市深圳     城市：深 圳     acity广州     123姓  名 ： 林卓彦\r\n name : 林锐       姓名无 谓      姓 名无谓    电子邮箱670390939@qq.com     邮 箱：670390939@qq.com    email 670350939@qq.com'
// input = input.replace(/\n|\r\n/g, '    ') //去掉回车换行符
// let regEmail = /([eE]mail\s*)|(\邮\s*\箱\s*)(\：*|\:*)/ //匹配邮箱
// let regName = /(\姓\s*\名\s*)|([nN]ame\s*)(\：*|\:*)/ //匹配姓名
// let regCity = /(\城\s*\市\s*)|([cC]ity\s*)(\：*|\:*)/ //匹配城市
// let regBirth = /(\出\s*\生\s*\日\s*\期\s*)|(\出\s*\生\s*\年\s*\月\s*)|(\出\s*\生\s*)|([bB]irthday\s*)|([bB]irth\s*)(\：*|\:*)/
// let regDegree = /(\学\s*\历\s*)|([dD]egree\s*)(\：*|\:*)/ //匹配学位
// let regSex = /(\性\s*\别\s*)|([sS]ex\s*)(\：*|\:*)/ //匹配性别
// let regPhone = /(\联\s*\系\s*\方\s*\式\s*)|(\联\s*\系\s*\电\s*\话\s*)|(\手\s*\机\s*\号\s*\码\s*)|(\电\s*\话\s*\号\s*\码\s*)|(\手\s*\机\s*)|([pP]hone\s*)(\：*|\:*)/


let regSchool = /(\大\s*\学\s*)|(\学\s*\院\s*)/g //匹配学校
let regYear = /[0-9]{4}/

let a = '2017.04-2017.06  深圳大学  兰州大学';
console.log(a.match(regSchool))

// let t = '\r\n教育经历\n'
// console.log(t.replace(/\教\育\经\历/, '##教育经历'))
// console.log(input.split(/\s{4,}/))
// input.split(/\s{4,}/).forEach(val => {
// 	if (regName.test(val)) {
// 		let start = val.indexOf(val.match(regName)[0][0]);
// 		console.log(val.substring(start + val.match(regName)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regEmail.test(val)) {
// 		let start = val.indexOf(val.match(regEmail)[0][0]);
// 		console.log(val.substring(start + val.match(regEmail)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regCity.test(val)) {
// 		let start = val.indexOf(val.match(regCity)[0][0]);
// 		console.log(val.substring(start + val.match(regCity)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regBirth.test(val)) {
// 		let start = val.indexOf(val.match(regBirth)[0][0]);
// 		console.log(val.substring(start + val.match(regBirth)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regSex.test(val)) {
// 		let start = val.indexOf(val.match(regSex)[0][0]);
// 		console.log(val.substring(start + val.match(regSex)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regPhone.test(val)) {
// 		let start = val.indexOf(val.match(regPhone)[0][0]);
// 		console.log(val.substring(start + val.match(regPhone)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// 	if (regDegree.test(val)) {
// 		let start = val.indexOf(val.match(regDegree)[0][0]);
// 		console.log(val.substring(start + val.match(regDegree)[0].length).replace(/\s/, '').replace(/\:|\：|\,/, ''));
// 	}
// })


//信息分类
let _input = '#####教育经历    123##个人信息姓名林锐##项目经历微信小程序##实习经历深圳云计算中心##自我评价良好##荣誉奖项无##'

let regClassify = /\#{2,}(.*?)\#{2,}/ //*、+和?限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个?就可以实现非贪婪或最小匹配。

while (regClassify.test(_input)) {
	let msg = _input.match(regClassify)[0];
	console.log(msg);
	_input = _input.replace(msg, '##')
}