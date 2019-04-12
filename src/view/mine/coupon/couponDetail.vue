<template>
    <ui-layout>
        <ui-head title="优惠券详情"></ui-head>
        <ui-container class="bg-gray">
            <div class="coupon-detail">
                <div class="coupon-card">
                    <div class="coupon-name">线上期权投资讲座</div>
                    <div class="coupon-time">使用期限 2018.01.10—2018.01.31</div>
                    <div class="coupon-money">¥100</div>
                    <div class="coupon-syfw">适用范围</div>
                </div>
                <div class="coupon-use">
                    <div class="coupon-use-title">使用说明</div>
                    <div class="coupon-use-detail">
                        线上期权投资讲座山东莱阳市召开了一场高油酸花生产业发展论坛（什么是“高油酸花生”，后文有解释）。 国家现代农业（花生）产业技术创新体系首席科学家、山东省花生研究所前所长禹山林在论坛上
                    </div>
                </div>
            </div>
        </ui-container>
        <div class="bg-gray" style="padding:30px">
            <button class="btn1">立即使用</button>
        </div>
    </ui-layout>
</template>

<script>
export default {};
</script>

<style lang="less">
.coupon-detail {
    padding: 20px 10px;
    .coupon-card {
        padding: 30px 20px;
        background: #fa9d9d url("../../../assets/img/红包1@2x.png") no-repeat 0 100%;
        background-size: auto 180px;
        border-radius: 8px;
        color: white;
        .coupon-name {
            text-align: center;
            font-size: 18px;
        }
        .coupon-time {
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
        }
        .coupon-money {
            margin-top: 20px;
            padding-left: 200px;
            font-size: 36px;
        }
        .coupon-syfw {
            margin-top: 10px;
            padding-left: 200px;
            font-size: 10px;
        }
    }
    .coupon-use {
        font-size: 16px;
        .coupon-use-title {
            margin: 30px 0 10px 0;
            color: #333;
        }
        .coupon-use-detail {
            font-size: 16px;
            color: #666;
        }
    }
}
</style>
