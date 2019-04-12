<template>
    <ui-layout>
        <ui-head title="精华"></ui-head>
        <ui-container>
            <div class="hr-bottom" style="padding:0 10px;">
                <group-post v-for="(post,i) in posts" :key="post.id" :post="post" @top="top(post,i)" @detail="detail(i)" :type="type" essence></group-post>
            </div>
        </ui-container>
        <ui-layer :show.sync="showDetail1" postion="bottom" full>
            <ui-layout>
                <ui-head title="帖子详情" :backClick="closeDetail"></ui-head>
                <ui-container>
                    <group-post :post="posts[activePostIndex]" :group-id="groupId" detail></group-post>
                </ui-container>
            </ui-layout>
        </ui-layer>
        <ui-layer :show.sync="showDetail2" postion="bottom" full>
            <ui-layout>
                <ui-head title="帖子详情" :backClick="closeDetail"></ui-head>
                <ui-container>
                    <group-post :post="postDetail" :group-id="groupId" detail></group-post>
                </ui-container>
            </ui-layout>
        </ui-layer>
    </ui-layout>
</template>

<script>
import UiLayer from "../../components/UiLayer.vue";
import GroupPost from "../../components/module/GroupPost.vue";
import { shareAll, resetShare } from "../../utils/wx";
export default {
    components: { GroupPost, UiLayer },
    data() {
        return {
            groupId: this.$route.query.groupId,
            type: this.$route.query.type,
            pageNo: 1,
            posts: [],
            showDetail1: false,
            showDetail2: false,
            activePostIndex: 0,
            activePostId: this.$route.query.activePostId,
            postDetail: {},
            group: {}
        };
    },
    created() {
        this.$get("groupBasicDetail", this.groupId).then(res => {
            this.group = res;
        });
        this.postsQueryByPage();
        if (this.activePostId) {
            this.getPostDetail();
        }
    },
    methods: {
        // 帖子/精华
        postsQueryByPage() {
            this.$post("postsQueryByPage", {
                essence: 1,
                groupId: this.groupId,
                pageNo: this.pageNo,
                pageSize: this.PageSize
            }).then(res => {
                this.posts = res.results;
            });
        },
        top(post, i) {
            this.posts.splice(i, 1);
            this.posts.unshift(post);
        },
        getPostDetail() {
            this.$post("postsQueryById", {
                essence: 1,
                groupId: this.groupId,
                pageNo: 1,
                pageSize: 1,
                postsId: this.activePostId
            }).then(res => {
                this.postDetail = res.results[0];
                this.showDetail2 = true;
            });
        },
        detail(index) {
            this.activePostIndex = index;
            shareAll({
                // title: this.posts[this.activePostIndex].sponsorNickName,
                title: `「期望财经」${this.posts[this.activePostIndex].sponsorNickName}发布了：${this.posts[this.activePostIndex].question}`,
                // desc: this.posts[this.activePostIndex].question,
                desc: "加入圈子，查看更多",
                path: `/group/groupEssence?groupId=${this.groupId}&type=3&activePostId=${this.posts[this.activePostIndex].id}`,
                // imgUrl: this.preImg + this.posts[this.activePostIndex].sponsor
                imgUrl: this.preImg + this.group.photo
            });
            this.showDetail1 = true;
        },
        closeDetail() {
            resetShare();
            this.showDetail1 = false;
            this.showDetail2 = false;
        }
    }
};
</script>

<style lang="less">
</style>
