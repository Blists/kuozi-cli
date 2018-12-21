// 动态路由配置
const dynamic = { testDetail: "/:id" };
// 是否需要登录
const login = true;
// 部分需要登录的页面
const needlogin = { test: true };
// 部分不需要登录的页面
const nologin = {
    index: true,
    login: true
};
export { dynamic, login, needlogin, nologin };