import { Toast } from 'vant';

class Utils {

  //验证表单
  validForm(o) {
    //验证表单的数据, object
    for (let key in o) {
      if (!o[key].reg.test(o[key].value)) {
        //提示
        Toast({
          message: o[key].errorMsg,
          duration: 3000,
          forbidClick: true
        });
        return false;
      }
    }

    //表单验证通过
    return true;
  }

}

export const utils = new Utils();