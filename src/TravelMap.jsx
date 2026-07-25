import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import worldData from "world-atlas/countries-110m.json";

const VISITED_COUNTRIES = new Set(["031", "268", "792", "826"]);

const countryId = (geography) =>
  String(geography.id ?? "").padStart(3, "0");

export default function TravelMap() {
  const [tooltip, setTooltip] = useState(null);
  const visitedCount = useMemo(() => VISITED_COUNTRIES.size, []);

  return (
    <section className="travel-map-page" onMouseLeave={() => setTooltip(null)}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 150 }}
        width={800}
        height={600}
        className="travel-map-svg"
        aria-label="Visited countries map"
      >
        <ZoomableGroup
          center={[0, 30]}
          zoom={1.4}
          minZoom={1}
          maxZoom={8}
          translateExtent={[
            [-1000, -500],
            [1000, 500],
          ]}
        >
          <Geographies geography={worldData}>
            {({ geographies }) =>
              geographies.map((geography) => {
                const visited = VISITED_COUNTRIES.has(countryId(geography));
                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill={visited ? "#d4d4d4" : "#2e2e2e"}
                    stroke="#303030"
                    strokeWidth={0.5}
                    onMouseMove={(event) =>
                      setTooltip({
                        name: geography.properties?.name ?? "Country",
                        visited,
                        x: event.clientX,
                        y: event.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: {
                        fill: visited ? "#d4d4d4" : "#626262",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.visited && <span aria-hidden="true" />}
          {tooltip.name}
        </div>
      )}

      <div className="map-stats-wrap">
        <div className="map-stats">
          <div>
            <strong>{visitedCount}</strong>
            <span>Countries</span>
          </div>
          <i aria-hidden="true" />
          <div>
            <strong className="map-total">195</strong>
            <span>Total</span>
          </div>
        </div>
      </div>
    </section>
  );
}
