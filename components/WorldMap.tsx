
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { geoOrthographic, geoPath, geoGraticule, geoDistance, geoCircle } from 'd3-geo';
import * as topojson from 'topojson-client';
import Papa from 'papaparse';
import { Signal, NodeStatus, Source, RawEvent, ThreatNode, SignalAnalysis } from '../types';
import { Info, Zap, ArrowRight, Activity, Clock, Target, Shield, Skull, Radio, Lock, AlertCircle, Triangle, Crosshair, EyeOff, MapPin, ShieldCheck, History, TrendingUp } from 'lucide-react';
import { SOURCES_REGISTRY } from '../constants';

interface WorldMapProps {
  signals: Signal[];
  threatNodes: ThreatNode[];
  rawEvents: RawEvent[];
  selectedItem: Signal | ThreatNode | null;
  onSelectItem: (item: Signal | ThreatNode | null) => void;
  onOpenHistory?: (item: Signal | ThreatNode) => void;
}

interface CityLight {
  lat: number;
  lng: number;
  latRad: number;
  lngRad: number;
  sinLat: number;
  cosLat: number;
  size: number;
  opacity: number;
}

const PostureMarker = memo(({ status, x, y, isSelected, isHovered, onClick, onMouseEnter, onMouseLeave }: any) => {
  const getStatusColor = (s: NodeStatus) => {
    switch (s) {
      case 'red': return 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]';
      case 'yellow': return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]';
      case 'white': return 'bg-white shadow-[0_0_20px_rgba(255,255,255,1)]';
      case 'green': return 'bg-[#c3d333] shadow-[0_0_20px_rgba(195,211,51,1)]';
      default: return 'bg-white';
    }
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 z-10
        ${isSelected ? 'z-50 scale-150' : isHovered ? 'z-40 scale-125' : 'scale-100'}`}
      style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`marker-ripple border rounded-full ${status === 'red' ? 'border-red-500/50' : status === 'white' ? 'border-white/30' : 'border-[#c3d333]/50'}`} />
      <div className={`transition-all duration-300 w-3 h-3 rounded-full border border-black ${getStatusColor(status)} ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#05080c]' : ''}`} />
    </div>
  );
});

const getSolarPosition = (date: Date) => {
  const now = date;
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const fractionalYear = (2 * Math.PI / 365) * (dayOfYear - 1 + (now.getHours() - 12) / 24);
  
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(fractionalYear) -
    0.032077 * Math.sin(fractionalYear) -
    0.014615 * Math.cos(2 * fractionalYear) -
    0.040849 * Math.sin(2 * fractionalYear)
  );
  
  const decl = 0.006918 -
    0.399912 * Math.cos(fractionalYear) +
    0.070257 * Math.sin(fractionalYear) -
    0.006758 * Math.cos(2 * fractionalYear) +
    0.000907 * Math.sin(2 * fractionalYear) -
    0.002697 * Math.cos(3 * fractionalYear) +
    0.00148 * Math.sin(3 * fractionalYear);
    
  const lat = decl * (180 / Math.PI);
  const timeOffset = eqtime;
  const trueSolarTime = now.getUTCHours() * 60 + now.getUTCMinutes() + now.getUTCSeconds() / 60 + timeOffset;
  let lng = -((trueSolarTime / 4) - 180);
  if (lng < -180) lng += 360;
  if (lng > 180) lng -= 360;
  
  return { lat, lng };
};

