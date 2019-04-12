export default {
    methods: {
        highlight(keyword, text) {
            if (!keyword) return text;
            var strArray = [keyword];
            for (let str of strArray) {
                let reg = new RegExp(str, "g");
                text = text.replace(reg, v => {
                    return `<span>${v}</span>`;
                });
            }
            return text;
        }
    }
};
