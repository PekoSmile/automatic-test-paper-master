import Vue from 'vue';
import Router from 'vue-router';

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location)
}
Vue.use(Router);

export default new Router({

	mode: 'history',
	routes: [
		{
			
			path: '/',
			redirect: '/dashboard'
		},
		{
			path: '/',
			component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
			meta: { title: '首页' },
			children: [ //
				{
					path: '/examinationRecord',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/examinationRecord.vue'),
					meta: { title: '考试记录' }
				},
				{
					path: '/subsection',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/subsection.vue'),
					meta: { title: '成绩分段' }
				},
				{
					path: '/achievement',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/achievement.vue'),
					meta: { title: '成绩页面' }
				},
				{
					path: '/answer',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/answer.vue'),
					meta: { title: '考试页面' }
				},
				{
					path: '/classInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/classInfo.vue'),
					meta: { title: '班级' }
				},
				{
					path: '/AutoPaper',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Home.vue'),
					meta: { title: '试卷管理' }
				},
				{
					path: '/Subject',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Subject.vue'),
					meta: { title: '科目管理' }
				},
				{
					path: '/Questions',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/Questions.vue'),
					meta: { title: '试题管理' }
				},
				{
					path: '/train',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/examination/train.vue'),
					meta: { title: '试题练习' }
				},
				{
					path: '/MenuInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/MenuInfo.vue'),
					meta: { title: '菜单管理' }
				},
				{
					path: '/RoleInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/RoleInfo.vue'),
					meta: { title: '角色管理' }
				},
				{
					path: '/UserInfo',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/UserInfo.vue'),
					meta: { title: '用户管理' }
				},
				{
					path: '/UpdatePassWord',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/UpdatePassWord.vue'),
					meta: { title: '密码修改' }
				},

				{
					path: '/dashboard',
					component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
					meta: { title: '系统首页' }
				},


				{
					path: '/404',
					component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
					meta: {
						title: '404'
					}
				},
				{
					path: '/403',
					component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
					meta: {
						title: '403'
					}
				},

			]
		},
		{
			path: '/login',
			component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue')
		},

		{
			path: '*',
			redirect: '/404'
		}
	]
});
