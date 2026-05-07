export const appRoutes = [
  { id: "overview", path: "/overview", title: "仪表盘" },
  { id: "projects", path: "/projects", title: "我的项目" },
  { id: "workflow", path: "/workflow", title: "工作模版" },
  { id: "skills", path: "/skills", title: "行业技能" },
  { id: "knowledge", path: "/knowledge", title: "知识库" },
  { id: "config", path: "/config", title: "节点配置" },
  { id: "subscription", path: "/subscription", title: "订阅服务" },
];

export const routeIds = appRoutes.map((route) => route.id);

export function resolveRouteId(pathname = window.location.pathname) {
  const normalized = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  return routeIds.includes(normalized) ? normalized : "overview";
}
