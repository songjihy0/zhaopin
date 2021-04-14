const items = {
    educations: [{
        value: '大专',
        text: '大专',
        type: 'circle'
    }, {
        value: '本科',
        text: '本科',
        type: 'circle'
    }, {
        value: '硕士',
        text: '硕士',
        type: 'circle'
    }, {
        value: '博士',
        text: '博士',
        type: 'circle'
    }],
    types: [{
        value: '全职',
        text: '全职',
        'type': 'circle'
    }, {
        value: '兼职',
        text: '兼职',
        'type': 'circle'
    }, {
        value: '实习',
        text: '实习',
        'type': 'circle'
    }],
    financle: [{
        value: '未融资',
        text: '未融资',
        type: 'circle'
    }, {
        value: '天使轮',
        text: '天使轮',
        type: 'circle'
    }, {
        value: 'A轮',
        text: 'A轮',
        type: 'circle'
    }, {
        value: 'B轮',
        text: 'B轮',
        type: 'circle'
    }, {
        value: 'C轮',
        text: 'C轮',
        type: 'circle'
    }, {
        value: 'D轮及以上',
        text: 'D轮及以上',
        type: 'circle'
    }, {
        value: '已上市',
        text: '已上市',
        type: 'circle'
    }, {
        value: '不需要融资',
        text: '不需要融资',
        type: 'circle'
    }],
    industry: [{
        value: '互联网',
        text: '互联网',
        type: 'circle'
    }, {
        value: '电子商务',
        text: '电子商务',
        type: 'circle'
    }, {
        value: '社交网络',
        text: '社交网络',
        type: 'circle'
    }, {
        value: '企业服务',
        text: '企业服务',
        type: 'circle'
    }, {
        value: 'O2O',
        text: 'O2O',
        type: 'circle'
    }, {
        value: '教育',
        text: '教育',
        type: 'circle'
    }, {
        value: '游戏',
        text: '游戏',
        type: 'circle'
    }, {
        value: '旅游',
        text: '旅游',
        type: 'circle'
    }, {
        value: '金融',
        text: '金融',
        type: 'circle'
    }, {
        value: '医疗健康',
        text: '医疗健康',
        type: 'circle'
    }, {
        value: '生活服务',
        text: '生活服务',
        type: 'circle'
    }, {
        value: '信息安全',
        text: '信息安全',
        type: 'circle'
    }, {
        value: '数据服务',
        text: '数据服务',
        type: 'circle'
    }, {
        value: '广告营销',
        text: '广告营销',
        type: 'circle'
    }, {
        value: '文化误乐',
        text: '文化娱乐',
        type: 'circle'
    }, {
        value: '硬件',
        text: '硬件',
        type: 'circle'
    }, {
        value: '医疗健康',
        text: '医疗健康',
        type: 'circle'
    }, {
        value: '机械重工',
        text: '机械重工',
        type: 'circle'
    }, {
        value: '房地产',
        text: '房地产',
        type: 'circle'
    }, {
        value: '新能源',
        text: '新能源',
        type: 'circle'
    }, {
        value: '其他',
        text: '其他',
        type: 'circle'
    }]

}

const degrees = ['大专', '本科', '硕士', '博士'];

let years = [];

for (let i = 2000; i < new Date().getFullYear() + 4; i++) {
    years.push(i.toString());
}

const prizes = ['特等奖', '一等奖', '二等奖', '三等奖', '金奖', '银奖', '铜奖'];

const types = ['全职', '兼职', '实习'];

const salaryRanges = ['2k以下', '2k-5k', '5k-10k', '10k-15k', '15k-25k', '25k-50k', '50k以上'];

module.exports = {
    items: items,
    degrees: degrees,
    years: years,
    prizes: prizes,
    types: types,
    salaryRanges: salaryRanges
}
