export default {
    data() {
        return {
            canSend: true,
            vtime: 60,
            dtime: 60,
            interval: null
        };
    },
    methods: {
        dTime() {
            this.canSend = false;
            this.vtime = 1;
            this.interval = setInterval(() => {
                this.vtime++;
                if (this.vtime >= this.dtime) {
                    clearInterval(this.interval);
                    this.canSend = true;
                }
            }, 1000);
        }
    },
    computed: {
        vtext() {
            if (this.vtime < this.dtime) {
                return `重新发送(${this.dtime - this.vtime})`;
            }
            return "获取验证码";
        }
    }
};
