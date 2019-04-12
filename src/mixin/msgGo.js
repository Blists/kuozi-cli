// Article(1, "文章"),
// Column(2, "专栏"),
// Group(3, "圈子"),
// ClassRoom(4, "课堂"),
// Focus(5, "关注"),
// other(6, "其他"),
// Personal(7, "个人"),
// Activity(8, "活动"),
export default {
    methods: {
        msgGo(message) {
            console.log(message.jumpUrl);
            if (message.jumpUrl) {
                this.$to({ path: message.jumpUrl });
            } else {
                switch (message.msgtype) {
                    case 1:
                        this.$to({ name: "articleDetail", params: { id: message.businessId } });
                        break;
                    case 2:
                        this.$to({ name: "columnsDetail", query: { columnId: message.businessId } });
                        break;
                    case 3:
                        this.$to({ name: "groupDetail", query: { groupId: message.businessId } });
                        break;
                    case 4:
                        this.$to({ name: "lessonDetail", query: { id: message.businessId } });
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    case 7:
                        break;
                        this.$to({ name: "activityDetail", query: { id: message.businessId } });
                    case 8:
                        break;
                }
            }
        }
    }
};
