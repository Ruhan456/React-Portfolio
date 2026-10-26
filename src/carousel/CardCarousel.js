import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp, perspectiveFor, placeCard } from "./carouselMotion";
import "./CardCarousel.css";

const STIFFNESS = 140;
const DAMPING = 24;
const WHEEL_STEP = 260;
const WHEEL_SETTLE_MS = 140;
const DRAG_THRESHOLD = 6;
const EDGE_RESISTANCE = 0.35;

const pad = (value) => String(value).padStart(2, "0");

function normaliseWheel(event, pageHeight) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageHeight : 1;
  const dx = event.deltaX * unit;
  const dy = event.deltaY * unit;
  return Math.abs(dx) > Math.abs(dy) ? dx : dy;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function CardCarousel({
  items,
  renderCard,
  onOpen,
  onActiveChange,
  label = "Items",
  initialIndex = 0,
  getKey = (item, index) => item.id ?? index,
  getItemLabel = (item) => item.title ?? "",
  getTint,
  getTailImage,
  openLabel = "Open",
  className = "",
}) {
  const count = items.length;
  const last = Math.max(0, count - 1);
  const startIndex = clamp(Math.round(initialIndex) || 0, 0, last);

  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [hintVisible, setHintVisible] = useState(false);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const tailRefs = useRef([]);
  const progressRef = useRef(null);
  const motion = useRef({ position: startIndex, target: startIndex, velocity: 0 });
  const layoutRef = useRef({ stageWidth: 1, cardWidth: 1 });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const wheelTimerRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const activeRef = useRef(startIndex);
  const focusFollowRef = useRef(false);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  const callbacksRef = useRef({ onActiveChange });
  callbacksRef.current = { onActiveChange };

  const paint = useCallback(() => {
    const { position } = motion.current;
    const layout = layoutRef.current;

    cardRefs.current.forEach((node, index) => {
      if (!node) return;
      const place = placeCard(index - position, layout);
      node.style.transform = place.transform;
      node.style.opacity = place.opacity.toFixed(3);
      node.style.zIndex = String(place.zIndex);
      node.style.visibility = place.visible ? "visible" : "hidden";
      const [startTail, endTail, shade] = tailRefs.current[index] || [];
      if (startTail) startTail.style.opacity = place.side < 0 ? place.tail.toFixed(3) : "0";
      if (endTail) endTail.style.opacity = place.side > 0 ? place.tail.toFixed(3) : "0";
      if (shade) shade.style.opacity = place.shade.toFixed(3);
    });

    if (progressRef.current) {
      const progress = last === 0 ? 1 : clamp(position / last, 0, 1);
      progressRef.current.style.transform = `scaleX(${(0.08 + progress * 0.92).toFixed(4)})`;
    }

    const nextActive = clamp(Math.round(position), 0, last);
    if (nextActive !== activeRef.current) {
      activeRef.current = nextActive;
      setActiveIndex(nextActive);
    }
  }, [last]);

  const step = useCallback(
    (time) => {
      const state = motion.current;
      const dt = Math.min(0.064, (time - (lastTimeRef.current || time)) / 1000) || 1 / 60;
      lastTimeRef.current = time;

      if (!dragRef.current?.active) {
        const force = (state.target - state.position) * STIFFNESS - state.velocity * DAMPING;
        state.velocity += force * dt;
        state.position += state.velocity * dt;

        if (Math.abs(state.target - state.position) < 0.0005 && Math.abs(state.velocity) < 0.002) {
          state.position = state.target;
          state.velocity = 0;
        }
      }

      paint();

      const settled = state.position === state.target && state.velocity === 0 && !dragRef.current?.active;
      if (settled) {
        frameRef.current = 0;
        lastTimeRef.current = 0;
      } else {
        frameRef.current = requestAnimationFrame(step);
      }
    },
    [paint]
  );

  const kick = useCallback(() => {
    if (reducedRef.current && !dragRef.current?.active) {
      motion.current.position = motion.current.target;
      motion.current.velocity = 0;
      paint();
      return;
    }
    if (!frameRef.current) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(step);
    }
  }, [paint, step]);

  const goTo = useCallback(
    (index, { focus = false } = {}) => {
      const target = clamp(Math.round(index), 0, last);
      motion.current.target = target;
      focusFollowRef.current = focus;
      setHintVisible(false);
      kick();
    },
    [kick, last]
  );

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const measure = () => {
      const card = cardRefs.current.find(Boolean);
      layoutRef.current = {
        stageWidth: stage.clientWidth || 1,
        cardWidth: card?.offsetWidth || 1,
      };
      stage.style.perspective = `${Math.round(perspectiveFor(layoutRef.current.stageWidth))}px`;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [paint, count]);

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    clearTimeout(wheelTimerRef.current);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || count < 2) return undefined;
    setHintVisible(true);
    const timer = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    const item = items[activeIndex];
    if (item) callbacksRef.current.onActiveChange?.(item, activeIndex);

    const focus = document.activeElement;
    if (focusFollowRef.current || focus?.classList.contains("card-carousel__card")) {
      const node = cardRefs.current[activeIndex];
      if (node && node !== focus && stageRef.current?.contains(focus)) {
        node.focus({ preventScroll: true });
      }
    }
  }, [activeIndex, items]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const onWheel = (event) => {
      if (event.ctrlKey) return;
      const delta = normaliseWheel(event, stage.clientHeight);
      if (!delta) return;
      event.preventDefault();
      setHintVisible(false);

      const state = motion.current;
      clearTimeout(wheelTimerRef.current);

      if (reducedRef.current) {
        wheelAccumRef.current += delta;
        if (Math.abs(wheelAccumRef.current) >= WHEEL_STEP * 0.5) {
          const direction = Math.sign(wheelAccumRef.current);
          wheelAccumRef.current = 0;
          goTo(Math.round(state.target) + direction);
        }
        wheelTimerRef.current = setTimeout(() => {
          wheelAccumRef.current = 0;
        }, WHEEL_SETTLE_MS);
        return;
      }

      let next = state.target + delta / WHEEL_STEP;
      if (next < 0 || next > last) {
        const overshoot = next < 0 ? next : next - last;
        next = (next < 0 ? 0 : last) + clamp(overshoot, -0.35, 0.35) * EDGE_RESISTANCE;
      }
      state.target = next;
      kick();

      wheelTimerRef.current = setTimeout(() => {
        state.target = clamp(Math.round(state.target), 0, last);
        kick();
      }, WHEEL_SETTLE_MS);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [goTo, kick, last]);

  const onPointerDown = (event) => {
    if (event.button !== 0 || count < 2) return;
    const state = motion.current;
    dragRef.current = {
      active: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: state.position,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    suppressClickRef.current = false;
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    if (!drag.active) {
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      drag.active = true;
      suppressClickRef.current = true;
      setHintVisible(false);
      stageRef.current?.setPointerCapture?.(event.pointerId);
      kick();
    }

    const perCard = Math.max(160, layoutRef.current.cardWidth * 0.9);
    let next = drag.startPosition - dx / perCard;
    if (next < 0) next *= EDGE_RESISTANCE;
    if (next > last) next = last + (next - last) * EDGE_RESISTANCE;

    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastTime);
    const instant = -((event.clientX - drag.lastX) / perCard) / (elapsed / 1000);
    drag.velocity = drag.velocity * 0.7 + instant * 0.3;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    motion.current.position = next;
    motion.current.target = next;
    motion.current.velocity = 0;
    if (reducedRef.current) paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.active) return;

    const idle = performance.now() - drag.lastTime > 90;
    const velocity = idle ? 0 : clamp(drag.velocity, -14, 14);
    const projected = motion.current.position + clamp(velocity * 0.14, -0.62, 0.62);
    motion.current.velocity = reducedRef.current ? 0 : velocity;
    goTo(projected);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
      const region = stageRef.current?.parentElement;
      const focus = document.activeElement;
      const pageLevel = !focus || focus === document.body;
      if (!pageLevel && !region?.contains(focus)) return;

      const keys = {
        ArrowRight: activeRef.current + 1,
        ArrowLeft: activeRef.current - 1,
        Home: 0,
        End: last,
      };
      if (!(event.key in keys)) return;
      event.preventDefault();
      goTo(keys[event.key], { focus: !pageLevel });
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [goTo, last]);

  const onCardClick = (index) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (index === activeRef.current && Math.abs(motion.current.position - index) < 0.5) {
      onOpen?.(items[index], index);
    } else {
      goTo(index, { focus: true });
    }
  };

  useEffect(() => {
    if (motion.current.target > last) {
      motion.current.target = last;
      kick();
    }
  }, [kick, last]);

  const activeItem = items[activeIndex];

  return (
    <div
      className={`card-carousel ${className}`.trim()}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        className="card-carousel__stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((item, index) => {
          const active = index === activeIndex;
          const tint = getTint?.(item, index);
          const tailImage = getTailImage?.(item, index);
          const tailStyle = tailImage ? { "--tail-image": `url("${tailImage}")` } : undefined;
          return (
            <button
              key={getKey(item, index)}
              type="button"
              className={`card-carousel__card${active ? " is-active" : ""}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              style={tint ? { "--card-tint": tint } : undefined}
              tabIndex={active ? 0 : -1}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${getItemLabel(item)}${active && onOpen ? `. ${openLabel}` : ""}`}
              aria-current={active ? "true" : undefined}
              onClick={() => onCardClick(index)}
              onDragStart={(event) => event.preventDefault()}
            >
              <span
                className="card-carousel__tail card-carousel__tail--start"
                style={tailStyle}
                aria-hidden="true"
                ref={(node) => {
                  tailRefs.current[index] = tailRefs.current[index] || [];
                  tailRefs.current[index][0] = node;
                }}
              />
              <span
                className="card-carousel__tail card-carousel__tail--end"
                style={tailStyle}
                aria-hidden="true"
                ref={(node) => {
                  tailRefs.current[index] = tailRefs.current[index] || [];
                  tailRefs.current[index][1] = node;
                }}
              />
              <span className="card-carousel__face">{renderCard(item, { active, index })}</span>
              <span
                className="card-carousel__shade"
                aria-hidden="true"
                ref={(node) => {
                  tailRefs.current[index] = tailRefs.current[index] || [];
                  tailRefs.current[index][2] = node;
                }}
              />
            </button>
          );
        })}

        <p className={`card-carousel__hint${hintVisible ? " is-visible" : ""}`} aria-hidden="true">
          Scroll or drag
        </p>
      </div>

      <div className="card-carousel__chrome">
        <button
          type="button"
          className="card-carousel__nav"
          onClick={() => goTo(activeRef.current - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
        </button>

        <div className="card-carousel__counter" aria-hidden="true">
          <span className="card-carousel__count">
            <span className="card-carousel__count-current">{pad(activeIndex + 1)}</span>
            <span className="card-carousel__count-total"> / {pad(count)}</span>
          </span>
          <span className="card-carousel__track">
            <span className="card-carousel__progress" ref={progressRef} />
          </span>
        </div>

        <button
          type="button"
          className="card-carousel__nav"
          onClick={() => goTo(activeRef.current + 1)}
          disabled={activeIndex === last}
          aria-label="Next"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m6 3 5 5-5 5" />
          </svg>
        </button>
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {activeItem ? `${activeIndex + 1} of ${count}: ${getItemLabel(activeItem)}` : ""}
      </p>
    </div>
  );
}

export default CardCarousel;
