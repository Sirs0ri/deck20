import { u as useAnchorProps, a as useModelToggleProps, b as useTransitionProps, v as validatePosition, c as validateOffset, d as useModelToggleEmits, e as useTransition, f as useScrollTarget, g as useAnchor, h as useModelToggle, i as usePortal, r as removeClickOutside, s as setPosition, p as parsePosition, j as addClickOutside, Q as QItem } from "./position-engine.f345ab8d.js";
import { Q as QBtn } from "./QBtn.d99eb4cd.js";
import { Q as QPage } from "./QPage.2745413d.js";
import { c as client, n as noop, d as leftClick, e as addEvt, p as preventDraggable, j as position, m as stopAndPrevent, k as cleanEvt, r as ref, q as computed, w as watch, g as getCurrentInstance, h, _ as Transition, b as nextTick, $ as KeepAlive, a0 as onBeforeMount, o as onMounted, a as onBeforeUnmount, a1 as History, a2 as isNumber, a3 as defineStore, H as getUid, K as openBlock, P as createElementBlock, U as normalizeClass, R as unref, O as createBaseVNode, a4 as createTextVNode, Z as toDisplayString, N as createVNode, M as withCtx, a5 as _export_sfc, a6 as storeToRefs, S as Fragment, Q as renderList, a7 as normalizeStyle, a8 as createCommentVNode, L as createBlock, a9 as mergeProps, aa as withModifiers, ab as pushScopeId, ac as popScopeId } from "./index.1f497e8e.js";
import { Q as QIcon } from "./QIcon.2cc72089.js";
import { a as createDirective, b as hSlot, c as createComponent, d as hDir, h as hMergeSlot } from "./render.797a0507.js";
import { g as getModifierDirections, s as shouldStart } from "./touch.70a9dd44.js";
import { c as clearSelection, u as useDarkProps, d as useDark, f as useTick, h as useTimeout, g as getScrollTarget } from "./use-timeout.c18b36e0.js";
import { b as getNormalizedVNodes, d as vmHasRouter } from "./Ripple.9df462d2.js";
import { u as useBridge } from "./bexBridge.5ef02c5c.js";
function parseArg(arg) {
  const data = [0.06, 6, 50];
  if (typeof arg === "string" && arg.length) {
    arg.split(":").forEach((val, index) => {
      const v = parseFloat(val);
      v && (data[index] = v);
    });
  }
  return data;
}
var TouchSwipe = createDirective(
  {
    name: "touch-swipe",
    beforeMount(el, { value, arg, modifiers }) {
      if (modifiers.mouse !== true && client.has.touch !== true) {
        return;
      }
      const mouseCapture = modifiers.mouseCapture === true ? "Capture" : "";
      const ctx = {
        handler: value,
        sensitivity: parseArg(arg),
        direction: getModifierDirections(modifiers),
        noop,
        mouseStart(evt) {
          if (shouldStart(evt, ctx) && leftClick(evt)) {
            addEvt(ctx, "temp", [
              [document, "mousemove", "move", `notPassive${mouseCapture}`],
              [document, "mouseup", "end", "notPassiveCapture"]
            ]);
            ctx.start(evt, true);
          }
        },
        touchStart(evt) {
          if (shouldStart(evt, ctx)) {
            const target = evt.target;
            addEvt(ctx, "temp", [
              [target, "touchmove", "move", "notPassiveCapture"],
              [target, "touchcancel", "end", "notPassiveCapture"],
              [target, "touchend", "end", "notPassiveCapture"]
            ]);
            ctx.start(evt);
          }
        },
        start(evt, mouseEvent) {
          client.is.firefox === true && preventDraggable(el, true);
          const pos = position(evt);
          ctx.event = {
            x: pos.left,
            y: pos.top,
            time: Date.now(),
            mouse: mouseEvent === true,
            dir: false
          };
        },
        move(evt) {
          if (ctx.event === void 0) {
            return;
          }
          if (ctx.event.dir !== false) {
            stopAndPrevent(evt);
            return;
          }
          const time = Date.now() - ctx.event.time;
          if (time === 0) {
            return;
          }
          const pos = position(evt), distX = pos.left - ctx.event.x, absX = Math.abs(distX), distY = pos.top - ctx.event.y, absY = Math.abs(distY);
          if (ctx.event.mouse !== true) {
            if (absX < ctx.sensitivity[1] && absY < ctx.sensitivity[1]) {
              ctx.end(evt);
              return;
            }
          } else if (absX < ctx.sensitivity[2] && absY < ctx.sensitivity[2]) {
            return;
          }
          const velX = absX / time, velY = absY / time;
          if (ctx.direction.vertical === true && absX < absY && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = distY < 0 ? "up" : "down";
          }
          if (ctx.direction.horizontal === true && absX > absY && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = distX < 0 ? "left" : "right";
          }
          if (ctx.direction.up === true && absX < absY && distY < 0 && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = "up";
          }
          if (ctx.direction.down === true && absX < absY && distY > 0 && absX < 100 && velY > ctx.sensitivity[0]) {
            ctx.event.dir = "down";
          }
          if (ctx.direction.left === true && absX > absY && distX < 0 && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = "left";
          }
          if (ctx.direction.right === true && absX > absY && distX > 0 && absY < 100 && velX > ctx.sensitivity[0]) {
            ctx.event.dir = "right";
          }
          if (ctx.event.dir !== false) {
            stopAndPrevent(evt);
            if (ctx.event.mouse === true) {
              document.body.classList.add("no-pointer-events--children");
              document.body.classList.add("non-selectable");
              clearSelection();
              ctx.styleCleanup = (withDelay) => {
                ctx.styleCleanup = void 0;
                document.body.classList.remove("non-selectable");
                const remove = () => {
                  document.body.classList.remove("no-pointer-events--children");
                };
                if (withDelay === true) {
                  setTimeout(remove, 50);
                } else {
                  remove();
                }
              };
            }
            ctx.handler({
              evt,
              touch: ctx.event.mouse !== true,
              mouse: ctx.event.mouse,
              direction: ctx.event.dir,
              duration: time,
              distance: {
                x: absX,
                y: absY
              }
            });
          } else {
            ctx.end(evt);
          }
        },
        end(evt) {
          if (ctx.event === void 0) {
            return;
          }
          cleanEvt(ctx, "temp");
          client.is.firefox === true && preventDraggable(el, false);
          ctx.styleCleanup !== void 0 && ctx.styleCleanup(true);
          evt !== void 0 && ctx.event.dir !== false && stopAndPrevent(evt);
          ctx.event = void 0;
        }
      };
      el.__qtouchswipe = ctx;
      if (modifiers.mouse === true) {
        const capture = modifiers.mouseCapture === true || modifiers.mousecapture === true ? "Capture" : "";
        addEvt(ctx, "main", [
          [el, "mousedown", "mouseStart", `passive${capture}`]
        ]);
      }
      client.has.touch === true && addEvt(ctx, "main", [
        [el, "touchstart", "touchStart", `passive${modifiers.capture === true ? "Capture" : ""}`],
        [el, "touchmove", "noop", "notPassiveCapture"]
      ]);
    },
    updated(el, bindings) {
      const ctx = el.__qtouchswipe;
      if (ctx !== void 0) {
        if (bindings.oldValue !== bindings.value) {
          typeof bindings.value !== "function" && ctx.end();
          ctx.handler = bindings.value;
        }
        ctx.direction = getModifierDirections(bindings.modifiers);
      }
    },
    beforeUnmount(el) {
      const ctx = el.__qtouchswipe;
      if (ctx !== void 0) {
        cleanEvt(ctx, "main");
        cleanEvt(ctx, "temp");
        client.is.firefox === true && preventDraggable(el, false);
        ctx.styleCleanup !== void 0 && ctx.styleCleanup();
        delete el.__qtouchswipe;
      }
    }
  }
);
function useCache() {
  const cache = /* @__PURE__ */ new Map();
  return {
    getCache: function(key, obj) {
      return cache[key] === void 0 ? cache[key] = obj : cache[key];
    },
    getCacheWithFn: function(key, fn) {
      return cache[key] === void 0 ? cache[key] = fn() : cache[key];
    }
  };
}
const usePanelChildProps = {
  name: { required: true },
  disable: Boolean
};
const PanelWrapper = {
  setup(_, { slots }) {
    return () => h("div", {
      class: "q-panel scroll",
      role: "tabpanel"
    }, hSlot(slots.default));
  }
};
const usePanelProps = {
  modelValue: {
    required: true
  },
  animated: Boolean,
  infinite: Boolean,
  swipeable: Boolean,
  vertical: Boolean,
  transitionPrev: String,
  transitionNext: String,
  transitionDuration: {
    type: [String, Number],
    default: 300
  },
  keepAlive: Boolean,
  keepAliveInclude: [String, Array, RegExp],
  keepAliveExclude: [String, Array, RegExp],
  keepAliveMax: Number
};
const usePanelEmits = ["update:modelValue", "before-transition", "transition"];
function usePanel() {
  const { props, emit, proxy } = getCurrentInstance();
  const { getCacheWithFn } = useCache();
  let panels, forcedPanelTransition;
  const panelIndex = ref(null);
  const panelTransition = ref(null);
  function onSwipe(evt) {
    const dir = props.vertical === true ? "up" : "left";
    goToPanelByOffset((proxy.$q.lang.rtl === true ? -1 : 1) * (evt.direction === dir ? 1 : -1));
  }
  const panelDirectives = computed(() => {
    return [[
      TouchSwipe,
      onSwipe,
      void 0,
      {
        horizontal: props.vertical !== true,
        vertical: props.vertical,
        mouse: true
      }
    ]];
  });
  const transitionPrev = computed(
    () => props.transitionPrev || `slide-${props.vertical === true ? "down" : "right"}`
  );
  const transitionNext = computed(
    () => props.transitionNext || `slide-${props.vertical === true ? "up" : "left"}`
  );
  const transitionStyle = computed(
    () => `--q-transition-duration: ${props.transitionDuration}ms`
  );
  const contentKey = computed(() => typeof props.modelValue === "string" || typeof props.modelValue === "number" ? props.modelValue : String(props.modelValue));
  const keepAliveProps = computed(() => ({
    include: props.keepAliveInclude,
    exclude: props.keepAliveExclude,
    max: props.keepAliveMax
  }));
  const needsUniqueKeepAliveWrapper = computed(
    () => props.keepAliveInclude !== void 0 || props.keepAliveExclude !== void 0
  );
  watch(() => props.modelValue, (newVal, oldVal) => {
    const index = isValidPanelName(newVal) === true ? getPanelIndex(newVal) : -1;
    if (forcedPanelTransition !== true) {
      updatePanelTransition(
        index === -1 ? 0 : index < getPanelIndex(oldVal) ? -1 : 1
      );
    }
    if (panelIndex.value !== index) {
      panelIndex.value = index;
      emit("before-transition", newVal, oldVal);
      nextTick(() => {
        emit("transition", newVal, oldVal);
      });
    }
  });
  function nextPanel() {
    goToPanelByOffset(1);
  }
  function previousPanel() {
    goToPanelByOffset(-1);
  }
  function goToPanel(name) {
    emit("update:modelValue", name);
  }
  function isValidPanelName(name) {
    return name !== void 0 && name !== null && name !== "";
  }
  function getPanelIndex(name) {
    return panels.findIndex((panel) => {
      return panel.props.name === name && panel.props.disable !== "" && panel.props.disable !== true;
    });
  }
  function getEnabledPanels() {
    return panels.filter((panel) => {
      return panel.props.disable !== "" && panel.props.disable !== true;
    });
  }
  function updatePanelTransition(direction) {
    const val = direction !== 0 && props.animated === true && panelIndex.value !== -1 ? "q-transition--" + (direction === -1 ? transitionPrev.value : transitionNext.value) : null;
    if (panelTransition.value !== val) {
      panelTransition.value = val;
    }
  }
  function goToPanelByOffset(direction, startIndex = panelIndex.value) {
    let index = startIndex + direction;
    while (index > -1 && index < panels.length) {
      const opt = panels[index];
      if (opt !== void 0 && opt.props.disable !== "" && opt.props.disable !== true) {
        updatePanelTransition(direction);
        forcedPanelTransition = true;
        emit("update:modelValue", opt.props.name);
        setTimeout(() => {
          forcedPanelTransition = false;
        });
        return;
      }
      index += direction;
    }
    if (props.infinite === true && panels.length > 0 && startIndex !== -1 && startIndex !== panels.length) {
      goToPanelByOffset(direction, direction === -1 ? panels.length : -1);
    }
  }
  function updatePanelIndex() {
    const index = getPanelIndex(props.modelValue);
    if (panelIndex.value !== index) {
      panelIndex.value = index;
    }
    return true;
  }
  function getPanelContentChild() {
    const panel = isValidPanelName(props.modelValue) === true && updatePanelIndex() && panels[panelIndex.value];
    return props.keepAlive === true ? [
      h(KeepAlive, keepAliveProps.value, [
        h(
          needsUniqueKeepAliveWrapper.value === true ? getCacheWithFn(contentKey.value, () => ({ ...PanelWrapper, name: contentKey.value })) : PanelWrapper,
          { key: contentKey.value, style: transitionStyle.value },
          () => panel
        )
      ])
    ] : [
      h("div", {
        class: "q-panel scroll",
        style: transitionStyle.value,
        key: contentKey.value,
        role: "tabpanel"
      }, [panel])
    ];
  }
  function getPanelContent() {
    if (panels.length === 0) {
      return;
    }
    return props.animated === true ? [h(Transition, { name: panelTransition.value }, getPanelContentChild)] : getPanelContentChild();
  }
  function updatePanelsList(slots) {
    panels = getNormalizedVNodes(
      hSlot(slots.default, [])
    ).filter(
      (panel) => panel.props !== null && panel.props.slot === void 0 && isValidPanelName(panel.props.name) === true
    );
    return panels.length;
  }
  function getPanels() {
    return panels;
  }
  Object.assign(proxy, {
    next: nextPanel,
    previous: previousPanel,
    goTo: goToPanel
  });
  return {
    panelIndex,
    panelDirectives,
    updatePanelsList,
    updatePanelIndex,
    getPanelContent,
    getEnabledPanels,
    getPanels,
    isValidPanelName,
    keepAliveProps,
    needsUniqueKeepAliveWrapper,
    goToPanelByOffset,
    goToPanel,
    nextPanel,
    previousPanel
  };
}
var QCarouselSlide = createComponent({
  name: "QCarouselSlide",
  props: {
    ...usePanelChildProps,
    imgSrc: String
  },
  setup(props, { slots }) {
    const style = computed(() => props.imgSrc ? { backgroundImage: `url("${props.imgSrc}")` } : {});
    return () => h("div", {
      class: "q-carousel__slide",
      style: style.value
    }, hSlot(slots.default));
  }
});
let counter = 0;
const useFullscreenProps = {
  fullscreen: Boolean,
  noRouteFullscreenExit: Boolean
};
const useFullscreenEmits = ["update:fullscreen", "fullscreen"];
function useFullscreen() {
  const vm = getCurrentInstance();
  const { props, emit, proxy } = vm;
  let historyEntry, fullscreenFillerNode, container;
  const inFullscreen = ref(false);
  vmHasRouter(vm) === true && watch(() => proxy.$route.fullPath, () => {
    props.noRouteFullscreenExit !== true && exitFullscreen();
  });
  watch(() => props.fullscreen, (v) => {
    if (inFullscreen.value !== v) {
      toggleFullscreen();
    }
  });
  watch(inFullscreen, (v) => {
    emit("update:fullscreen", v);
    emit("fullscreen", v);
  });
  function toggleFullscreen() {
    if (inFullscreen.value === true) {
      exitFullscreen();
    } else {
      setFullscreen();
    }
  }
  function setFullscreen() {
    if (inFullscreen.value === true) {
      return;
    }
    inFullscreen.value = true;
    container = proxy.$el.parentNode;
    container.replaceChild(fullscreenFillerNode, proxy.$el);
    document.body.appendChild(proxy.$el);
    counter++;
    if (counter === 1) {
      document.body.classList.add("q-body--fullscreen-mixin");
    }
    historyEntry = {
      handler: exitFullscreen
    };
    History.add(historyEntry);
  }
  function exitFullscreen() {
    if (inFullscreen.value !== true) {
      return;
    }
    if (historyEntry !== void 0) {
      History.remove(historyEntry);
      historyEntry = void 0;
    }
    container.replaceChild(proxy.$el, fullscreenFillerNode);
    inFullscreen.value = false;
    counter = Math.max(0, counter - 1);
    if (counter === 0) {
      document.body.classList.remove("q-body--fullscreen-mixin");
      if (proxy.$el.scrollIntoView !== void 0) {
        setTimeout(() => {
          proxy.$el.scrollIntoView();
        });
      }
    }
  }
  onBeforeMount(() => {
    fullscreenFillerNode = document.createElement("span");
  });
  onMounted(() => {
    props.fullscreen === true && setFullscreen();
  });
  onBeforeUnmount(exitFullscreen);
  Object.assign(proxy, {
    toggleFullscreen,
    setFullscreen,
    exitFullscreen
  });
  return {
    inFullscreen,
    toggleFullscreen
  };
}
const navigationPositionOptions = ["top", "right", "bottom", "left"];
const controlTypeOptions = ["regular", "flat", "outline", "push", "unelevated"];
var QCarousel = createComponent({
  name: "QCarousel",
  props: {
    ...useDarkProps,
    ...usePanelProps,
    ...useFullscreenProps,
    transitionPrev: {
      type: String,
      default: "fade"
    },
    transitionNext: {
      type: String,
      default: "fade"
    },
    height: String,
    padding: Boolean,
    controlColor: String,
    controlTextColor: String,
    controlType: {
      type: String,
      validator: (v) => controlTypeOptions.includes(v),
      default: "flat"
    },
    autoplay: [Number, Boolean],
    arrows: Boolean,
    prevIcon: String,
    nextIcon: String,
    navigation: Boolean,
    navigationPosition: {
      type: String,
      validator: (v) => navigationPositionOptions.includes(v)
    },
    navigationIcon: String,
    navigationActiveIcon: String,
    thumbnails: Boolean
  },
  emits: [
    ...useFullscreenEmits,
    ...usePanelEmits
  ],
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    let timer, panelsLen;
    const {
      updatePanelsList,
      getPanelContent,
      panelDirectives,
      goToPanel,
      previousPanel,
      nextPanel,
      getEnabledPanels,
      panelIndex
    } = usePanel();
    const { inFullscreen } = useFullscreen();
    const style = computed(() => inFullscreen.value !== true && props.height !== void 0 ? { height: props.height } : {});
    const direction = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const classes = computed(
      () => `q-carousel q-panel-parent q-carousel--with${props.padding === true ? "" : "out"}-padding` + (inFullscreen.value === true ? " fullscreen" : "") + (isDark.value === true ? " q-carousel--dark q-dark" : "") + (props.arrows === true ? ` q-carousel--arrows-${direction.value}` : "") + (props.navigation === true ? ` q-carousel--navigation-${navigationPosition.value}` : "")
    );
    const arrowIcons = computed(() => {
      const ico = [
        props.prevIcon || $q.iconSet.carousel[props.vertical === true ? "up" : "left"],
        props.nextIcon || $q.iconSet.carousel[props.vertical === true ? "down" : "right"]
      ];
      return props.vertical === false && $q.lang.rtl === true ? ico.reverse() : ico;
    });
    const navIcon = computed(() => props.navigationIcon || $q.iconSet.carousel.navigationIcon);
    const navActiveIcon = computed(() => props.navigationActiveIcon || navIcon.value);
    const navigationPosition = computed(
      () => props.navigationPosition || (props.vertical === true ? "right" : "bottom")
    );
    const controlProps = computed(() => ({
      color: props.controlColor,
      textColor: props.controlTextColor,
      round: true,
      [props.controlType]: true,
      dense: true
    }));
    watch(() => props.modelValue, () => {
      if (props.autoplay) {
        clearInterval(timer);
        startTimer();
      }
    });
    watch(() => props.autoplay, (val) => {
      if (val) {
        startTimer();
      } else {
        clearInterval(timer);
      }
    });
    function startTimer() {
      const duration = isNumber(props.autoplay) === true ? props.autoplay : 5e3;
      timer = setTimeout(
        duration >= 0 ? nextPanel : previousPanel,
        Math.abs(duration)
      );
    }
    onMounted(() => {
      props.autoplay && startTimer();
    });
    onBeforeUnmount(() => {
      clearInterval(timer);
    });
    function getNavigationContainer(type, mapping) {
      return h("div", {
        class: `q-carousel__control q-carousel__navigation no-wrap absolute flex q-carousel__navigation--${type} q-carousel__navigation--${navigationPosition.value}` + (props.controlColor !== void 0 ? ` text-${props.controlColor}` : "")
      }, [
        h("div", {
          class: "q-carousel__navigation-inner flex flex-center no-wrap"
        }, getEnabledPanels().map(mapping))
      ]);
    }
    function getContent() {
      const node = [];
      if (props.navigation === true) {
        const fn = slots["navigation-icon"] !== void 0 ? slots["navigation-icon"] : (opts) => h(QBtn, {
          key: "nav" + opts.name,
          class: `q-carousel__navigation-icon q-carousel__navigation-icon--${opts.active === true ? "" : "in"}active`,
          ...opts.btnProps,
          onClick: opts.onClick
        });
        const maxIndex = panelsLen - 1;
        node.push(
          getNavigationContainer("buttons", (panel, index) => {
            const name = panel.props.name;
            const active = panelIndex.value === index;
            return fn({
              index,
              maxIndex,
              name,
              active,
              btnProps: {
                icon: active === true ? navActiveIcon.value : navIcon.value,
                size: "sm",
                ...controlProps.value
              },
              onClick: () => {
                goToPanel(name);
              }
            });
          })
        );
      } else if (props.thumbnails === true) {
        const color = props.controlColor !== void 0 ? ` text-${props.controlColor}` : "";
        node.push(getNavigationContainer("thumbnails", (panel) => {
          const slide = panel.props;
          return h("img", {
            key: "tmb#" + slide.name,
            class: `q-carousel__thumbnail q-carousel__thumbnail--${slide.name === props.modelValue ? "" : "in"}active` + color,
            src: slide.imgSrc || slide["img-src"],
            onClick: () => {
              goToPanel(slide.name);
            }
          });
        }));
      }
      if (props.arrows === true && panelIndex.value >= 0) {
        if (props.infinite === true || panelIndex.value > 0) {
          node.push(
            h("div", {
              key: "prev",
              class: `q-carousel__control q-carousel__arrow q-carousel__prev-arrow q-carousel__prev-arrow--${direction.value} absolute flex flex-center`
            }, [
              h(QBtn, {
                icon: arrowIcons.value[0],
                ...controlProps.value,
                onClick: previousPanel
              })
            ])
          );
        }
        if (props.infinite === true || panelIndex.value < panelsLen - 1) {
          node.push(
            h("div", {
              key: "next",
              class: `q-carousel__control q-carousel__arrow q-carousel__next-arrow q-carousel__next-arrow--${direction.value} absolute flex flex-center`
            }, [
              h(QBtn, {
                icon: arrowIcons.value[1],
                ...controlProps.value,
                onClick: nextPanel
              })
            ])
          );
        }
      }
      return hMergeSlot(slots.control, node);
    }
    return () => {
      panelsLen = updatePanelsList(slots);
      return h("div", {
        class: classes.value,
        style: style.value
      }, [
        hDir(
          "div",
          { class: "q-carousel__slides-container" },
          getPanelContent(),
          "sl-cont",
          props.swipeable,
          () => panelDirectives.value
        )
      ].concat(getContent()));
    };
  }
});
const months = [
  { index: 1, name: "Praios", days: 30 },
  { index: 2, name: "Rondra", days: 30 },
  { index: 3, name: "Efferd", days: 30 },
  { index: 4, name: "Travia", days: 30 },
  { index: 5, name: "Boron", days: 30 },
  { index: 6, name: "Hesinde", days: 30 },
  { index: 7, name: "Firun", days: 30 },
  { index: 8, name: "Tsa", days: 30 },
  { index: 9, name: "Phex", days: 30 },
  { index: 10, name: "Peraine", days: 30 },
  { index: 11, name: "Ingerimm", days: 30 },
  { index: 12, name: "Rahja", days: 30 },
  { index: 13, name: "Namenlose Tage", days: 5 }
];
const days = [
  { index: 4, name: "Praiostag", isMoonpasePeak: false },
  { index: 5, name: "Rohalstag", isMoonpasePeak: false },
  { index: 6, name: "Feuertag", isMoonpasePeak: false },
  { index: 7, name: "Wassertag", isMoonpasePeak: false },
  { index: 1, name: "Windstag", isMoonpasePeak: false },
  { index: 2, name: "Erdstag", isMoonpasePeak: true },
  { index: 3, name: "Markttag", isMoonpasePeak: false }
];
const moonPhases = [
  { index: 1, name: "Tote Mada", symbol: "\u{1F318}", symbolPeak: "\u{1F311}" },
  { index: 2, name: "Kelch", symbol: "\u{1F312}", symbolPeak: "\u{1F313}" },
  { index: 3, name: "Rad", symbol: "\u{1F314}", symbolPeak: "\u{1F31D}" },
  { index: 4, name: "Helm", symbol: "\u{1F316}", symbolPeak: "\u{1F317}" }
];
function isDateInvalid({ day, month, year }) {
  if (month < 1)
    return "Falscher Monat (<1)";
  if (day < 1)
    return "Falscher Tag (<1)";
  if (month > 13)
    return "Falscher Monat (>13)";
  if (day > 30)
    return "Falscher Tag (>30)";
  if (month === 13 && day > 5)
    return "Es gibt nur 5 Namenlose Tage";
  return false;
}
function getWeekday({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekday = ((year - 1) * 365 + (month - 1) * 30 + day) % 7;
  return days[weekday];
}
function getMoonphase({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekday = ((year - 1) * 365 + (month - 1) * 30 + day + 22) % 28;
  return moonPhases[Math.floor(weekday / 7)];
}
function getMonth({ day, month, year }) {
  return months.find((m) => m.index === month);
}
function substractDays({ day, month, year }, difference) {
  let newDays = day - difference;
  let newMonth = month;
  let newYear = year;
  while (newDays <= 0) {
    newMonth--;
    if (newMonth <= 0) {
      newMonth = months.length;
      newYear--;
    }
    newDays += months.find((m) => m.index === newMonth).days;
  }
  return { day: newDays, month: newMonth, year: newYear };
}
function addDays({ day, month, year }, difference) {
  let currentMonth = getMonth({ day, month, year });
  let newDays = day + difference;
  let newMonth = month;
  let newYear = year;
  while (newDays > currentMonth.days) {
    newMonth++;
    newDays -= currentMonth.days;
    if (newMonth > months.length) {
      newMonth = 1;
      newYear++;
    }
    currentMonth = getMonth({ day: 1, month: newMonth, year: newYear });
  }
  return { day: newDays, month: newMonth, year: newYear };
}
function dateEquals(a, b) {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}
function getDateStrings({ day, month, year }) {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const weekDay = getWeekday({ day, month, year });
  const moonPhase = getMoonphase({ day, month, year });
  const moonSymbol = weekDay.isMoonpasePeak ? moonPhase.symbolPeak : moonPhase.symbol;
  return {
    dayName: weekDay.name,
    monthName: months.find((m) => m.index === month).name,
    moonPhase: moonPhase.name,
    moonSymbol
  };
}
function getFormattedDate({ day, month, year }, mode = "full") {
  const dateError = isDateInvalid({ day, month, year });
  if (dateError)
    return dateError;
  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol
  } = getDateStrings({ day, month, year });
  switch (mode) {
    case "short":
      return `${day}. ${monthName} ${year}, ein ${dayName}.`;
    case "full":
    default:
      return `${day}. ${monthName} ${year}, ein ${dayName}. Mondphase: ${moonPhase} ${moonSymbol}`;
  }
}
function getDayPopupString({ day, month, year }) {
  const {
    dayName,
    monthName,
    moonPhase,
    moonSymbol
  } = getDateStrings({ day, month, year });
  return `${day}. ${monthName} ${year} <br> ${dayName} <br> ${moonPhase} ${moonSymbol}`;
}
const STORE_NAME = "calendar";
const useCalendarStore = defineStore(STORE_NAME, () => {
  const uid = getUid();
  const initialDate = { day: 0, month: 0, year: 0 };
  const today = ref({ ...initialDate });
  watch(today, (newVal, oldVal) => {
    if (dateEquals(oldVal, initialDate))
      return;
    if (dateEquals(oldVal, newVal))
      return;
    persistDebounced();
  });
  function increment() {
    today.value = addDays(today.value, 1);
  }
  const restored = ref(false);
  const restoration = ref(null);
  const { bexSend, bexOn } = useBridge();
  let timeout = null;
  function persistDebounced() {
    if (!restored.value)
      return;
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(persist, 750);
  }
  function persist() {
    if (!restored.value)
      return;
    {
      bexSend("persist-store", {
        key: STORE_NAME,
        uid,
        value: {
          today: today.value
        }
      });
    }
  }
  async function restore() {
    {
      const { data } = await bexSend("restore-store", STORE_NAME);
      if (data && "today" in data)
        today.value = data.today;
      else
        today.value = { day: 10, month: 5, year: 1025 };
      return true;
    }
  }
  bexOn("store-persisted", ({ data }) => {
    if (data.uid !== uid) {
      restored.value = false;
      restoration.value = restore().then((success) => {
        restored.value = success;
      });
    }
  });
  restoration.value = restore().then((success) => {
    restored.value = success;
  });
  return {
    today,
    increment,
    restored,
    restoration
  };
});
var CalendarDayBackground_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$3 = /* @__PURE__ */ createBaseVNode("div", { class: "background" }, null, -1);
const _hoisted_2$1 = [
  _hoisted_1$3
];
const _sfc_main$3 = {
  __name: "CalendarDayBackground",
  props: {
    date: {
      type: Object,
      default: () => ({ day: 1, month: 1, year: 1 })
    },
    today: {
      type: Boolean,
      default: false
    },
    previousMonth: {
      type: Boolean,
      default: false
    },
    nextMonth: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const cornerClasses = computed(() => {
      if (props.previousMonth || props.nextMonth)
        return "";
      const day = getWeekday(props.date);
      const _month = getMonth(props.date);
      const dayIndex = props.date.day;
      return Object.entries({
        "current-month": true,
        "corner--1": dayIndex === _month.days && day.index !== days.length && _month.days >= days.length,
        "corner--3": dayIndex === 1 && day.index !== 1 && _month.days >= days.length,
        "border-1": dayIndex <= days.length,
        "border-2": day.index === days.length || dayIndex === _month.days,
        "border-3": dayIndex > _month.days - days.length,
        "border-4": day.index === 1 || dayIndex === 1
      }).filter(([cornerId, active]) => active).map(([cornerId, active]) => cornerId).join(" ");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["date-cell-background", unref(cornerClasses)])
      }, _hoisted_2$1, 2);
    };
  }
};
var QTooltip = createComponent({
  name: "QTooltip",
  inheritAttrs: false,
  props: {
    ...useAnchorProps,
    ...useModelToggleProps,
    ...useTransitionProps,
    maxHeight: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null
    },
    transitionShow: {
      default: "jump-down"
    },
    transitionHide: {
      default: "jump-up"
    },
    anchor: {
      type: String,
      default: "bottom middle",
      validator: validatePosition
    },
    self: {
      type: String,
      default: "top middle",
      validator: validatePosition
    },
    offset: {
      type: Array,
      default: () => [14, 14],
      validator: validateOffset
    },
    scrollTarget: {
      default: void 0
    },
    delay: {
      type: Number,
      default: 0
    },
    hideDelay: {
      type: Number,
      default: 0
    }
  },
  emits: [
    ...useModelToggleEmits
  ],
  setup(props, { slots, emit, attrs }) {
    let unwatchPosition, observer;
    const vm = getCurrentInstance();
    const { proxy: { $q } } = vm;
    const innerRef = ref(null);
    const showing = ref(false);
    const anchorOrigin = computed(() => parsePosition(props.anchor, $q.lang.rtl));
    const selfOrigin = computed(() => parsePosition(props.self, $q.lang.rtl));
    const hideOnRouteChange = computed(() => props.persistent !== true);
    const { registerTick, removeTick } = useTick();
    const { registerTimeout } = useTimeout();
    const { transition, transitionStyle } = useTransition(props, showing);
    const { localScrollTarget, changeScrollEvent, unconfigureScrollTarget } = useScrollTarget(props, configureScrollTarget);
    const { anchorEl, canShow, anchorEvents } = useAnchor({ showing, configureAnchorEl });
    const { show, hide } = useModelToggle({
      showing,
      canShow,
      handleShow,
      handleHide,
      hideOnRouteChange,
      processOnMount: true
    });
    Object.assign(anchorEvents, { delayShow, delayHide });
    const { showPortal, hidePortal, renderPortal } = usePortal(vm, innerRef, renderPortalContent);
    if ($q.platform.is.mobile === true) {
      const clickOutsideProps = {
        anchorEl,
        innerRef,
        onClickOutside(e) {
          hide(e);
          if (e.target.classList.contains("q-dialog__backdrop")) {
            stopAndPrevent(e);
          }
          return true;
        }
      };
      const hasClickOutside = computed(
        () => props.modelValue === null && props.persistent !== true && showing.value === true
      );
      watch(hasClickOutside, (val) => {
        const fn = val === true ? addClickOutside : removeClickOutside;
        fn(clickOutsideProps);
      });
      onBeforeUnmount(() => {
        removeClickOutside(clickOutsideProps);
      });
    }
    function handleShow(evt) {
      showPortal();
      registerTick(() => {
        observer = new MutationObserver(() => updatePosition());
        observer.observe(innerRef.value, { attributes: false, childList: true, characterData: true, subtree: true });
        updatePosition();
        configureScrollTarget();
      });
      if (unwatchPosition === void 0) {
        unwatchPosition = watch(
          () => $q.screen.width + "|" + $q.screen.height + "|" + props.self + "|" + props.anchor + "|" + $q.lang.rtl,
          updatePosition
        );
      }
      registerTimeout(() => {
        showPortal(true);
        emit("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTick();
      hidePortal();
      anchorCleanup();
      registerTimeout(() => {
        hidePortal(true);
        emit("hide", evt);
      }, props.transitionDuration);
    }
    function anchorCleanup() {
      if (observer !== void 0) {
        observer.disconnect();
        observer = void 0;
      }
      if (unwatchPosition !== void 0) {
        unwatchPosition();
        unwatchPosition = void 0;
      }
      unconfigureScrollTarget();
      cleanEvt(anchorEvents, "tooltipTemp");
    }
    function updatePosition() {
      const el = innerRef.value;
      if (anchorEl.value === null || !el) {
        return;
      }
      setPosition({
        el,
        offset: props.offset,
        anchorEl: anchorEl.value,
        anchorOrigin: anchorOrigin.value,
        selfOrigin: selfOrigin.value,
        maxHeight: props.maxHeight,
        maxWidth: props.maxWidth
      });
    }
    function delayShow(evt) {
      if ($q.platform.is.mobile === true) {
        clearSelection();
        document.body.classList.add("non-selectable");
        const target = anchorEl.value;
        const evts = ["touchmove", "touchcancel", "touchend", "click"].map((e) => [target, e, "delayHide", "passiveCapture"]);
        addEvt(anchorEvents, "tooltipTemp", evts);
      }
      registerTimeout(() => {
        show(evt);
      }, props.delay);
    }
    function delayHide(evt) {
      if ($q.platform.is.mobile === true) {
        cleanEvt(anchorEvents, "tooltipTemp");
        clearSelection();
        setTimeout(() => {
          document.body.classList.remove("non-selectable");
        }, 10);
      }
      registerTimeout(() => {
        hide(evt);
      }, props.hideDelay);
    }
    function configureAnchorEl() {
      if (props.noParentEvent === true || anchorEl.value === null) {
        return;
      }
      const evts = $q.platform.is.mobile === true ? [
        [anchorEl.value, "touchstart", "delayShow", "passive"]
      ] : [
        [anchorEl.value, "mouseenter", "delayShow", "passive"],
        [anchorEl.value, "mouseleave", "delayHide", "passive"]
      ];
      addEvt(anchorEvents, "anchor", evts);
    }
    function configureScrollTarget() {
      if (anchorEl.value !== null || props.scrollTarget !== void 0) {
        localScrollTarget.value = getScrollTarget(anchorEl.value, props.scrollTarget);
        const fn = props.noParentEvent === true ? updatePosition : hide;
        changeScrollEvent(localScrollTarget.value, fn);
      }
    }
    function getTooltipContent() {
      return showing.value === true ? h("div", {
        ...attrs,
        ref: innerRef,
        class: [
          "q-tooltip q-tooltip--style q-position-engine no-pointer-events",
          attrs.class
        ],
        style: [
          attrs.style,
          transitionStyle.value
        ],
        role: "tooltip"
      }, hSlot(slots.default)) : null;
    }
    function renderPortalContent() {
      return h(Transition, {
        name: transition.value,
        appear: true
      }, getTooltipContent);
    }
    onBeforeUnmount(anchorCleanup);
    Object.assign(vm.proxy, { updatePosition });
    return renderPortal;
  }
});
var CalendarDayItem_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$2 = ["innerHTML"];
const _sfc_main$2 = {
  __name: "CalendarDayItem",
  props: {
    date: {
      type: Object,
      default: () => ({ day: 1, month: 1, year: 1 })
    },
    today: {
      type: Boolean,
      default: false
    },
    previousMonth: {
      type: Boolean,
      default: false
    },
    nextMonth: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["date-cell", {
          today: __props.today,
          "previous-month": __props.previousMonth,
          "next-month": __props.nextMonth
        }])
      }, [
        createTextVNode(toDisplayString(__props.date.day) + " ", 1),
        createVNode(QTooltip, {
          class: "text-center text-body2",
          "transition-show": "jump-down",
          "transition-hide": "fade"
        }, {
          default: withCtx(() => [
            createBaseVNode("span", {
              innerHTML: unref(getDayPopupString)(__props.date)
            }, null, 8, _hoisted_1$2)
          ]),
          _: 1
        })
      ], 2);
    };
  }
};
var CalendarView_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-2a153265"), n = n(), popScopeId(), n);
const _hoisted_1$1 = ["onWheel"];
const _hoisted_2 = {
  key: 0,
  class: "header"
};
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "days-background" }, null, -1));
const _hoisted_4 = { style: { "display": "contents" } };
const _hoisted_5 = { style: { "display": "contents" } };
const _sfc_main$1 = {
  __name: "CalendarView",
  setup(__props) {
    const store = useCalendarStore();
    const { today } = storeToRefs(store);
    store.restoration.then(() => showToday());
    const currentView = ref(null);
    const slide = ref("bf");
    const carousel = ref(null);
    function carouselNext() {
      carousel.value.next();
    }
    function carouselPrev() {
      carousel.value.previous();
    }
    const currentViewDays = computed(() => {
      if (!currentView.value)
        return [];
      const view = unref(currentView);
      const firstOfThisMonth = { ...view, day: 1 };
      const lastOfThisMonth = { ...view, day: getMonth(view).days };
      const daysBeforeCount = getWeekday(firstOfThisMonth).index - 1;
      const daysCount = getMonth(view).days;
      const daysAfterCount = 6 * 7 - daysBeforeCount - daysCount;
      const days2 = [];
      let dayIndex = 0;
      for (let i = daysBeforeCount; i > 0; i--) {
        const date = substractDays(firstOfThisMonth, i);
        days2.push({
          bind: {
            date,
            previousMonth: true,
            nextMonth: false,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      for (let i = 1; i <= daysCount; i++) {
        const date = { ...view, day: i };
        days2.push({
          bind: {
            date,
            previousMonth: false,
            nextMonth: false,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      for (let i = 1; i <= daysAfterCount; i++) {
        const date = addDays(lastOfThisMonth, i);
        days2.push({
          bind: {
            date,
            previousMonth: false,
            nextMonth: true,
            today: isToday(date)
          },
          gridArea: `week ${Math.floor(dayIndex / 7) + 1} / day ${dayIndex % 7 + 1}`
        });
        dayIndex++;
      }
      return days2;
    });
    function isToday({ day, month, year }) {
      return dateEquals(today.value, { day, month, year });
    }
    const seasonIcons = [
      "sym_r_filter_drama",
      "sym_r_ac_unit",
      "sym_r_local_florist",
      "sym_r_sunny"
    ];
    const seasonIcon = computed(() => {
      if (!currentView.value)
        return "";
      switch (currentView.value.month) {
        case 3:
        case 4:
        case 5:
          return "sym_r_filter_drama";
        case 6:
        case 7:
        case 8:
          return "sym_r_ac_unit";
        case 9:
        case 10:
        case 11:
          return "sym_r_local_florist";
        case 12:
        case 13:
        case 1:
        case 2:
          return "sym_r_sunny";
        default:
          return "";
      }
    });
    function onWheel(evt) {
      const targetClassList = evt.target.classList;
      if (!targetClassList.contains("date-cell") && !targetClassList.contains("days-background"))
        return;
      const { deltaY, deltaX } = evt;
      if (deltaY > 0)
        showNextMonth();
      else if (deltaY < 0)
        showPreviousMonth();
      if (deltaX > 0)
        showNextYear();
      else if (deltaX < 0)
        showPreviousYear();
    }
    function showNextMonth() {
      if (!currentView.value)
        return;
      if (currentView.value.month === months.length) {
        currentView.value.month = 1;
        currentView.value.year++;
      } else {
        currentView.value.month++;
      }
    }
    function showPreviousMonth() {
      if (!currentView.value)
        return;
      if (currentView.value.month === 1) {
        currentView.value.month = months.length;
        currentView.value.year--;
      } else {
        currentView.value.month--;
      }
    }
    function showNextYear() {
      if (!currentView.value)
        return;
      currentView.value.year++;
    }
    function showPreviousYear() {
      if (!currentView.value)
        return;
      currentView.value.year--;
    }
    function showToday() {
      currentView.value = { ...today.value, day: 1 };
    }
    let doubleClick = false;
    function handleDayClick(day, clickEvt) {
      if (clickEvt.ctrlKey) {
        if (doubleClick) {
          today.value = day.bind.date;
        } else {
          doubleClick = true;
          setTimeout(() => {
            doubleClick = false;
          }, 200);
        }
        return;
      }
      if (day.bind.previousMonth || day.bind.nextMonth) {
        currentView.value = { ...day.bind.date, day: 1 };
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "calendar",
        onWheel: withModifiers(onWheel, ["prevent"]),
        onMouseup: _cache[1] || (_cache[1] = withModifiers(($event) => showToday(), ["middle"]))
      }, [
        (openBlock(), createElementBlock(Fragment, null, renderList(seasonIcons, (icon) => {
          return createVNode(QIcon, {
            key: `si_${icon}`,
            class: "season-icon",
            size: "12em",
            name: icon,
            style: normalizeStyle(icon === unref(seasonIcon) ? "" : "scale: 0.9; opacity: 0")
          }, null, 8, ["name", "style"]);
        }), 64)),
        (openBlock(), createElementBlock(Fragment, null, renderList(seasonIcons, (icon) => {
          return createVNode(QIcon, {
            key: `si_${icon}`,
            class: "season-icon season-icon-top",
            size: "12em",
            name: icon,
            style: normalizeStyle(icon === unref(seasonIcon) ? "" : "scale: 0.9; opacity: 0")
          }, null, 8, ["name", "style"]);
        }), 64)),
        currentView.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createVNode(QCarousel, {
            ref_key: "carousel",
            ref: carousel,
            modelValue: slide.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => slide.value = $event),
            vertical: "",
            class: "bg-transparent fit",
            animated: "",
            "transition-prev": "jump-down",
            "transition-next": "jump-up",
            "transition-duration": "100",
            onMouseenter: carouselNext,
            onMouseleave: carouselPrev
          }, {
            default: withCtx(() => [
              createVNode(QCarouselSlide, {
                name: "bf",
                style: { "padding": "0" },
                class: "flex flex-center"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(getMonth)(currentView.value).name) + " " + toDisplayString(currentView.value.year) + " BF ", 1)
                ]),
                _: 1
              }),
              createVNode(QCarouselSlide, {
                name: "hal",
                style: { "padding": "0" },
                class: "flex flex-center"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(getMonth)(currentView.value).name) + " " + toDisplayString(currentView.value.year - 993) + " Hal ", 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: "grid-button",
          style: { "grid-area": "hdr / day 6" },
          onClick: showPreviousMonth
        }, [
          createVNode(QIcon, {
            size: "sm",
            color: "primary",
            name: "sym_r_navigate_before"
          })
        ]),
        createBaseVNode("div", {
          class: "grid-button",
          style: { "grid-area": "hdr / day 7" },
          onClick: showNextMonth
        }, [
          createVNode(QIcon, {
            size: "sm",
            color: "primary",
            name: "sym_r_navigate_next"
          })
        ]),
        _hoisted_3,
        createBaseVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentViewDays), (day, i) => {
            return openBlock(), createBlock(_sfc_main$3, mergeProps({
              key: `day_${i}`
            }, day.bind, {
              style: { gridArea: day.gridArea }
            }), null, 16, ["style"]);
          }), 128))
        ]),
        createBaseVNode("div", _hoisted_5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(currentViewDays), (day, i) => {
            return openBlock(), createBlock(_sfc_main$2, mergeProps({
              key: `day_${i}`
            }, day.bind, {
              style: { gridArea: day.gridArea },
              onClick: (evt) => handleDayClick(day, evt)
            }), null, 16, ["style", "onClick"]);
          }), 128))
        ]),
        currentView.value ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "footer grid-button",
          onClick: showToday
        }, toDisplayString(unref(getFormattedDate)(unref(store).today, "short")), 1)) : createCommentVNode("", true)
      ], 40, _hoisted_1$1);
    };
  }
};
var Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2a153265"]]);
const _hoisted_1 = { class: "row full-width justify-around" };
const _sfc_main = {
  __name: "CalendarPage",
  setup(__props) {
    const { bexSend, bexOn } = useBridge();
    const store = useCalendarStore();
    function sendToRoll20(evt) {
      const sendPublicly = evt.ctrlKey;
      bridgedMessage("dom", "send-message", {
        msg: `${sendPublicly ? "" : "/w Max "}Heute ist der ${getFormattedDate(store.today)}`
      });
    }
    async function bridgedMessage(dst, command, data = {}, timeout = -1) {
      return new Promise((resolve, reject) => {
        const uuid = getUid();
        let off;
        if (timeout >= 0) {
          setTimeout(() => {
            off && off();
            reject("Timeout");
          }, timeout);
        }
        if (dst === "background") {
          bexSend(command, data).then((data2) => {
            resolve(data2);
          });
        } else {
          off = bexOn(`bridge-response.${uuid}`, ({ data: data2, respond }) => {
            off();
            resolve(data2);
          });
          data._pathing = {
            uuid,
            src: "ui",
            dst,
            lastFwd: "ui"
          };
          bexSend("bridge-forward", {
            command,
            data
          });
        }
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "flex column flex-center q-pa-md justify-between" }, {
        default: withCtx(() => [
          createVNode(QItem, {
            class: "text-h4 header-item",
            style: { "border-radius": "0.5em" }
          }, {
            default: withCtx(() => [
              createTextVNode(" Kalender ")
            ]),
            _: 1
          }),
          createVNode(Calendar),
          createBaseVNode("div", _hoisted_1, [
            createVNode(QBtn, {
              class: "text-weight-regular",
              "icon-right": "sym_r_send",
              label: "Teilen",
              "no-caps": "",
              flat: "",
              onClick: sendToRoll20
            }),
            createVNode(QBtn, {
              class: "text-weight-regular icon-md-filled",
              "icon-right": "sym_r_event_upcoming",
              label: "weiter",
              "no-caps": "",
              flat: "",
              onClick: unref(store).increment
            }, null, 8, ["onClick"])
          ])
        ]),
        _: 1
      });
    };
  }
};
export { _sfc_main as default };
