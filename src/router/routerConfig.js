// 动态路由配置
const dynamic = { articleDetail: "/:id" };
// 是否需要登录
const login = true;
// 部分需要登录的页面
const needlogin = {};
// 部分不需要登录的页面
const nologin = {
    index: true,
    login: true,
    registerBind: true,
    registerStep1: true,
    registerStep2: true,
    registerStep3: true,
    backPwd1: true,
    backPwd2: true,

    home: true,
    article: true,
    articleDetail: true,

    class: true,
    lessonDetail: true,
    courseVideo: true,
    courseAudio: true,

    group: true,
    groupDetail: true,

    my: true,
    homePage: true,

    search: true,
    searchArticle: true,
    searchClass: true,
    searchGroup: true,
    searchUser: true,
    searchWd: true,

    expertList: true,
    selectDomain: true,
    domainDetail: true,
    activityList: true,
    activityDetail: true,
    columns: true,
    columnsDetail: true,

    question: true,
    questionView: true,
    subSucc: true
};
const titles = {
    default: "期望财经",
    article: "期望财经-为投资者提供有价值的信息-期货大宗交流社区-国内期货权威论坛",
    group: "圈子-期望财经",
    class: "课堂-期望财经",
    my: "我的-期望财经"
};
export { dynamic, login, needlogin, nologin, titles };
