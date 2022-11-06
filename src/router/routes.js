
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "rolls", component: () => import("pages/RollsPage.vue") },
      { path: "calendar", component: () => import("pages/CalendarPage.vue") },
      { path: "characters", component: () => import("pages/CharactersPage.vue") },
      { path: "server", component: () => import("pages/ServerPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
]

export default routes
