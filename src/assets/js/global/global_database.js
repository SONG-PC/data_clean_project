var dataType= {
  string: {
    reg: /[\\s\\S]*?/,
    input_decs: "需要一个字符串参数"
  },
  integer: {
    reg: /^[0-9]*$/,
    input_decs: "需要一个整数参数"
  },
  decimal: {
    reg: /^[0-9]*$/,
    input_decs: "需要一个数值参数"
  },
  datetime: {
    reg: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/ ,
    input_decs: "需要一个时间类型参数"

  },
  boolean: {
    reg: /[\\s\\S]*?/,
    input_decs: "需要一个布尔值"
  }
};
export default {
  notNull: /\S/,
  dataType: dataType,
  database:["Oracle","MySql"],
  encoding: ["UTF-8", "UTF-16", "UTF-16LE", "windows-1252", "ISO-8859-1", "x-MacRoman", "Big5", "Big5-HKSCS", "CESU-8", "EUC-JP", "EUC-KR", "GB18030", "GB2312", "GBK", "IBM-Thai", "IBM00858", "IBM01140", "IBM01141", "IBM01142", "IBM01143", "IBM01144", "IBM01145", "IBM01146", "IBM01147", "IBM01148", "IBM01149", "IBM037", "IBM1026", "IBM1047", "IBM273", "IBM277", "IBM278", "IBM280", "IBM284", "IBM285", "IBM290", "IBM297", "IBM420", "IBM424", "IBM437", "IBM500", "IBM775", "IBM850", "IBM852", "IBM855", "IBM857", "IBM860", "IBM861", "IBM862", "IBM863", "IBM864", "IBM865", "IBM866", "IBM868", "IBM869", "IBM870", "IBM871", "IBM918", "ISO-2022-CN", "ISO-2022-JP", "ISO-2022-JP-2", "ISO-2022-KR", "ISO-8859-13", "ISO-8859-15", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "JIS_X0201", "JIS_X0212-1990", "KOI8-R", "KOI8-U", "Shift_JIS", "TIS-620", "US-ASCII", "UTF-16BE", "UTF-32", "UTF-32BE", "UTF-32LE", "windows-1250", "windows-1251", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "windows-31j", "x-Big5-HKSCS-2001", "x-Big5-Solaris", "x-euc-jp-linux", "x-EUC-TW", "x-eucJP-Open", "x-IBM1006", "x-IBM1025", "x-IBM1046", "x-IBM1097", "x-IBM1098", "x-IBM1112", "x-IBM1122", "x-IBM1123", "x-IBM1124", "x-IBM1166", "x-IBM1364", "x-IBM1381", "x-IBM1383", "x-IBM300", "x-IBM33722", "x-IBM737", "x-IBM833", "x-IBM834", "x-IBM856", "x-IBM874", "x-IBM875", "x-IBM921", "x-IBM922", "x-IBM930", "x-IBM933", "x-IBM935", "x-IBM937", "x-IBM939", "x-IBM942", "x-IBM942C", "x-IBM943", "x-IBM943C", "x-IBM948", "x-IBM949", "x-IBM949C", "x-IBM950", "x-IBM964", "x-IBM970", "x-ISCII91", "x-ISO-2022-CN-CNS", "x-ISO-2022-CN-GB", "x-iso-8859-11", "x-JIS0208", "x-JISAutoDetect", "x-Johab", "x-MacArabic", "x-MacCentralEurope", "x-MacCroatian", "x-MacCyrillic", "x-MacDingbat", "x-MacGreek", "x-MacHebrew", "x-MacIceland", "x-MacRomania", "x-MacSymbol", "x-MacThai", "x-MacTurkish", "x-MacUkraine", "x-MS932_0213", "x-MS950-HKSCS", "x-MS950-HKSCS-XP", "x-mswin-936", "x-PCK", "x-SJIS_0213", "x-UTF-16LE-BOM", "X-UTF-32BE-BOM", "X-UTF-32LE-BOM", "x-windows-50220", "x-windows-50221", "x-windows-874", "x-windows-949", "x-windows-950", "x-windows-iso2022jp"],
  comData: {
    normal: [{
      value: true,
      key: "是"
    },
    {
      value: false,
      key: "否"
    }]
  }
  ,
  keybordCode: {
    Up: 38,
    Down: 40,
    Enter: 13
  },
  fn: [
    { view: "=", parm: [{ type: dataType.string }], tip: "全等于" },
    { view: ">", parm: [{ type: dataType.number }], tip: "大于" },
    { view: "<", parm: [{ type: dataType.number }], tip: "小于" },
    { view: ">=", parm: [{ type: dataType.number }], tip: "大于等于" },
    { view: "<=", parm: [{ type: dataType.number }], tip: "小于等于" },
    { view: "<>", parm: [{ type: dataType.string }], tip: "不等于" },
    { view: "⊇", parm: [{ type: dataType.string }], tip: "包含" },
    { view: "⊉", parm: [{ type: dataType.string }], tip: "不包含" }
  ],
  nodeType: {
    fn: "fuction",
    col: "column",
    parm: "parm"
  }
}
