### 功能列表
1. 厂测
2. 登录注册
3. 安装
4. 巡检

### react-native开发需将js脚本编译到index.android.bundle中,才能启动成功.
```
cd my-react-native
mkdir android/app/src/main/assets/
yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```
### 系统本身界面
1. 加载资源中, AppLoading
2. 过渡界面/闪屏 Splash

### 登录前界面
1. 登录 (账号,密码,记住我) 是否通过手机号登录? 账号是不是就是手机号?
2. 注册 (昵称,手机号,验证码,密码)

### 登录后页面
3. 个人信息页面展示 (修改个人信息, 可以修改哪些? 手机号? 头像? 昵称? 具体页面是什么样)
4. 登录后首页 
  + 页面头: 头像,昵称, 消息, 扫描
  + 搜索框(搜索选项: IMEI,自定义编号,子项目名称,卡号等)
  + 轮播图区域
  + 主菜单(厂测,设备安装,设备巡检,我的项目,地图展示,设备信息,设备数据,异常数据,白蚁知识)
  + 动态展示列表
5. 厂测界面1
  + 获取产品列表
  + 选中某个产品,并提示将进行该产品下面的设备录入及工厂测试.
  + 确认后跳到厂测页面2
  + 设置创建设备超时时间
6. 厂测界面2
  + 显示当前产品信息(产品名称,产品ID,今天测试数量,错误数量)
  + 输入框+扫描按钮, 扫描芯片二维码,获取内容到输入框,实时解析得到imei,显示到下一行
  + 打印标签按钮, 根据IMEI打印标签
  + 创建设备按钮, 根据imei查询并创建设备(还是不用查询,直接创建?如果设备已存在,怎么处理?认为成功?还是失败?),显示创建结果
  + 创建结果展示
  + 成功按钮, 失败按钮
  + 等待消息上报提示
  + 消息列表倒序展示
7. 安装界面1
  + 录入: 设备IMEI, 自定义编号, 定位标签, 其他资料, 备注
  + 选择位置, 点击后进入安装界面2
  + 确认按钮
  + 确认后, 清空信息, 用于安装下一个.
  + 页面有未提交内容时返回需要提示用户. 
8. 安装界面2(是否做成个全屏弹出框?)
  + 展示地图
  + GNSS定位当前位置,同时GNSS值显示在界面上.
  + 确认按钮,返回安装界面1.


### 标签纸规格
58mm * 37mm 包含缝隙及边距.
实际白面为 55mm * 35mm, 缝隙为2mm

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

