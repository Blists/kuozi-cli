/**
 * Created by kuo zi on 2016/10/12.
 */
let routes = { home: 
    { name: "home", path: "/main/home", meta: { login: false }, 
    component: () => import("./../view/main/home.vue") }, test1: { name: "test1", path: "/main/test/test1", meta: { login: false }, component: () => import("./../view/main/test/test1.vue") }, test2: { name: "test2", path: "/main/test/test2", meta: { login: false }, component: () => import("./../view/main/test/test2.vue") } };
export { routes };
