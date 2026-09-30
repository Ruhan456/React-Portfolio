import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "./portfolioData";

const GLOBE_CENTER = [-62, 38];
const GLOBE_ZOOM = 1.35;
const ROTATION_DEGREES_PER_SECOND = 3.6;
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

function PicturesPage({ isDarkMode = true }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const longitudeRef = useRef(GLOBE_CENTER[0]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const selectedPlace = places.find((place) => place.id === selectedId) || places[0];
  const galleryPhotos = selectedPlace?.photos || [];

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

    const initializeGlobe = () => {
      applyGlobeProjection();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
      map.on("dragstart", () => setIsRotating(false));
      map.on("wheel", () => setIsRotating(false));

      markersRef.current = places.map((place) => {
        const markerElement = document.createElement("button");
        markerElement.className = "placemark-marker";
        markerElement.type = "button";
        markerElement.setAttribute("aria-label", `Show ${place.name}`);
        markerElement.innerHTML = "<span></span>";
        markerElement.addEventListener("click", () => {
          openPlaceGallery(place);
        });

        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: "bottom",
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
      if (event.key === "Escape") {
        closeGallery();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
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
      element.classList.toggle("active", id === selectedId);
    });
  }, [selectedId]);

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
    <section className="pictures-page">
      <div className="pictures-intro">
        <p className="eyebrow">Global Gallery</p>
        <h1>Places that shaped the work.</h1>
        <p>
          A rotating globe for the places I have studied, worked, built things, and collected
          the photos that make this portfolio feel more like mine.
        </p>
      </div>

      <div className="pictures-layout">
        <div className={`maplibre-card ${isDarkMode ? "dark-globe" : "light-globe"}`}>
          <div className="globe-toolbar">
            <button type="button" onClick={toggleRotation}>
              {isRotating ? "Pause" : "Rotate"}
            </button>
            <button type="button" onClick={resetGlobe}>
              Reset
            </button>
          </div>
          <div ref={mapContainerRef} className="maplibre-map" />

          {!mapReady && !mapError && (
            <div className="map-status" role="status">
              <span className="map-status-spinner" aria-hidden="true" />
              Loading the globe
            </div>
          )}

          {mapError && (
            <div className="map-status map-status-error" role="alert">
              <strong>The globe could not load.</strong>
              <span>Check your connection and refresh the page.</span>
            </div>
          )}

          {mapReady && (
            <div className="place-dock" aria-label="Featured places">
              <span>Jump to</span>
              <div>
                {places.map((place) => (
                  <button
                    aria-label={`Open ${place.name}, ${place.category}`}
                    className={selectedId === place.id ? "active" : ""}
                    key={place.id}
                    onClick={() => openPlaceGallery(place)}
                    type="button"
                  >
                    <small>{place.category}</small>
                    {place.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isGalleryOpen && selectedPlace && (
            <section className="place-gallery" aria-label={`${selectedPlace.name} photos`}>
              <div className="place-gallery-header">
                <div>
                  <p className="eyebrow">{selectedPlace.category}</p>
                  <h2>{selectedPlace.name}</h2>
                  <strong>{selectedPlace.label}</strong>
                </div>
                <button type="button" onClick={closeGallery}>
                  Close
                </button>
              </div>

              {galleryPhotos.length > 0 ? (
                <div className="place-gallery-grid">
                  {galleryPhotos.map((photo, index) => (
                    <figure className="place-gallery-photo" key={`${selectedPlace.id}-${photo}`}>
                      <img src={photo} alt={`${selectedPlace.name} visit ${index + 1}`} />
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="photo-placeholder gallery-empty">
                  <strong>{selectedPlace.name}</strong>
                  <span>Photos from this chapter are coming soon.</span>
                </div>
              )}

              {selectedPlace.note && <p className="place-gallery-note">{selectedPlace.note}</p>}
            </section>
            )}
        </div>
      </div>
    </section>
  );
}

export default PicturesPage;
