import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion } from "framer-motion";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { places } from "../components/portfolioData";
import "./PlacesPage.css";

const GLOBE_CENTER = [-62, 38];
const GLOBE_ZOOM = 1.35;
const ROTATION_DEGREES_PER_SECOND = 3.6;
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

function PlacesPage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const longitudeRef = useRef(GLOBE_CENTER[0]);
  const openPlaceRef = useRef(null);
  const galleryOpenRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const selectedPlace = places.find((place) => place.id === selectedId) || null;
  const galleryPhotos = selectedPlace?.photos || [];
  const mapMotion = useReveal(0.2);
  const listMotion = useReveal(0.28);

  galleryOpenRef.current = isGalleryOpen;

  const openPlaceGallery = (place) => {
    const map = mapRef.current;

    setIsRotating(false);
    setSelectedId(place.id);
    setIsGalleryOpen(true);

    map?.flyTo({
      center: [place.lng, place.lat],
      zoom: Math.max(map.getZoom(), 5.7),
      speed: 0.85,
      curve: 1.25,
      essential: false,
    });
  };

  openPlaceRef.current = openPlaceGallery;

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      minZoom: 1.2,
      maxZoom: 14,
      attributionControl: false,
      renderWorldCopies: false,
      canvasContextAttributes: { antialias: true },
    });

    mapRef.current = map;

    const applyGlobeProjection = () => {
      map.setProjection({ type: "globe" });
    };

    const handleMapError = () => {
      if (!map.loaded()) {
        setMapError(true);
      }
    };

    const stopRotation = () => setIsRotating(false);

    const initializeGlobe = () => {
      applyGlobeProjection();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      map.on("dragstart", stopRotation);
      map.on("wheel", stopRotation);

      markersRef.current = places.map((place) => {
        const markerElement = document.createElement("button");
        markerElement.className = "places-marker";
        markerElement.type = "button";
        markerElement.setAttribute("aria-label", `Show ${place.name}`);
        markerElement.innerHTML = "<span></span>";
        markerElement.addEventListener("click", () => {
          openPlaceRef.current?.(place);
        });

        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: "center",
          opacityWhenCovered: 0.08,
          subpixelPositioning: true,
        })
          .setLngLat([place.lng, place.lat])
          .addTo(map);

        return { id: place.id, element: markerElement, marker };
      });

      setMapReady(true);
      setMapError(false);
    };

    map.on("style.load", applyGlobeProjection);
    map.on("error", handleMapError);
    map.once("load", initializeGlobe);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.off("style.load", applyGlobeProjection);
      map.off("error", handleMapError);
      map.off("load", initializeGlobe);
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && galleryOpenRef.current) {
        event.preventDefault();
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mapReady || !map || !isRotating || prefersReducedMotion) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return undefined;
    }

    let lastFrame = performance.now();

    const rotateGlobe = (timestamp) => {
      const elapsedSeconds = (timestamp - lastFrame) / 1000;
      lastFrame = timestamp;
      const currentCenter = map.getCenter();
      longitudeRef.current =
        ((((currentCenter.lng + elapsedSeconds * ROTATION_DEGREES_PER_SECOND) + 180) % 360) + 360) %
          360 -
        180;
      map.setCenter([longitudeRef.current, currentCenter.lat]);
      animationFrameRef.current = requestAnimationFrame(rotateGlobe);
    };

    animationFrameRef.current = requestAnimationFrame(rotateGlobe);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRotating, mapReady]);

  useEffect(() => {
    markersRef.current.forEach(({ id, element }) => {
      element.classList.toggle("is-active", id === selectedId);
    });
  }, [selectedId, mapReady]);

  const resetGlobe = () => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    longitudeRef.current = GLOBE_CENTER[0];
    setSelectedId(null);
    setIsGalleryOpen(false);
    setIsRotating(false);
    map.flyTo({
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      speed: 0.7,
      curve: 1,
      essential: false,
    });
    map.once("moveend", () => {
      longitudeRef.current = map.getCenter().lng;
      setIsRotating(true);
    });
  };

  const toggleRotation = () => {
    setIsRotating((currentValue) => !currentValue);
  };

  return (
    <main className="page places-page">
      <PageIntro
        title="Places"
        lede="Where I have studied, worked and built things, on a globe that keeps turning until you pick a place."
      />

      <div className="page-body places-layout">
        <motion.div className="places-map" {...mapMotion}>
          <div ref={mapContainerRef} className="places-map__canvas" />

          {mapReady && (
            <div className="places-map__toolbar">
              <button className="pill" type="button" onClick={toggleRotation} aria-pressed={!isRotating}>
                {isRotating ? "Pause" : "Rotate"}
              </button>
              <button className="pill" type="button" onClick={resetGlobe}>
                Reset
              </button>
            </div>
          )}

          {!mapReady && !mapError && (
            <div className="places-map__status" role="status">
              <span className="places-map__spinner" aria-hidden="true" />
              Loading the globe
            </div>
          )}

          {mapError && (
            <div className="places-map__status places-map__status--error" role="alert">
              <strong>The globe could not load.</strong>
              <span>Check your connection and refresh the page. The places are still listed here.</span>
            </div>
          )}
        </motion.div>

        <motion.aside className="places-aside" aria-labelledby="places-list-title" {...listMotion}>
          <h2 id="places-list-title" className="visually-hidden">
            All places
          </h2>
          <ul className="places-list">
            {places.map((place) => {
              const isSelected = place.id === selectedId;
              return (
                <li key={place.id}>
                  <button
                    type="button"
                    className={`places-list__item${isSelected ? " is-selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => openPlaceGallery(place)}
                  >
                    <span className="places-list__name">{place.name}</span>
                    <span className="places-list__meta">
                      {place.label}, {place.category.toLowerCase()}
                    </span>
                    {place.note && <span className="places-list__note">{place.note}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {isGalleryOpen && selectedPlace && (
            <section className="places-gallery" aria-labelledby="places-gallery-title">
              <div className="places-gallery__header">
                <div>
                  <h3 id="places-gallery-title">{selectedPlace.name}</h3>
                  <p className="meta">
                    {selectedPlace.label}, {selectedPlace.category.toLowerCase()}
                  </p>
                </div>
                <button className="pill" type="button" onClick={closeGallery}>
                  Close
                </button>
              </div>

              {galleryPhotos.length > 0 ? (
                <div className="places-gallery__grid">
                  {galleryPhotos.map((photo, index) => (
                    <figure className="places-gallery__photo" key={`${selectedPlace.id}-${photo}`}>
                      <img src={photo} alt={`${selectedPlace.name} visit ${index + 1}`} loading="lazy" />
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="places-gallery__empty">Photos from this chapter are coming soon.</p>
              )}
            </section>
          )}
        </motion.aside>
      </div>
    </main>
  );
}

export default PlacesPage;
