<template>
    <ui-layout no-home>
        <ui-container class="bg-gray">
            <ui-head no-back no-bottom style="background:white">
                <div slot="left">
                    <button class="btn-kefu" @click="$to({name:'contactAuto'})"></button>
                </div>
                <div class="flex" slot="right">
                    <button class="btn-msg" @click="$to({name:'message'})">
                        <div v-if="unreadMsg>0" class="no-read">
                            <span :class="{jia10:unreadMsg>9,jia100:unreadMsg>99}">{{unreadMsg>99?'99+':unreadMsg}}</span>
                        </div>
                    </button>
                    <button class="btn-setting" @click="$to({name:'setting',query:{expert:expert,pwdIsEmpty:user.pwdIsEmpty,price:user.money,loginName:user.loginName}})"></button>
                </div>
            </ui-head>
            <div class="my-info hr-bottom">
                <template v-if="login">
                    <div class="my-img" @click="$to({name:'homePage',query:{loginName:user.loginName,self:true}})">
                        <img v-if="user.loginName" :src="preImgRaw+user.loginName">
                        <div v-if="login&&expert&&user.type" class="img-lv">V</div>
                    </div>
                    <div class="my-name" @click="$to({name:'homePage',query:{loginName:user.loginName,self:true}})">
                        {{user.nickName}}
                        <div class="my-lv" v-if="user.level">LV{{user.level}}</div>
                    </div>
                </template>
                <template v-else>
                    <div class="my-img" @click="toLogin">
                        <img :src="preImg+LOGO" />
                    </div>
                    <button class="login-btn" @click="toLogin">
                        登录
                    </button>
                </template>
                <template v-if="login&&show">
                    <div class="my-company">{{user.company||'--'}}·{{user.post||'--'}}</div>
                    <div v-if="expert" class="my-other">
                        <div @click="$to({name:'myArticle'})">
                            <div class="my-no" v-text="user.articleNum||0"></div>
                            <div class="my-no-text">文章</div>
                        </div>
                        <div @click="$to({name:'myFans'})">
                            <div class="my-no" v-text="user.fansCount||0"></div>
                            <div class="my-no-text">粉丝</div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="my-cells">
                <mt-cell title="表单" @click.native="$to({name:'question',query:{serialNo:'20190313155714146366'}})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 4@2x.png" slot="icon" />
                </mt-cell>
                <mt-cell title="我的钱包" @click.native="$to({name:'myWallet'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 4@2x.png" slot="icon" />
                </mt-cell>
                <mt-cell is-link @click.native="$to({name:'myScores'})">
                    <img class="my-cell-img" src="../../assets/img/Group 5@2x.png" slot="icon" />
                    <span slot="title">
                        <span>我的积分</span>
                        <span class="info-more" style="position:relative;z-index:9" @click.stop="layer=true"></span>
                    </span>
                    <span class="text-info" v-text="user.score"></span>
                </mt-cell>
                <mt-cell title="我的勋章" is-link @click.native="$to({name:'myMedal'})">
                    <img class="my-cell-img" src="../../assets/img/勋章@2x.png" slot="icon" />
                </mt-cell>
            </div>
            <div class="my-cells">
                <mt-cell title="我的关注" @click.native="$to({name:'myAttention'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 6@2x 2.png" slot="icon" />
                </mt-cell>
                <mt-cell v-if="expert" title="我的发布" @click.native="$to({name:'myRelease'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/ic_logout@2x.png" slot="icon" />
                </mt-cell>
                <mt-cell v-if="expert" title="我的草稿箱" @click.native="$to({name:'myDraft'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/草稿箱.png" slot="icon" />
                </mt-cell>
                <mt-cell title="我的收藏" @click.native="$to({name:'myCollection'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/关注@2x.png" slot="icon" />
                </mt-cell>
                <mt-cell title="新手任务" @click.native="$to({name:'newPlayer'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 9@2x 2.png" slot="icon" />
                </mt-cell>
            </div>
            <div class="my-cells">
                <mt-cell title="我的问答" @click.native="$to({name:'myAnswer',query:{expert:expert}})" is-link>
                    <img class="my-cell-img" src="../../assets/img/问答@2x.png" slot="icon" />
                </mt-cell>
                <mt-cell title="我的课堂" @click.native="$to({name:'myClass'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 7@2x 2.png" slot="icon" />
                </mt-cell>
                <mt-cell title="我的优惠券" @click.native="$to({name:'myCoupon'})" is-link>
                    <img class="my-cell-img" src="../../assets/img/Group 8@2x.png" slot="icon" />
                </mt-cell>
            </div>
            <div v-if="!expert" style="padding:50px 28px;">
                <button v-if="user.applyProgress==0" class="btn1">达人审核中</button>
                <button v-else class="btn1" @click="applyExpert">申请成为达人</button>
            </div>
        </ui-container>
        <ui-root>
            <ui-layer :show.sync="layer">
                <div class="layer-content">
                    <div style="padding:10px;">
                        <p>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">针对每个参与社区</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">建设</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">和分享的</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">用户</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">，</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">期望财经</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">推出</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">用户</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">积分计划。参与社区</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">建设</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">的</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">途径</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">有多种，其中包括：</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">发表文章、评论和</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">回答问题。您对</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">期望财经</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">做的每项贡献都会获得相应的</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">积分</span>
                            </span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">奖励。</span>
                            </span>
                        </p>
                        <p>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">奖励规则如下</span>:</span>
                        </p>
                        <table>
                            <tbody>
                                <tr class="firstRow">
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">用户操作</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">积分</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">上限</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="138">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">适用角色</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">每日首次登录</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1（每日）</span>
                                        </p>
                                    </td>
                                    <td valign="center" rowspan="4" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="138">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">所有用户</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">阅读文章</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">评论</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">邀请新用户注册</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+5</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+50（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">发表文章</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+5</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+20（每日）</span>
                                        </p>
                                    </td>
                                    <td valign="center" rowspan="8" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="138">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">达人</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">发布课程</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+20（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">文章每增加50阅读量</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+20（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">文章被收藏1次</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">回答提问</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+2</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+20（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">文章或课程或发言被点赞1次</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">文章或课程或发言被打赏1次</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+1</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+10（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p>
                                            <span style=";font-family:等线;font-size:14px">文章或课程或发言打赏累计总额每增加100元</span>
                                        </p>
                                    </td>
                                    <td valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+5</span>
                                        </p>
                                    </td>
                                    <td valign="center" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+20（每日）</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">圈子每周发言数超过50条</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+100</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+100（每周）</span>
                                        </p>
                                    </td>
                                    <td valign="center" rowspan="2" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="138">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">圈主</span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid;" width="562">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">圈子每月发言数超过300条</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="91">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+500</span>
                                        </p>
                                    </td>
                                    <td valign="top" style="padding: 0px 7px; border-width: 1px; border-style: solid; border-color: rgb(0, 0, 0);" width="200">
                                        <p style="text-align:center">
                                            <span style=";font-family:等线;font-size:14px">+500（每月）</span>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p style="text-align:right">
                            <span style=";font-family:等线;font-size:14px">2</span>
                            <span style=";font-family:等线;font-size:14px">018</span>
                            <span style=";font-family:等线;font-size:14px">
                                <span style="font-family:等线">年</span>8月 更新</span>
                        </p>
                    </div>
                </div>
            </ui-layer>
        </ui-root>
    </ui-layout>
