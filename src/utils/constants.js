import { INFO } from "../../config/project/project";
// 常量
const STRING = {
    INFO: INFO,
    LOGO: "logo",
    KFHYY: "您好！很高兴为您服务~~",
    KFHYYML: "您好！目前咨询人数较多，如未即时回复您，还请您谅解并耐心等候！您可将问题具体描述一下，人工客服收到您的消息后会尽快为您解答。",
    // KFJSY: "期待下次为您服务！"
    KFJSY: "亲爱的客户，您好！本次服务已结束，如果您还需要咨询其他问题，请继续留言。",
    WXLOGIN: "wxLogin"
};
const MTS = {
    Article: { mt: "10001", text: "文章" },
    Group: { mt: "10002", text: "圈子" },
    Author: { mt: "10003", text: "作者" },
    Column: { mt: "10004", text: "专栏" },
    ClassRoom: { mt: "10005", text: "课堂" },
    Domain: { mt: "10006", text: "领域" },
    Personal: { mt: "10007", text: "个人" },
    Comment: { mt: "10008", text: "评论" },
    Posts: { mt: "10009", text: "帖子" },
    Activity: { mt: "10011", text: "活动" },
    Ordinary: { mt: "11000", text: "普通人" },
    Expert: { mt: "12000", text: "达人" },
    Lesson: { mt: "10005", text: "课程" }
    // Personal_attention: { mt: "12001", text: "个人关注" },
    // Personal_belong: { mt: "12002", text: "个人所属" }
};
const ROLE = {
    COMMON_MEMBER: { type: 1, text: "成员" },
    GUEST: { type: 2, text: "嘉宾" },
    GROUP_LEADER: { type: 3, text: "圈主" },
    GROUP_ADMIN: { type: 4, text: "管理员" },
    NO_JOIN: { type: 5, text: "游客" }
};

const PAY_TYPE = {
    PAY_REWARD: "PAY_REWARD", // 打赏
    PAY_RECHARGE: "PAY_RECHARGE", // 充值
    PAY_ASK_QUESTION: "PAY_ASK_QUESTION", // 提问
    PAY_JOIN_GROUP: "PAY_JOIN_GROUP", // 付费入圈
    PAY_BUY_CLASSROOM: "PAY_BUY_CLASSROOM", // 购买课堂
    PAY_GIVE_GIFT: "PAY_GIVE_GIFT", // 礼物
    PAY_ACTIVITY_SIGNUP: "PAY_ACTIVITY_SIGNUP" // 活动报名
};

const WALLET_TYPE = {
    1001: { name: "打赏", type: "GIVE_A_REWARD" },
    1002: { name: "提现", type: "WITHDRAWAL" },
    1003: { name: "充值", type: "RECHARGE" },
    1004: { name: "提问", type: "ASK_QUESTION" },
    1005: { name: "退款", type: "REFUND" },
    1006: { name: "加入圈子", type: "JOIN_GROUP" },
    1007: { name: "购买课堂", type: "BUY_CLASSROOM" },
    1008: { name: "送礼物", type: "GIVE_GIFT" },
    1009: { name: "报名活动", type: "ACTIVITY_SIGNUP" }
};

// 命令消息action
const CMD = {
    QQJRKF: "请求接入客服",
    KFHFQQJRKF: "客服回复请求接入客服",
    TCPD: "客户退出排队",
    JRKF: "接入客服",
    KFJSFW: "客服结束服务",
    KHJSFW: "客户结束服务",
    GAG: "禁言中",
    ALLGAG: "全体禁言"
};
// 聊天类型
const CHAT_TYPE = {
    // 聊天类型
    CHAT: "chat",
    GROUPCHAT: "groupchat",
    CHATROOM: "chatroom",
    STRANGER: "stranger",
    SERVICE: "service"
};
// 直播聊天区分主播
const LIVE = {
    // 主播类型
    LIVING: "living",
    // 普通聊天类型
    LIVECHAT: "liveChat"
};
// 消息类型
const MSG_TYPE = {
    // 文本消息
    TXT: "txt",
    // 图片消息
    IMG: "img",
    // 命令消息
    CMD: "cmd",
    // 文件消息
    FILE: "file",
    // 音频消息
    AUDIO: "audio",
    // 视频消息
    VIDEO: "video",
    // 系统消息
    SYS: "sys",
    // 模板消息
    TMP: "tmp"
};
// 消息状态
const MSG_ST = {
    // 发送中
    SENDING: "sending",
    // 发送失败
    FAIL: "fail",
    // 发送成功
    SUCCESS: "success",
    // 对方未读
    NOREAD: "noRead",
    // 对方已读
    HASREAD: "hasRead"
};
// 客服状态
const KEFU_ST = {
    // 未接入
    NOACCEPT: "noaccept",
    // 队列中
    QUEUE: "queue",
    // 服务中
    SERVICING: "servicing",
    // 结束服务
    CLOSE: "close"
};

export { STRING, MTS, ROLE, PAY_TYPE, WALLET_TYPE, CMD, CHAT_TYPE, LIVE, MSG_TYPE, MSG_ST, KEFU_ST };
