var dataType= {
  number:
  {
    reg: /^[0-9]*$/,
      input_decs: "需要一个数值参数"
  },
  string: {
    reg: /[\\s\\S]*?/,
      input_decs: "需要一个字符串参数"
  }
};
export default {
  normal: [{
    value: true,
    key: "是"
  },
  {
    value: false,
    key: "否"
  }],
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
