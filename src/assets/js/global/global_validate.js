import DB from './global_database.js'
import { fail } from 'assert';
export default {
  validateByType: function (value, type) {
    if (DB.dataType.hasOwnProperty(type)) {
      if (DB.dataType[type].reg.test(value) && DB.notNull.test(value))
        return true;
      else
        return false;
    }
    else {
      console.error("验证组件数据类型不存在");
    }
  }
}
