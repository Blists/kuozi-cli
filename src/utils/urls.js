/**
 * Created by kuo zi on 2016/10/14.
 */
import { urls } from "yy-form-app";
const restUrl = {
    auth: {
        name: "token校验",
        url: "user/checkTokenValid",
        ignore: true
    },
    wxAuth: {
        name: "微信认证",
        url: "user/auth"
    },
    getWxconfig: {
        name: "获取微信配置",
        url: "user/getWxconfig"
    },
    wxRegister: {
        name: "微信注册",
        url: "user/wxRegister"
    },
    bindWX: {
        name: "绑定微信",
        url: "user/bindWX"
    },
    getWxInfo: {
        name: "获取微信头像",
        url: "user/getWxInfo"
    },
    toPayForWx: {
        name: "微信支付",
        url: "wx/toPayForWx"
    },
    toPayForWallet: {
        name: "钱包支付",
        url: "wallet/toPayForWallet"
    },
    phsendCode: {
        name: "发送短信验证码",
        url: "user/phsendCode"
    },
    phverifyVcode: {
        name: "注册验证短信验证码",
        url: "user/phverifyVcode"
    },
    register: {
        name: "用户注册",
        url: "user/register"
    },
    completeMemberInfo: {
        name: "用户信息完善",
        url: "user/completeMemberInfo"
    },
    loginByPwd: {
        name: "密码登录",
        url: "user/loginByPwd",
        ignoreParams: true
    },
    loginByPhone: {
        name: "验证码登录",
        url: "user/loginByPhone"
    },
    changePwd: {
        name: "修改密码",
        url: "user/changePwd",
        ignoreParams: true
    },
    memberDetail: {
        name: "用户基本信息",
        url: "user/memberDetail",
        ignore: true
    },
    queryByTypeName: {
        name: "数据字典查询",
        url: "dictionary/dictionaryValue/queryByTypeName"
    },
    // 文章
    saveArticle: {
        name: "发布文章",
        url: "article/saveArticle"
    },
    addColumn: {
        name: "新建文章",
        url: "column/addColumn"
    },
    queryBanner: {
        name: "banner查询",
        url: "banner/queryBanner"
    },
    queryArticleByPage: {
        name: "首页文章列表查询",
        url: "article/queryArticleByPage"
    },
    delBatch: {
        name: "批量删除文章",
        url: "article/del/batch"
    },
    queryRecommendArticleByPage: {
        name: "首页-推荐文章列表",
        url: "article/queryRecommendArticleByPage"
    },
    queryPostByPage: {
        name: "首页-问答",
        url: "posts/queryPostByPage"
    },
    searchByKeywords: {
        name: "首页搜索",
        url: "main/searchByKeywords"
    },
    searchMore: {
        name: "首页搜索更多",
        url: "main/searchMore"
    },
    queryColumns: {
        name: "专栏列表",
        url: "column/queryColumns"
    },
    columnDetail: {
        name: "专栏详情",
        url: "column/columnDetail"
    },
    columnFocus: {
        name: "专栏关注/取关",
        url: "column/focus"
    },
    queryArticleByColumn: {
        name: "专栏下文章列表",
        url: "column/queryArticleByColumn"
    },
    queryNormalArticleIdsAllByColumn: {
        name: "获取栏目下的所有文章的id",
        url: "article/queryNormalArticleIdsAllByColumn"
    },
    addArticle: {
        name: "批量添加文章",
        url: "column/addArticle"
    },
    delArticle: {
        name: "批量删除文章",
        url: "column/delArticle"
    },
    columnQueryUser: {
        name: "专栏下用户列表",
        url: "column/queryUser"
    },
    readArticle: {
        name: "阅读文章",
        url: "article/readArticle"
    },
    getArticleDetail: {
        name: "文章详情",
        url: "article/getArticleDetail"
    },
    queryRewardMember: {
        name: "文章被打赏记录",
        url: "wallet/queryRewardMember"
    },
    relatedArticle: {
        name: "文章详情-推荐文章列表",
        url: "article/relatedArticle"
    },
    queryComment: {
        name: "查询评论",
        url: "comment/queryComment"
    },
    saveComment: {
        name: "评论",
        url: "comment/saveComment"
    },
    saveLike: {
        name: "点赞",
        url: "like/saveLike"
    },
    checkLike: {
        name: "查询是否点赞",
        url: "like/checkLike"
    },
    focusSave: {
        name: "关注",
        url: "focus/save"
    },
    focusCancleFocus: {
        name: "取消关注",
        url: "focus/cancleFocus"
    },
    saveCollect: {
        name: "收藏",
        url: "collect/saveCollect"
    },
    delCollect: {
        name: "取消收藏",
        url: "collect/delCollect"
    },
    saveTips: {
        name: "举报",
        url: "tips/saveTips"
    },
    // 圈子
    groupSave: {
        name: "创建圈子",
        url: "group/save"
    },
    disbandGroup: {
        name: "解散圈子",
        url: "group/disbandGroup"
    },
    quitGroup: {
        name: "退出圈子",
        url: "group/quitGroup"
    },
    queryDomainsAll: {
        name: "查询所有领域",
        url: "domain/queryDomainsAll"
    },
    queryArticleByDomain: {
        name: "领域下文章",
        url: "domain/queryArticleByDomain"
    },
    queryQuesionByDomain: {
        name: "领域下问答",
        url: "domain/queryQuesionByDomain"
    },
    queryUserByDomain: {
        name: "领域下达人",
        url: "domain/queryUserByDomain"
    },
    checkDomainFocus: {
        name: "是否关注领域",
        url: "domain/checkDomainFocus"
    },
    listSelfGroup: {
        name: "我的圈子",
        url: "group/listSelfGroup"
    },
    recommendGroupList: {
        name: "推荐圈子列表",
        url: "group/recommendGroupList"
    },
    groupBasicDetail: {
        name: "圈子详情",
        url: "group/basicDetail"
    },
    updataGroup: {
        name: "修改圈子",
        url: "group/updataGroup"
    },
    postsQueryById: {
        name: "帖子详情",
        url: "posts/queryById"
    },
    queryAnswerDetail: {
        name: "问答详情",
        url: "posts/queryAnswerDetail"
    },
    postsSave: {
        name: "保存发帖/提问",
        url: "posts/save"
    },
    answer: {
        name: "回答问题",
        url: "posts/answer"
    },
    delPosts: {
        name: "删除帖子",
        url: "posts/delPosts"
    },
    postsQueryByPage: {
        name: "圈子下的帖子列表/精华列表",
        url: "posts/queryByPage"
    },
    topPosts: {
        name: "圈子提问置顶",
        url: "posts/topPosts"
    },
    unTopPosts: {
        name: "取消置顶",
        url: "posts/unTopPosts"
    },
    updateEnssence: {
        name: "添加/删除精华",
        url: "posts/updateEnssence"
    },
    listGuestOrLeader: {
        name: "圈子中的圈主以及嘉宾",
        url: "group/listGuestOrLeader"
    },
    listCommonUsersByPage: {
        name: "普通圈友列表",
        url: "group/listCommonUsersByPage"
    },
    addAdmin: {
        name: "设置管理员",
        url: "group/addAdmin"
    },
    addGuest: {
        name: "设置嘉宾",
        url: "group/addGuest"
    },
    removeGuest: {
        name: "取消嘉宾",
        url: "group/removeGuest"
    },
    delUser: {
        name: "移除该成员",
        url: "group/delUser"
    },
    checkInviterLink: {
        name: "检查分享码是否失效",
        url: "user/checkInviterLink"
    },
    inviteLink: {
        name: "邀请嘉宾生成分享码",
        url: "user/inviteLink/build"
    },
    acceptBeGuest: {
        name: "接受邀请成为嘉宾",
        url: "group/acceptBeGuest"
    },
    applyJoinGroup: {
        name: "申请加入圈子",
        url: "group/applyJoinGroup"
    },
    applyListByPage: {
        name: "申请加入圈子列表",
        url: "group/applyListByPage"
    },
    dealApply: {
        name: "处理加入圈子申请",
        url: "group/dealApply"
    },
    listTopicUsers: {
        name: "圈子中提问人员列表",
        url: "group/listTopicUsers"
    },
    listQaByPage: {
        name: "回答列表",
        url: "posts/listQaByPage"
    },
    qaDetail: {
        name: "回答详情",
        url: "posts/qaDetail"
    },
    fileUploadFile: {
        name: "文件上传",
        url: "file/uploadFile",
        ignoreParams: true
    },
    uploadFileWithName: {
        name: "文件上传指定名称",
        url: "file/uploadFileWithName",
        ignoreParams: true
    },
    uploadHeadImg: {
        name: "上传头像",
        url: "user/uploadFileWithName",
        ignoreParams: true
    },

    // 我的
    editBackground: {
        name: "修改背景",
        url: "user/editBackground"
    },
    initPwd: {
        name: "设置密码",
        url: "user/initPwd"
    },
    modifyPwd: {
        name: "修改密码",
        url: "user/modifyPwd"
    },
    modifyMember: {
        name: "个人信息修改",
        url: "user/modifyMember"
    },
    askQuestionMoney: {
        name: "设置提问金额",
        url: "user/askQuestionMoney"
    },
    queryMyDynamic: {
        name: "我的动态",
        url: "user/queryMyDynamic"
    },
    myWallet: {
        name: "我的钱包",
        url: "wallet/myWallet"
    },
    walletDetail: {
        name: "钱包明细",
        url: "wallet/walletDetail"
    },
    queryMyFocusFamousUser: {
        name: "我关注的达人",
        url: "focus/queryMyFocusFamousUserByPage"
    },
    queryMyFocusColumn: {
        name: "我关注的栏目",
        url: "focus/queryMyFocusColumnByPage"
    },
    queryMyFocusGroup: {
        name: "我关注的圈子",
        url: "focus/queryMyFocusGroupByPage"
    },
    queryMyCollectArticle: {
        name: "我收藏的文章",
        url: "collect/queryMyCollectArticleByPage"
    },
    queryCollect: {
        name: "我收藏的圈子帖子",
        url: "collect/queryCollect"
    },
    queryMyCollectGroup: {
        name: "我收藏的圈子",
        url: "collect/queryMyCollectGroupByPage"
    },
    queryMyCollectLesson: {
        name: "我收藏的课程",
        url: "collect/queryMyCollectLessonByPage"
    },
    queryMyArticles: {
        name: "我的发布的文章",
        url: "article/queryMyArticles"
    },
    queryMyColumn: {
        name: "我的专栏",
        url: "column/queryMyColumn"
    },
    queryMyFansPage: {
        name: "我的粉丝",
        url: "focus/queryMyFansPage"
    },
    queryMyQuestionAndAnswer: {
        name: "我的问答",
        url: "posts/queryMyQuestionAndAnswerByPage"
    },
    queryMyScoreRecords: {
        name: "我的积分明细",
        url: "score/queryMyScoreRecords"
    },
    queryCoupon: {
        name: "我的优惠券",
        url: "coupon/queryCoupon"
    },
    couponDetail: {
        name: "优惠券详情",
        url: "coupon/couponDetail"
    },
    queryCanUseCoupon: {
        name: "查询可用优惠券",
        url: "coupon/queryCanUseCoupon"
    },
    applyMaster: {
        name: "申请达人",
        url: "user/applyMaster"
    },

    wxReward: {
        name: "微信打赏",
        url: "wx/reward"
    },
    walletReward: {
        name: "钱包打赏",
        url: "wallet/reward"
    },
    recharge: {
        name: "钱包充值",
        url: "wx/recharge"
    },
    withdrawal: {
        name: "钱包提现",
        url: "wallet/withdrawal"
    },
    optionSave: {
        name: "意见反馈",
        url: "option/save"
    },

    queryActivity: {
        name: "查询活动列表",
        url: "activity/queryActivity"
    },
    activityDetail: {
        name: "查看活动详情",
        url: "activity/activityDetail"
    },
    enroolActivity: {
        name: "免费报名活动",
        url: "activity/enroolActivity"
    },

    recommendMastersByPage: {
        name: "推荐达人",
        url: "user/recommendMastersByPage"
    },
    listMasterByPage: {
        name: "所有达人",
        url: "user/listMasterByPage"
    },

    queryClassRoom: {
        name: "课堂查询",
        url: "classRoom/classRoom/query"
    },
    myClassRoom: {
        name: "我的课程",
        url: "classRoom/myClassRoom"
    },
    getClassRoom: {
        name: "查询课堂详情",
        url: "classRoom/classRoom/get"
    },
    freeJoinClass: {
        name: "免费加入课堂",
        url: "classRoom/freeJoinClass"
    },
    lessonQuery: {
        name: "课程列表查询",
        url: "classRoom/lesson/query"
    },
    lessonDetail: {
        name: "课程详情",
        url: "classRoom/lesson/detail"
    },
    queryGift: {
        name: "查询礼物列表",
        url: "gift/queryGift"
    },
    generateShareImg: {
        name: "生成课堂分享图片",
        url: "classRoom/generateShareImg"
    },

    queryMessageByPage: {
        name: "查询消息",
        url: "message/queryMessageByPage"
    },
    queryGroupMessage: {
        name: "查询圈子消息",
        url: "message/queryGroupMessage"
    },
    readAllMessage: {
        name: "阅读消息",
        url: "message/readAllMessage"
    },

    queryWelcome: {
        name: "智能客服欢迎语",
        url: "customer/queryWelcome"
    },
    queryAnswer: {
        name: "输入关键字回复相应类容",
        url: "customer/queryAnswer"
    },

    queryMyMedalWithNoGet: {
        name: "查询勋章列表：包含已经获得的勋章",
        url: "medal/queryMyMedalWithNoGet"
    },

    queryTaskInfo: {
        name: "获取新手任务",
        url: "task/queryTaskInfo"
    },
    receiveScore: {
        name: "领取积分",
        url: "task/receiveScore"
    },
    finishTask: {
        name: "完成任务",
        url: "task/finishTask"
    },

    getPubContent: {
        name: "获取发布内容",
        url: "pubContent/getPubContent"
    }
};

export default Object.assign(restUrl, urls);
