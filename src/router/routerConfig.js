// 动态路由配置
const dynamic = {
    testDetail: "/:id"
};
// 是否需要登录
const login = false;
// 部分需要登录的页面
const needlogin = {
    test: true
};
// 部分不需要登录的页面
const nologin = {
    index: true,
    login: true
};
// 一级导航页面
const navPages = {
    home: true
};
export { dynamic, login, needlogin, nologin, navPages };
