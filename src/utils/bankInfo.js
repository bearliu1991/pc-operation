let bankInfo = [{
    bankName: "招商银行",
    icon: "#iconzhaoshangyinhang",
    bg: "linear-gradient(360deg,rgba(228,30,38,1) 0%,rgba(255,64,72,1) 100%)"
  },
  {
    bankName: "中国工商银行",
    icon: "#iconzhongguogongshangyinhang",
    bg: "linear-gradient(360deg,rgba(228,30,38,1) 0%,rgba(255,64,72,1) 100%)"
  },
  {
    bankName: "中国银行",
    icon: "#iconzhongguoyinhang",
    bg: "linear-gradient(360deg,rgba(152,45,48,1) 0%,rgba(187,0,8,1) 100%)"
  },
  {
    bankName: "中国邮政储蓄银行",
    icon: "#iconzhongguoyouzhengchuxuyinhang",
    bg: "linear-gradient(360deg,rgba(0,126,62,1) 0%,rgba(0,126,62,1) 100%)"
  },
  {
    bankName: "中国建设银行",
    icon: "#iconzhongguojiansheyinhang",
    bg: "linear-gradient(360deg,rgba(0,102,179,1) 0%,rgba(0,81,142,1) 100%)"
  },
  {
    bankName: "中国农业银行",
    icon: "#iconzhongguonongyeyinhang",
    bg: "linear-gradient(360deg,rgba(0,133,102,1) 0%,rgba(0,120,92,1) 100%)"
  },
  {
    bankName: "中国交通银行",
    icon: "#iconjiaotongyinhang",
    bg: "linear-gradient(360deg,rgba(0,78,162,1) 0%,rgba(0,59,123,1) 100%)"
  },
  {
    bankName: "浙商银行",
    icon: "#iconzheshangyinhang",
    bg: "linear-gradient(360deg,rgba(234,0,0,1) 0%,rgba(188,0,0,1) 100%)"
  },
  {
    bankName: "杭州银行",
    icon: "#iconhangzhouyinhang",
    bg: "linear-gradient(360deg,rgba(0,165,215,1) 0%,rgba(0,131,171,1) 100%)"
  },
  {
    bankName: "浦发银行",
    icon: "#iconpufayinhang",
    bg: "linear-gradient(360deg,rgba(44,80,130,1) 0%,rgba(37,69,114,1) 100%)"
  },
  {
    bankName: "平安银行",
    icon: "#iconpinganyinhang",
    bg: "linear-gradient(360deg,rgba(255,97,0,1) 0%,rgba(214,81,0,1) 100%)"
  },
  {
    bankName: "宁夏银行",
    icon: "#iconningxiayinhang",
    bg: "linear-gradient(360deg,rgba(222,0,36,1) 0%,rgba(172,0,28,1) 100%)"
  },
  {
    bankName: "中国民生银行",
    icon: "#iconzhongguominshengyinhang",
    bg: "linear-gradient(360deg,rgba(0,57,123,1) 0%,rgba(0,85,184,1) 100%)"
  },
  {
    bankName: "中信银行",
    icon: "#iconzhongxinyinhang",
    bg: "linear-gradient(360deg,rgba(188,29,33,1) 0%,rgba(159,25,28,1) 100%)"
  },
  {
    bankName: "兴业银行",
    icon: "#iconxingyeyinhang",
    bg: "linear-gradient(360deg,rgba(0,63,141,1) 0%,rgba(0,53,118,1) 100%)"
  },
  {
    bankName: "中国光大银行",
    icon: "#iconzhongguoguangdayinhang",
    bg: "linear-gradient(360deg,rgba(107,22,133,1) 0%,rgba(107,22,133,1) 100%)"
  },
  {
    bankName: "华夏银行",
    icon: "#iconhuaxiayinhang",
    bg: "linear-gradient(360deg,rgba(230,0,18,1) 0%,rgba(195,0,15,1) 100%)"
  },
  {
    bankName: "北京银行",
    icon: "#iconbeijingyinhang",
    bg: "linear-gradient(360deg,rgba(232,37,42,1) 0%,rgba(200,32,36,1) 100%)"
  },
  {
    bankName: "上海银行",
    icon: "#iconshanghaiyinhang",
    bg: "linear-gradient(360deg,rgba(41,60,143,1) 0%,rgba(27,43,115,1) 100%)"
  },
  {
    bankName: "广发银行",
    icon: "#iconguangfayinhang",
    bg: "linear-gradient(360deg,rgba(189,0,22,1) 0%,rgba(157,0,18,1) 100%)"
  },
  {
    bankName: "江苏银行",
    icon: "#iconjiangsuyinhang",
    bg: "linear-gradient(360deg,rgba(213,171,68,1) 0%,rgba(185,147,52,1) 100%)"
  }
]

function matchSearch(str) {
  let bank = bankInfo.filter(el => el.bankName === str)[0];
  return bank
}

module.exports = {
  matchSearch: matchSearch
}