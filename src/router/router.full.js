let routes = {};
const components = require.context("./../view/", true, /\.vue$/);
let pathProcess = p => {
    let path = "";
    let paths = p.split("/");
    let name = paths.pop();
    path = paths.join("/");
    return {
        name: name,
        path: path
    };
};
let isChild = (routes, parent, name, route, flag) => {
    let f;
    for (let n in routes) {
        if (n == parent) {
            flag = true;
            if (routes[parent].children) {
                routes[parent].children[name] = route;
            } else {
                routes[parent].children = {
                    [name]: route
                };
            }
        } else if (routes[n].children) {
            f = isChild(routes[n].children, parent, name, route, flag);
        }
    }
    return flag || f;
};
components.keys().forEach(key => {
    let path = key.replace(".", "").replace(".vue", "");
    let curr = pathProcess(path);
    let parent = pathProcess(curr.path).name;
    let route = {
        name: curr.name,
        path: path,
        meta: { login: false },
        component: components(key)
    };
    let flag = isChild(routes, parent, curr.name, route, false);
    if (!flag) {
        routes[curr.name] = route;
    }
});

export { routes };