const CanvasGlobe = ({ width, height, signals, threatNodes, selectedItem, onSelectItem, hoveredId, setHoveredId }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [cities, setCities] = useState<CityLight[]>([]);
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const animationRef = useRef<number>(0);
  
  // Interaction Refs
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const userInteracting = useRef(false);
  const interactionTimeout = useRef<any>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef({ current: 1, target: 1 });

  useEffect(() => {
    // Generate reusable glow particle for city lights to ensure 60fps performance
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 32;
    glowCanvas.height = 32;
    const gCtx = glowCanvas.getContext('2d');
    if (gCtx) {
      const grad = gCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');      // White hot core
      grad.addColorStop(0.1, 'rgba(255, 240, 150, 0.9)');  // Intense yellow
      grad.addColorStop(0.4, 'rgba(255, 200, 100, 0.4)');  // Warm orange spread
      grad.addColorStop(1, 'rgba(255, 200, 100, 0)');      // Fade out
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 32, 32);
    }
    glowCanvasRef.current = glowCanvas;

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        setWorldData(topojson.feature(data, data.objects.countries));
      });

    // Fetch world cities for realistic night lights
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson')
      .then(res => res.json())
      .then(data => {
        const parsedCities: CityLight[] = [];
        
        const addCity = (lat: number, lng: number, pop: number, isSuburb: boolean = false) => {
          const latRad = lat * Math.PI / 180;
          const lngRad = lng * Math.PI / 180;
          
          let size = 1.0;
          let opacity = 0.3;
          
          if (pop > 15000000) { size = 12; opacity = 1.0; }
          else if (pop > 5000000) { size = 8; opacity = 0.9; }
          else if (pop > 1000000) { size = 5; opacity = 0.7; }
          else if (pop > 500000) { size = 3; opacity = 0.5; }
          else if (pop > 100000) { size = 2; opacity = 0.4; }
          
          if (isSuburb) {
            size *= 0.6; // Suburbs are smaller
            opacity *= 0.7; // Suburbs are dimmer
          }

          parsedCities.push({
            lat, lng, latRad, lngRad,
            sinLat: Math.sin(latRad),
            cosLat: Math.cos(latRad),
            size, opacity
          });
        };

        for (const feature of data.features) {
          const pop = feature.properties.pop_max;
          if (pop > 10000) { // Lower threshold to include more towns
            const lng = feature.geometry.coordinates[0];
            const lat = feature.geometry.coordinates[1];
            
            // Add main city
            addCity(lat, lng, pop);
            
            // Generate organic sprawl (suburbs/highways) for larger cities
            if (pop > 100000) {
              // Calculate number of suburbs based on population (e.g., 1M -> ~10 suburbs, 10M -> ~100)
              const numSuburbs = Math.min(Math.floor(pop / 100000), 120); 
              
              for (let j = 0; j < numSuburbs; j++) {
                // Gaussian-like distribution: more concentrated near the center
                const u1 = Math.random();
                const u2 = Math.random();
                const radius = (u1 + u2) / 2 * (pop > 5000000 ? 1.5 : 0.8); // Max radius in degrees
                const angle = Math.random() * Math.PI * 2;
                
                // Slightly distort the circle to make it look organic (like following coastlines/highways)
                const sLat = lat + Math.cos(angle) * radius * 0.8; // Latitude degrees are roughly constant
                const sLng = lng + Math.sin(angle) * radius * 1.2; // Longitude degrees shrink near poles, stretch it a bit
                
                // Suburbs have a fraction of the population
                const suburbPop = pop / (5 + Math.random() * 15);
                addCity(sLat, sLng, suburbPop, true);
              }
            }
          }
        }
        setCities(parsedCities);
      })
      .catch(err => console.error("Error fetching cities:", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scaleRef.current.target += e.deltaY * -0.002;
      scaleRef.current.target = Math.min(Math.max(0.5, scaleRef.current.target), 4);
      userInteracting.current = true;
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
      interactionTimeout.current = setTimeout(() => {
        userInteracting.current = false;
      }, 4000);
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    userInteracting.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    
    velocityRef.current = { x: deltaX, y: deltaY };
    rotationRef.current[0] += deltaX * 0.4;
    rotationRef.current[1] -= deltaY * 0.4;
    rotationRef.current[1] = Math.max(-90, Math.min(90, rotationRef.current[1]));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    interactionTimeout.current = setTimeout(() => {
      userInteracting.current = false;
    }, 4000);
  };

  const handleDoubleClick = () => {
    scaleRef.current.target = 1;
    userInteracting.current = false;
    onSelectItem(null);
  };

  useEffect(() => {
    if (!worldData || !canvasRef.current || !markersRef.current || width === 0 || height === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const projection = geoOrthographic()
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = geoPath(projection, ctx);
    const graticule = geoGraticule();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth Zoom Interpolation
      scaleRef.current.current += (scaleRef.current.target - scaleRef.current.current) * 0.1;
      projection.scale((Math.min(width, height) / 2.2) * scaleRef.current.current);

      // Update rotation
      if (isDragging.current) {
        // Rotation is updated in pointermove
      } else if (userInteracting.current) {
        // Apply inertia
        rotationRef.current[0] += velocityRef.current.x * 0.4;
        rotationRef.current[1] -= velocityRef.current.y * 0.4;
        rotationRef.current[1] = Math.max(-90, Math.min(90, rotationRef.current[1]));
        velocityRef.current.x *= 0.92; // Friction
        velocityRef.current.y *= 0.92;
      } else if (!selectedItem) {
        rotationRef.current[0] += 0.15; // Auto-rotate
        rotationRef.current[1] += (0 - rotationRef.current[1]) * 0.02; // Return to equator
      } else {
        // Smoothly interpolate to selected item's lat/lng
        const targetRot = [-selectedItem.lng, -selectedItem.lat, 0];
        rotationRef.current[0] += (targetRot[0] - rotationRef.current[0]) * 0.05;
        rotationRef.current[1] += (targetRot[1] - rotationRef.current[1]) * 0.05;
      }
      
      projection.rotate(rotationRef.current);

      const now = new Date();
      const sunPos = getSolarPosition(now);
      const antiSunPos = [sunPos.lng + 180, -sunPos.lat] as [number, number];

      // Draw ocean (Daytime color)
      ctx.beginPath();
      path({ type: 'Sphere' });
      ctx.fillStyle = '#0b1627'; // Brighter deep blue for day
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(195, 211, 51, 0.15)';
      ctx.stroke();

      // Draw graticule
      ctx.beginPath();
      path(graticule());
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.stroke();

      // Draw land (Daytime color)
      ctx.beginPath();
      path(worldData);
      ctx.fillStyle = 'rgba(195, 211, 51, 0.15)';
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(195, 211, 51, 0.7)'; // Increased opacity to see borders in the dark
      ctx.stroke();

      // Draw Night Shadow (Terminator)
      const nightCircle = geoCircle().center(antiSunPos);
      
      // Penumbra (soft edge gradient with atmospheric scattering)
      for (let i = 90; i >= 72; i -= 1) {
        ctx.beginPath();
        path(nightCircle.radius(i)());
        
        let r = 2, g = 4, b = 8, a = 0.04;
        
        // Twilight zone (80 to 90 degrees)
        if (i > 80) {
          const t = (i - 80) / 10; // 0 to 1 (1 is at 90 degrees)
          // Sunset colors: deep orange/purple fading into the night
          r = 2 + 80 * t;  
          g = 4 + 30 * t;  
          b = 8 + 40 * t;  
          a = 0.03;
        }
        
        ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
        ctx.fill();
      }
      // Deep night core
      ctx.beginPath();
      path(nightCircle.radius(72)());
      ctx.fillStyle = 'rgba(2, 4, 8, 0.65)'; // Decreased from 0.75 to allow landmass to subtly show through
      ctx.fill();

      // Draw subtle landmass borders OVER the night shadow so countries are always visible
      ctx.beginPath();
      path(worldData);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(195, 211, 51, 0.15)'; // Subtle green outline in the dark
      ctx.stroke();

      // Draw Sun Glow
      const center = [-rotationRef.current[0], -rotationRef.current[1]] as [number, number];
      const sunDistance = geoDistance(center, [sunPos.lng, sunPos.lat]);
      if (sunDistance < Math.PI / 2) {
        const sunCoords = projection([sunPos.lng, sunPos.lat]);
        if (sunCoords) {
          // Sun Corona
          const coronaGradient = ctx.createRadialGradient(sunCoords[0], sunCoords[1], 0, sunCoords[0], sunCoords[1], width / 1.5);
          coronaGradient.addColorStop(0, 'rgba(255, 245, 200, 0.25)');
          coronaGradient.addColorStop(0.15, 'rgba(255, 230, 150, 0.08)');
          coronaGradient.addColorStop(1, 'rgba(255, 230, 150, 0)');
          ctx.beginPath();
          ctx.arc(sunCoords[0], sunCoords[1], width / 1.5, 0, 2 * Math.PI);
          ctx.fillStyle = coronaGradient;
          ctx.fill();

          // Sun Core
          const coreGradient = ctx.createRadialGradient(sunCoords[0], sunCoords[1], 0, sunCoords[0], sunCoords[1], 12);
          coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          coreGradient.addColorStop(0.4, 'rgba(255, 250, 200, 0.8)');
          coreGradient.addColorStop(1, 'rgba(255, 250, 200, 0)');
          ctx.beginPath();
          ctx.arc(sunCoords[0], sunCoords[1], 12, 0, 2 * Math.PI);
          ctx.fillStyle = coreGradient;
          ctx.fill();
        }
      }

      // Draw City Lights (only on the night side)
      if (cities.length > 0 && glowCanvasRef.current) {
        const centerLngRad = center[0] * Math.PI / 180;
        const centerLatRad = center[1] * Math.PI / 180;
        const centerSinLat = Math.sin(centerLatRad);
        const centerCosLat = Math.cos(centerLatRad);

        const sunLngRad = sunPos.lng * Math.PI / 180;
        const sunLatRad = sunPos.lat * Math.PI / 180;
        const sunSinLat = Math.sin(sunLatRad);
        const sunCosLat = Math.cos(sunLatRad);

        ctx.globalCompositeOperation = 'lighter'; // Additive blending for realistic glowing clusters

        for (let i = 0; i < cities.length; i++) {
          const city = cities[i];
          
          // Distance to center (visibility check: is it on the front of the globe?)
          const cosDistCenter = centerSinLat * city.sinLat + centerCosLat * city.cosLat * Math.cos(centerLngRad - city.lngRad);
          if (cosDistCenter > 0) { // cos(dist) > 0 means dist < PI/2
            
            // Distance to sun (day/night check: is it in the dark?)
            const cosDistSun = sunSinLat * city.sinLat + sunCosLat * city.cosLat * Math.cos(sunLngRad - city.lngRad);
            
            if (cosDistSun < 0) { // cos(dist) < 0 means dist > PI/2 (night side)
              const coords = projection([city.lng, city.lat]);
              if (coords) {
                // Fade in smoothly at the terminator
                // cosDistSun goes from 0 (terminator) to -1 (midnight)
                const fade = Math.min(1, -cosDistSun * 8); 
                
                ctx.globalAlpha = fade * city.opacity;
                const drawSize = city.size;
                ctx.drawImage(
                  glowCanvasRef.current,
                  coords[0] - drawSize / 2,
                  coords[1] - drawSize / 2,
                  drawSize,
                  drawSize
                );
              }
            }
          }
        }
        ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
        ctx.globalAlpha = 1.0; // Reset alpha
      }

      // Draw selected item arc
      if (selectedItem && selectedItem.analysis?.country_center) {
        ctx.beginPath();
        path({
          type: 'LineString',
          coordinates: [
            [selectedItem.lng, selectedItem.lat],
            [selectedItem.analysis.country_center.lng, selectedItem.analysis.country_center.lat]
          ]
        });
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(195, 211, 51, 0.8)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Update HTML markers positions
      const allItems = [...threatNodes, ...signals];
      const markerElements = markersRef.current.children;

      allItems.forEach((item, index) => {
        const el = markerElements[index] as HTMLElement;
        if (!el) return;

        const distance = geoDistance(center, [item.lng, item.lat]);
        const isVisible = distance < Math.PI / 2;
        
        if (isVisible) {
          const coords = projection([item.lng, item.lat]);
          if (coords) {
            el.style.display = 'block';
            el.style.transform = `translate(${coords[0]}px, ${coords[1]}px)`;
          }
        } else {
          el.style.display = 'none';
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [width, height, worldData, signals, threatNodes, selectedItem, cities]);

  const allItems = [...threatNodes, ...signals];

  return (
    <div className="absolute inset-0">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="absolute inset-0 cursor-grab touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      />
      <div ref={markersRef} className="absolute inset-0 pointer-events-none">
        {allItems.map((item: any) => {
          const id = item.signal_id || item.threat_node_id;
          const isSelected = selectedItem && ((selectedItem as any).signal_id === id || (selectedItem as any).threat_node_id === id);
          const isHovered = hoveredId === id;
          
          return (
            <div
              key={id}
              className="absolute top-0 left-0 pointer-events-auto"
              style={{ display: 'none' }}
            >
              <PostureMarker
                status={item.status}
                x={0}
                y={0}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={() => onSelectItem(isSelected ? null : item)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WorldMap: React.FC<WorldMapProps> = ({ signals, threatNodes, rawEvents, selectedItem, onSelectItem, onOpenHistory }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const getPostureLabel = (status: NodeStatus) => {
    switch (status) {
      case 'red': return { text: 'ACTIVE CRISIS / WARFARE', color: 'text-red-500' };
      case 'yellow': return { text: 'ESCALATING TENSION', color: 'text-amber-500' };
      case 'white': return { text: 'STRUCTURAL DECAY', color: 'text-white' };
      case 'green': return { text: 'STABLE BASELINE', color: 'text-[#c3d333]' };
      default: return { text: 'EVALUATING', color: 'text-gray-500' };
    }
  };

  const isThreatNode = (item: any): item is ThreatNode => !!item && 'threat_node_id' in item;

  const calculateCredibility = (item: Signal | ThreatNode) => {
    const sourceIds = (item as any).source_ids || [];
    if (sourceIds.length === 0) {
      return (item as any).source_label ? 0.75 : 0.82;
    }
    
    const reliabilities = sourceIds.map((id: string) => {
      const source = SOURCES_REGISTRY.find(s => s.source_id === id);
      return source ? source.reliability : 0.70;
    });

    const average = reliabilities.reduce((a: number, b: number) => a + b, 0) / reliabilities.length;
    return average;
  };

  const credibilityScore = selectedItem ? calculateCredibility(selectedItem) : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#030508] cursor-crosshair group/map" onMouseMove={handleMouseMove}>
      <div className="scanline-overlay" />
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute h-full w-[1px] bg-[#c3d333]/10" style={{ left: `${mousePos.x}%` }} />
        <div className="absolute w-full h-[1px] bg-[#c3d333]/10" style={{ top: `${mousePos.y}%` }} />
      </div>

      <div className="absolute inset-0 z-10">
        {dimensions.width > 0 && (
          <CanvasGlobe 
            width={dimensions.width} 
            height={dimensions.height} 
            signals={signals} 
            threatNodes={threatNodes} 
            selectedItem={selectedItem} 
            onSelectItem={onSelectItem}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />
        )}
      </div>

      {selectedItem && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-8 bg-[#05080c]/98 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,1)] w-[520px] tooltip-enter overflow-y-auto max-h-[92%] scrollbar-hide">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${selectedItem.status === 'red' ? 'bg-red-500 animate-pulse' : selectedItem.status === 'yellow' ? 'bg-amber-500' : 'bg-white'}`} />
                 <span className={`${getPostureLabel(selectedItem.status).color} text-[10px] font-black uppercase tracking-[0.4em] font-mono-tactical`}>
                   POSTURE: {getPostureLabel(selectedItem.status).text}
                 </span>
              </div>
              <h3 className="text-white font-black text-2xl tracking-tighter uppercase leading-none">
                {isThreatNode(selectedItem) ? selectedItem.threat_type.replace('_', ' ') : selectedItem.headline}
              </h3>
            </div>
            <button onClick={() => onSelectItem(null)} className="p-2.5 hover:bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Geo-Location Hierarchy */}
            <div className="grid grid-cols-3 gap-3">
               <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl group hover:bg-cyan-500/20 transition-all">
                  <p className="text-[8px] text-cyan-400 font-black uppercase tracking-widest mb-1">COUNTRY</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {selectedItem.region_id.split('/')[1]?.trim() || selectedItem.region_id}
                  </p>
               </div>
               <div className="p-4 bg-[#c3d333]/10 border border-[#c3d333]/30 rounded-2xl group hover:bg-[#c3d333]/20 transition-all">
                  <p className="text-[8px] text-[#c3d333] font-black uppercase tracking-widest mb-1">REGION</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {selectedItem.region_id.split('/')[0]?.trim() || 'Global'}
                  </p>
               </div>
               <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl group hover:bg-purple-500/20 transition-all">
                  <p className="text-[8px] text-purple-400 font-black uppercase tracking-widest mb-1">PLACE</p>
                  <p className="text-[11px] text-white font-bold uppercase truncate">
                    {isThreatNode(selectedItem) ? 'PRIMARY THREAT' : 'SIGNAL POINT'}
                  </p>
               </div>
            </div>

            {/* Source Credibility Section */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl shadow-inner">
               <div className="flex items-center justify-between mb-3">
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-[#c3d333]" /> Weighted Source Reliability
                  </p>
                  <span className="text-[11px] font-black text-[#c3d333] font-mono-tactical">{(credibilityScore * 100).toFixed(1)}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c3d333] shadow-[0_0_10px_rgba(195,211,51,0.5)]" style={{ width: `${credibilityScore * 100}%` }} />
               </div>
               {(selectedItem as any).source_label && (
                 <p className="text-[9px] text-gray-600 font-bold uppercase mt-3 tracking-tighter truncate border-t border-white/5 pt-2">
                   SOURCES: {(selectedItem as any).source_label}
                 </p>
               )}
            </div>

            {/* Analysis Core */}
            <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-4 shadow-xl">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-[#c3d333]" /> Analysis Core
                  </p>
                  <button 
                    onClick={() => onOpenHistory?.(selectedItem)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#c3d333]/10 border border-[#c3d333]/20 rounded-lg text-[9px] font-black text-[#c3d333] hover:bg-[#c3d333]/20 transition-all uppercase tracking-widest"
                  >
                    <History size={10} /> View History
                  </button>
               </div>
               <div className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[#c3d333]/40 pl-5">
                 {selectedItem.analysis?.risk_posture || (isThreatNode(selectedItem) ? selectedItem.persistence_reason : 'No posture data available.')}
               </div>
            </div>

            {/* Systemic Cascade Path */}
            {selectedItem.analysis?.cross_domain_cascade_paths && (
              <div className="space-y-3">
                <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={12} /> Systemic Cascade Path
                </p>
                <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-[12px] text-gray-200 leading-relaxed italic border-l-4 border-l-cyan-500">
                  {selectedItem.analysis.cross_domain_cascade_paths}
                </div>
              </div>
            )}

            {/* Tactical Widgets */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all group">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Shield size={10} className="text-emerald-500" /> Confidence Score
                </p>
                <p className="text-2xl font-black text-white font-mono-tactical group-hover:text-emerald-400 transition-colors">
                  {((selectedItem.analysis?.confidence || 0.85) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all group">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Clock size={10} className="text-amber-500" /> Effect Time
                </p>
                <p className="text-[12px] font-black text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors mt-2">
                  {selectedItem.analysis?.time_to_effect || 'IMMEDIATE'}
                </p>
              </div>
            </div>

            {/* Primary Actors */}
            {isThreatNode(selectedItem) && (
              <div className="space-y-3 border-t border-white/5 pt-6">
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Active Stakeholders / Actors</p>
                 <div className="flex flex-wrap gap-2">
                    {selectedItem.primary_actors.map(actor => (
                      <span key={actor} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:text-white hover:border-[#c3d333]/40 transition-all cursor-default">{actor}</span>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
