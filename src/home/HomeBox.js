import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { homeCards } from "../data/homeCards";
import { profile } from "../components/portfolioData";
import { ArrowIcon, CardIcon } from "./homeIcons";
import "./HomeBox.css";

// Box geometry in world pixels. x runs along the long side, y from back (0) to front (D), z up.
const W = 800;
const D = 300;
const H = 122;
const T = 14;
const CARD_W = 214;
const CARD_H = 318;
const CARD_Y = (D - CARD_W) / 2;
const CARD_INSET = 84;
const CARD_STEP = (W - 2 * CARD_INSET) / (homeCards.length - 1);
const LID_ANGLE = 100;

// Cards are extruded slabs: a stack of rim outlines between the glass face and a tinted back plate.
const CARD_DEPTH = 7;
const CARD_RADIUS = 12;
const rimLayers = Array.from({ length: CARD_DEPTH - 1 }, (_, i) => i + 1);
const edgeTop = `translate3d(${CARD_RADIUS}px, 0px, ${-CARD_DEPTH}px) rotateX(90deg)`;
const edgeSide = `translate3d(0px, ${CARD_RADIUS}px, ${-CARD_DEPTH}px) rotateY(-90deg)`;

// The glossy floor has to cover everything the mirrored scene projects onto, which reaches far toward the viewer.
const GLOSS_X = -900;
const GLOSS_Y = -700;
const GLOSS_W = W + 1900;
const GLOSS_D = D + 1800;
const mirrorFaceKeys = new Set(["floor", "out-back", "out-left", "out-right"]);

const CAMERA_X = 57;
const CAMERA_Z = 29;
// Degrees the camera swings toward the pointer at the viewport edge. Past ~9 the open box shows its seams.
const DRIFT = 7;

// Size of the projected scene (box plus open lid) at scale 1, used to fit the viewport.
const SCENE_W = 960;
const SCENE_H = 840;
// The open lid pushes the projection right of the box centre; shift back so the scene is centred.
const SCENE_SHIFT_X = -36;

const MOBILE_QUERY = "(max-width: 639px)";

const pad = (n) => String(n + 1).padStart(2, "0");

