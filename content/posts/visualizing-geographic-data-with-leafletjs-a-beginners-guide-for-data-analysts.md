---
title: "Visualizing Geographic Data With Leaflet.js: A Beginner's Guide for Data Analysts"
date: "2026-10-13"
tags: ["web-development", "data-visualization", "beginner"]
excerpt: "How to drop an interactive, zoomable map of your location data into a React page with Leaflet.js, without a paid mapping API key."
---

A bar chart of sales by city tells you the ranking. A map tells you the pattern — whether your strongest markets cluster along a coastline, a highway corridor, or a border — and that's a different kind of insight a table of numbers can't surface on its own. Leaflet.js is the go-to library for this because it's free, doesn't require an API key for basic use, and is small enough to drop into an existing React page without much setup.

**1. Install Leaflet and its React wrapper.**
```bash
npm install leaflet react-leaflet
```
`react-leaflet` gives you React components (`MapContainer`, `TileLayer`, `Marker`) instead of Leaflet's native imperative API, which fits much more naturally into a component-based codebase.

**2. Import the CSS — this is the step people forget.** Leaflet ships its own stylesheet for map tiles, markers, and zoom controls, and without it the map renders as a blank gray box with scattered icons. Add this once near the top of your component file or in your main entry point:
```javascript
import "leaflet/dist/leaflet.css";
```

**3. Render a basic map with a free tile layer.** OpenStreetMap's tile server is free to use for low-to-moderate traffic without registering for a key, which makes it the right default for a personal portfolio or blog:
```jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function SalesMap({ locations }) {
  return (
    <MapContainer center={[39.8, -98.6]} zoom={4} style={{ height: "400px" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.city}: ${loc.revenue.toLocaleString()}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```
The `center` and `zoom` props set the initial view; `style` needs an explicit height, since Leaflet's container collapses to zero height without one.

**4. Scale marker size or color to a value instead of using uniform pins.** A map of fifty identical pins answers "where" but not "how much" — use `CircleMarker` instead of `Marker` and size the radius by revenue, so the map reads at a glance the same way a bubble chart would:
```jsx
import { CircleMarker } from "react-leaflet";

<CircleMarker
  center={[loc.lat, loc.lng]}
  radius={Math.sqrt(loc.revenue) / 20}
  pathOptions={{ color: "#2563eb", fillOpacity: 0.6 }}
>
  <Popup>{loc.city}: ${loc.revenue.toLocaleString()}</Popup>
</CircleMarker>
```

**5. Keep the data separate from the map component.** Store your location data (lat, lng, and whatever metric you're plotting) as a plain JSON file or a CSV parsed at build time, the same way you'd handle any other dataset in a static blog — not hardcoded inline in the component. That keeps the map reusable across posts and means updating the numbers never requires touching the rendering code.

One caveat worth flagging to anyone using this for client work: OpenStreetMap's free tile server has a usage policy that prohibits heavy production traffic, so a personal site or portfolio is fine, but a high-traffic commercial dashboard should move to a paid tile provider (Mapbox, Maptiler) before launch.
