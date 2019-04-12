import vm from "../../index";
let groupUnRead = data => {
    vm.$store.commit("groupUnRead", { groupId: data.groupId });
};
let lessonVideoComment = data => {
    vm.$store.commit("lessonVideoComment");
};
let lessonVideoGift = data => {
    vm.$store.commit("lessonVideoGift");
};

export default function msgHandler(msg) {
    console.log(msg);
    switch (msg.type) {
        case "groupUnRead":
            groupUnRead(msg.data);
            break;
        case "lessonVideoComment":
            lessonVideoComment(msg.data);
            break;
        case "lessonVideoGift":
            lessonVideoGift(msg.data);
            break;
        default:
            console.warn("消息格式错误");
            break;
    }
}