const flat = (x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`;
const facingFront = (x, y, h) => `translate3d(${x}px, ${y}px, ${h}px) rotateX(-90deg)`;
const facingBack = (x, y, w, h) =>
  `translate3d(${x + w}px, ${y}px, ${h}px) rotateZ(180deg) rotateX(-90deg)`;
const facingRight = (x, y, w, h) =>
  `translate3d(${x}px, ${y + w}px, ${h}px) rotateZ(-90deg) rotateX(-90deg)`;
const facingLeft = (x, y, h) => `translate3d(${x}px, ${y}px, ${h}px) rotateZ(90deg) rotateX(-90deg)`;

const boxFaces = [
  { key: "floor", tone: "floor", w: W - 2 * T, h: D - 2 * T, t: flat(T, T, 0) },
  { key: "in-back", tone: "inner-lit", w: W - 2 * T, h: H, t: facingFront(T, T, H) },
  { key: "in-front", tone: "inner-dark", w: W - 2 * T, h: H, t: facingBack(T, D - T, W - 2 * T, H) },
  { key: "in-left", tone: "inner-mid", w: D - 2 * T, h: H, t: facingRight(T, T, D - 2 * T, H) },
  { key: "in-right", tone: "inner-dark", w: D - 2 * T, h: H, t: facingLeft(W - T, T, H) },
  { key: "out-back", tone: "side", w: W, h: H, t: facingBack(0, 0, W, H) },
  { key: "out-left", tone: "side", w: D, h: H, t: facingLeft(0, 0, H) },
  { key: "out-right", tone: "side", w: D, h: H, t: facingRight(W, 0, D, H) },
  { key: "rim-front", tone: "rim", w: W, h: T, t: flat(0, D - T, H) },
  { key: "rim-back", tone: "rim", w: W, h: T, t: flat(0, 0, H) },
  { key: "rim-left", tone: "rim", w: T, h: D - 2 * T, t: flat(0, T, H) },
  { key: "rim-right", tone: "rim", w: T, h: D - 2 * T, t: flat(W - T, T, H) },
];

const lidFaces = [
  { key: "lid-inner", tone: "lid-inner", w: W, h: D, t: `translate3d(0px, ${D}px, 0px) rotateX(180deg)` },
  { key: "lid-outer", tone: "lid-outer", w: W, h: D, t: flat(0, 0, T) },
  { key: "lid-edge", tone: "rim", w: W, h: T, t: facingFront(0, D, T) },
  { key: "lid-left", tone: "side", w: D, h: T, t: facingLeft(0, 0, T) },
  { key: "lid-right", tone: "side", w: D, h: T, t: facingRight(W, 0, D, T) },
];

const cardX = (index) => CARD_INSET + index * CARD_STEP;
const cardTransform = (index) => facingRight(cardX(index), CARD_Y, CARD_W, CARD_H);

const size = (w, h) => ({ width: `${w}px`, height: `${h}px` });

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function useFitScale(ref) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / SCENE_W, height / SCENE_H, 1.3));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
}

function moveFocus(event, index, refs) {
  const last = homeCards.length - 1;
  const targets = {
    ArrowRight: Math.min(index + 1, last),
    ArrowDown: Math.min(index + 1, last),
    ArrowLeft: Math.max(index - 1, 0),
    ArrowUp: Math.max(index - 1, 0),
    Home: 0,
    End: last,
  };
  if (!(event.key in targets)) return;
  event.preventDefault();
  refs.current[targets[event.key]]?.focus();
}

function Intro() {
  return (
    <div className="hb-intro">
      <h1 className="hb-intro__name">{profile.name}</h1>
      <p className="hb-intro__role">{profile.role}</p>
    </div>
  );
}

function Caption({ card, index }) {
  return (
    <div className="hb-caption" data-card={card?.id}>
      {card ? (
        <>
          <p className="hb-caption__line">
            <span className="hb-caption__num">{pad(index)}</span>
            <span>{card.title}</span>
            <ArrowIcon className="hb-caption__arrow" />
          </p>
          <p className="hb-caption__blurb">{card.blurb}</p>
        </>
      ) : (
        <>
          <p className="hb-caption__line hb-caption__line--idle">Seven cards in the case</p>
          <p className="hb-caption__blurb">Point at one to lift it out, or tab through with the arrow keys.</p>
        </>
      )}
    </div>
  );
}

function CardSlab({ children }) {
  return (
    <span className="hb-card__body">
      <span className="hb-card__back" style={{ transform: `translateZ(${-CARD_DEPTH}px)` }} />
      {rimLayers.map((depth) => (
        <span key={depth} className="hb-card__ring" style={{ transform: `translateZ(${-depth}px)` }} />
      ))}
      <span
        className="hb-card__edge hb-card__edge--top"
        style={{ ...size(CARD_W - 2 * CARD_RADIUS, CARD_DEPTH), transform: edgeTop }}
      />
      <span
        className="hb-card__edge hb-card__edge--side"
        style={{ ...size(CARD_DEPTH, CARD_H - 2 * CARD_RADIUS), transform: edgeSide }}
      />
      <span className="hb-card__face">{children}</span>
    </span>
  );
}

function CardContent({ card, index }) {
  return (
    <>
      <span className="hb-card__top">
        <span className="hb-card__num">{pad(index)}</span>
        <CardIcon id={card.id} className="hb-card__icon" />
      </span>
      <span className="hb-card__title">{card.title}</span>
      <span className="hb-card__blurb">{card.blurb}</span>
      <span className="hb-card__foot">
        {card.image ? (
          <img className="hb-card__image" src={card.image} alt="" loading="lazy" draggable="false" />
        ) : (
          <CardIcon id={card.id} className="hb-card__mark" />
        )}
      </span>
    </>
  );
}

function Particles() {
  return (
    <div className="hb-particles" aria-hidden="true">
      {particleSeeds.map(([x, y, s, d], i) => (
        <span
          key={i}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${s}px`,
            height: `${s}px`,
            animationDelay: `${-d}s`,
            animationDuration: `${14 + (i % 5) * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

const particleSeeds = [
  [6, 18, 2, 1], [14, 72, 1.5, 6], [22, 34, 2, 3], [31, 88, 1.5, 9], [38, 12, 1, 4],
  [47, 64, 1.5, 11], [55, 22, 2, 7], [63, 90, 1, 2], [71, 40, 1.5, 12], [79, 14, 2, 5],
  [86, 70, 1.5, 8], [93, 30, 1, 10], [9, 48, 1, 13], [66, 8, 1.5, 3], [97, 86, 2, 6],
  [27, 56, 1, 14],
];

function BoxScene({ activeIndex, setActiveIndex, cardRefs, onOpen }) {
  const stageRef = useRef(null);
  const scale = useFitScale(stageRef);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 16, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 16, mass: 0.7 });
  const rotateX = useTransform(springY, (v) => CAMERA_X - v * DRIFT);
  const rotateZ = useTransform(springX, (v) => CAMERA_Z - v * DRIFT);
  const worldTransform = useMotionTemplate`rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;

  useEffect(() => {
    if (reduceMotion) {
      pointerX.set(0);
      pointerY.set(0);
      return undefined;
    }
    const handleMove = (event) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [reduceMotion, pointerX, pointerY]);

  return (
    <div className="hb-stage" ref={stageRef}>
      <div className="hb-scaler" style={{ transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}>
        <div className="hb-camera">
          <motion.div
            className={`hb-world${activeIndex !== null ? " has-active" : ""}`}
            style={{ ...size(W, D), marginLeft: `${-W / 2 + SCENE_SHIFT_X}px`, marginTop: `${-D / 2}px`, transform: worldTransform }}
          >
            <span className="hb-gloss" style={{ ...size(GLOSS_W, GLOSS_D), transform: flat(GLOSS_X, GLOSS_Y, -2) }} />
            <span className="hb-shadow" style={{ ...size(W + 160, D + 160), transform: flat(-80, -40, -1) }} />

            <span className="hb-mirror" aria-hidden="true">
              {boxFaces
                .filter((face) => mirrorFaceKeys.has(face.key))
                .map((face) => (
                  <span
                    key={face.key}
                    className={`hb-face hb-face--${face.tone} hb-face--${face.key}`}
                    style={{ ...size(face.w, face.h), transform: face.t }}
                  />
                ))}
              <span className="hb-face hb-face--front" style={{ ...size(W, H), transform: facingFront(0, D, H) }} />
              {homeCards.map((card, index) => (
                <span
                  key={card.id}
                  data-card={card.id}
                  className={`hb-card hb-card--ghost${activeIndex === index ? " is-active" : ""}`}
                  style={{ ...size(CARD_W, CARD_H), transform: cardTransform(index) }}
                >
                  <CardSlab />
                </span>
              ))}
            </span>

            {boxFaces.map((face) => (
              <span
                key={face.key}
                className={`hb-face hb-face--${face.tone} hb-face--${face.key}`}
                style={{ ...size(face.w, face.h), transform: face.t }}
              />
            ))}

            <span
              className="hb-face hb-face--front"
              style={{ ...size(W, H), transform: facingFront(0, D, H) }}
            >
              <span className="hb-print">
                <strong>{profile.name}</strong>
                <span className="hb-print__slash">/</span>
                <span>Mechatronics Engineering</span>
              </span>
            </span>

            <span className="hb-lid" style={{ transform: `translate3d(0px, 0px, ${H}px) rotateX(${LID_ANGLE}deg)` }}>
              {lidFaces.map((face) => (
                <span
                  key={face.key}
                  className={`hb-face hb-face--${face.tone} hb-face--${face.key}`}
                  style={{ ...size(face.w, face.h), transform: face.t }}
                />
              ))}
            </span>

            {homeCards.map((card, index) => {
              const isActive = activeIndex === index;
              return (
                <React.Fragment key={card.id}>
                  <span
                    data-card={card.id}
                    className={`hb-spill${isActive ? " is-active" : ""}`}
                    style={{ ...size(220, D - 2 * T), transform: flat(cardX(index) - 30, T, 1) }}
                  />
                  <button
                    type="button"
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    data-card={card.id}
                    className={`hb-card${isActive ? " is-active" : ""}`}
                    style={{ ...size(CARD_W, CARD_H), transform: cardTransform(index) }}
                    aria-label={`Open ${card.title}`}
                    onPointerEnter={() => setActiveIndex(index)}
                    onPointerLeave={() => setActiveIndex((current) => (current === index ? null : current))}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex((current) => (current === index ? null : current))}
                    onKeyDown={(event) => moveFocus(event, index, cardRefs)}
                    onClick={() => onOpen(card)}
                  >
                    <CardSlab>
                      <CardContent card={card} index={index} />
                    </CardSlab>
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DrawerList({ cardRefs, onOpen }) {
  return (
    <div className="hb-drawer">
      <ol className="hb-drawer__cards">
        {homeCards.map((card, index) => (
          <li key={card.id} style={{ "--i": index }}>
            <button
              type="button"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              data-card={card.id}
              className="hb-tab"
              aria-label={`Open ${card.title}`}
              onKeyDown={(event) => moveFocus(event, index, cardRefs)}
              onClick={() => onOpen(card)}
            >
              <span className="hb-tab__num">{pad(index)}</span>
              <span className="hb-tab__text">
                <span className="hb-tab__title">{card.title}</span>
                <span className="hb-tab__blurb">{card.blurb}</span>
              </span>
              <CardIcon id={card.id} className="hb-tab__icon" />
            </button>
          </li>
        ))}
      </ol>
      <div className="hb-drawer__front" aria-hidden="true">
        <strong>{profile.name}</strong>
        <span className="hb-print__slash">/</span>
        <span>Mechatronics Engineering</span>
      </div>
    </div>
  );
}

function HomeBox() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [activeIndex, setActiveIndex] = useState(null);
  const cardRefs = useRef([]);

  const openCard = useCallback((card) => navigate(card.to), [navigate]);

  return (
    <main className={`hb${isMobile ? " hb--mobile" : ""}`}>
      <Particles />
      <Intro />
      {isMobile ? (
        <DrawerList cardRefs={cardRefs} onOpen={openCard} />
      ) : (
        <>
          <BoxScene
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            cardRefs={cardRefs}
            onOpen={openCard}
          />
          <Caption card={activeIndex !== null ? homeCards[activeIndex] : null} index={activeIndex} />
        </>
      )}
    </main>
  );
}

export default HomeBox;
