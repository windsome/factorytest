### 厂测开发
1. 登录界面 (用户名密码,调用一个接口登录,你可以随便访问一个地址,模拟保存一下数据即可), 之前已登录再进入app则不显示此界面, 直接到厂测界面.
  正确返回: {
    errcode: 0,
    message: 'success'
    token: 'xxxxxx',
    user: {
      id: 'xxxx',
      nickname: 'xxxx',
      ...
    }
  }
  错误返回: {
    errcode: 40001,
    message: '用户名密码错'
  }
2. 厂测界面(是主要操作界面,按照UI图做,地址: https://lanhuapp.com/url/oTmLB-ZEVaL)(注意:现在的界面还需要再改一下, 少了二维码显示的. 我尽快跟UI确认改一下.)
  + 商米打印的demo: https://github.com/shangmisunmi/SunmiPrinterDemo.git
  + 参考其中<https://github.com/shangmisunmi/SunmiPrinterDemo/blob/master/app/src/main/java/com/sunmi/printerhelper/activity/LabelActivity.java>内testOne函数,这个函数是打印条码的,你可以实现这个, 之后是需要改成打印图片的. (图片是用一个view包装两个二维码图片+文字, 然后截这个view的图来打印)
  + 红外线扫描的文档见<https://docs.sunmi.com/general-function-modules/scan/code-scanner-head-engineinfrared-scan-code/>, 主要看其中的用户指南, 即pdf文件<http://sunmi-ota.oss-cn-hangzhou.aliyuncs.com/DOC/resource/re_cn/%E6%89%AB%E7%A0%81%E5%A4%B4/%E6%89%AB%E7%A0%81%E5%A4%B4%E5%BC%80%E5%8F%91%E5%8F%8A%E7%94%A8%E6%88%B7%E6%96%87%E6%A1%A3.pdf>, 主要目标是, 按住界面上扫码按钮触发扫码, 然后将扫码得到内容填充到输入框.
3. 设置界面(原本还有一个主界面,后来主界面不要了, 入口不知道放哪里. 要不放登录页面?可如果登录页面不显示就没法进了. 暂时先不写吧.)

4. 开发上用jetpack, 本地数据保存应该不用sql数据库了吧, 直接简单的那种就行了吧.