</template>



<script>
import UiRoot from "../../components/UiRoot.vue";
import UiLayer from "../../components/UiLayer.vue";
import { preImg, preImgRaw } from "../../../config/project/project.env";
import { STRING } from "../../utils/constants";
export default {
    components: { UiRoot, UiLayer },
    data() {
        return {
            preImg: preImg,
            preImgRaw: preImgRaw,
            user: {},
            expert: true,
            LOGO: STRING.LOGO,
            unreadMsg: 0,
            layer: false,
            show: false
        };
    },
    created() {
        if (this.login) {
            this.memberDetail();
            this.queryMessageByPage();
        }
    },
    methods: {
        toLogin() {
            sessionStorage.setItem("$path", this.$route.fullPath);
            this.$to({ name: "login" });
        },
        memberDetail() {
            this.$post("memberDetail", { loginName: null }).then(res => {
                this.user = res;
                this.expert = res.type != "11000";
                this.show = true;
            });
        },
        applyExpert() {
            this.Store.remove("applyMaster");
            this.$to({ name: "applyExpert", query: { name: this.user.nickName, photo: this.user.loginName } });
        },
        queryMessageByPage() {
            this.$post("queryMessageByPage", {
                status: 0,
                pageSize: 1,
                pageNo: 1
            }).then(res => {
                this.unreadMsg = res.count;
            });
        }
    }
};
</script>

<style lang="less">
@import "../../style/variables.less";
.my-info {
    padding-bottom: 20px;
    background: white;
    text-align: center;
    .my-img {
        position: relative;
        width: 78px;
        margin: 0 auto;
        > img {
            display: block;
            width: 78px;
            height: 78px;
            border-radius: 100%;
        }
        .img-lv {
            position: absolute;
            bottom: 0;
            right: 5px;
            width: 21px;
            height: 21px;
            background: #fec755;
            border: 1px solid white;
            border-radius: 100%;
            text-align: center;
            line-height: 21px;
            font-size: 13px;
            color: white;
        }
    }
    .my-name {
        position: relative;
        display: inline-block;
        padding: 10px 0;
        font-size: 18px;
        color: #121314;
        .my-lv {
            position: absolute;
            top: 15px;
            left: 100%;
            margin-left: 10px;
            border: 1px solid #fec755;
            border-radius: 2px;
            padding: 0 10px;
            font-size: 8px;
            color: #fec755;
        }
    }
    .login-btn {
        padding: 3px 15px;
        border-radius: 3px;
        background: @info;
        font-size: 13px;
        color: white;
    }
    .my-company {
        font-size: 14px;
        color: #333;
    }
    .my-other {
        display: flex;
        padding-top: 10px;
        > div {
            flex: 1;
            &:first-child {
                position: relative;
                &::after {
                    content: "";
                    position: absolute;
                    top: 10px;
                    right: 0;
                    width: 1px;
                    height: 25px;
                    background: #27347d;
                }
            }
        }
        .my-no {
            font-size: 18px;
            color: #4a4a4a;
        }
        .my-no-tetx {
            font-size: 14px;
            color: #999;
        }
    }
}
</style>
