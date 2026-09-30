import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { places } from "./portfolioData";

const GLOBE_CENTER = [-62, 38];
const GLOBE_ZOOM = 1.35;
const ROTATION_DEGREES_PER_SECOND = 3.6;

const darkRasterStyle = {
  version: 8,
  projection: { type: "globe" },
  sources: {
    cartoDark: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-dark",
      type: "raster",
      source: "cartoDark",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

const lightRasterStyle = {
  version: 8,
  projection: { type: "globe" },
  sources: {
    cartoLight: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-light",
      type: "raster",
      source: "cartoLight",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

function PicturesPage({ isDarkMode = true }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const longitudeRef = useRef(GLOBE_CENTER[0]);
  const initialMapStyleRef = useRef(isDarkMode ? darkRasterStyle : lightRasterStyle);
  const [mapReady, setMapReady] = useState(false);
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
      style: initialMapStyleRef.current,
      center: GLOBE_CENTER,
      zoom: GLOBE_ZOOM,
      minZoom: 1.2,
      maxZoom: 14,
      attributionControl: false,
      renderWorldCopies: false,
    });

    mapRef.current = map;

    const initializeGlobe = () => {
      map.setProjection({ type: "globe" });
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
    };

    map.once("load", initializeGlobe);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.off("load", initializeGlobe);
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!mapReady || !map) {
      return;
    }

    map.once("style.load", () => {
      map.setProjection({ type: "globe" });
    });
    map.setStyle(isDarkMode ? darkRasterStyle : lightRasterStyle);
  }, [isDarkMode, mapReady]);

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
                  <span>Add photo paths to this place in portfolioData.js.</span>
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
