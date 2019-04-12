export default {
    data() {
        return {
            // isPB: typeof pbE != "undefined" && !!pbE.SYS,
            isPB: false
        };
    },
    methods: {
        pbShare({ title, des, path }, callback) {
            let fullPath = path ? path : this.$route.fullPath;
            if (/\\?/.test(fullPath)) {
                fullPath = fullPath + "&back=article";
            } else {
                fullPath = fullPath + "?back=article";
            }
            let link = (window.location.origin + window.location.pathname).replace("index.html", "") + "redirect.html?path=" + encodeURIComponent(fullPath);
            alert(`pobo:pageId=800012&type=0&title=${title}&des=${des}&url=${encodeURIComponent(link)}`);
            // window.location.href = `pobo:pageId=800012&type=0&title=${title}&des=${des}&url=${encodeURIComponent(link)}`;
            window.location.href = `pobo:uncheck=1&pageId=800012&type=0&title=百度&des=百度一下，你就知道&url=${encodeURIComponent('https://www.baidu.com')}`;
            if (callback) callback();
        }
    }
};
