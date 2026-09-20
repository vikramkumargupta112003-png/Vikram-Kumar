import React, { useState } from 'react';
import { TShirtColour, ViewAngle, COLOUR_CONFIGS } from '../types';
import { ZoomIn, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface TShirtVisualizerProps {
  colour: TShirtColour;
  activeAngle?: ViewAngle;
  onAngleChange?: (angle: ViewAngle) => void;
  interactive?: boolean;
  className?: string;
  sizeTag?: string;
}

export const TShirtVisualizer: React.FC<TShirtVisualizerProps> = ({
  colour,
  activeAngle: controlledAngle,
  onAngleChange,
  interactive = true,
  className = '',
  sizeTag = 'M'
}) => {
  const [internalAngle, setInternalAngle] = useState<ViewAngle>('Front');
  const [isZoomed, setIsZoomed] = useState(false);
  const currentAngle = controlledAngle !== undefined ? controlledAngle : internalAngle;

  const setAngle = (ang: ViewAngle) => {
    if (onAngleChange) onAngleChange(ang);
    else setInternalAngle(ang);
  };

  const colourConfig = COLOUR_CONFIGS[colour] || COLOUR_CONFIGS.Black;
  const hex = colourConfig.hex;
  const isWhite = colour === 'White';
  const isBlack = colour === 'Black';

  // Dynamic fabric gradient and shadow tokens
  const shadowColor = isWhite ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.35)';
  const highlightColor = isBlack ? 'rgba(255,255,255,0.08)' : isWhite ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)';
  const foldColor = isBlack ? 'rgba(0,0,0,0.5)' : isWhite ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.22)';
  const ribDarker = isWhite ? '#E2E8F0' : isBlack ? '#101012' : undefined;

  return (
    <div id="tshirt-visualizer" className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Visualizer Display Box */}
      <div 
        id="tshirt-stage"
        onClick={() => interactive && setIsZoomed(!isZoomed)}
        className="relative w-full aspect-square max-w-[460px] flex items-center justify-center p-4 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-xs overflow-hidden cursor-zoom-in group transition-all duration-300"
      >
        {/* Subtle studio backdrop lighting */}
        <div className="absolute inset-0 bg-radial from-white via-zinc-50 to-zinc-100 opacity-80 pointer-events-none" />
        
        {/* Quality guarantee badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200 shadow-xs text-xs font-medium text-zinc-800">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
          <span>100% Pure Cotton</span>
        </div>

        {/* Zoom inspection badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200 shadow-xs text-xs font-medium text-zinc-700 opacity-90 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5 text-zinc-600" />
          <span>{currentAngle} View</span>
        </div>

        {/* SVG Rendered Plain Round Neck T-Shirt */}
        <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-out ${isZoomed ? 'scale-135' : 'scale-100'}`}>
          {currentAngle === 'Front' && (
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-md filter transition-all duration-300"
              style={{ filter: `drop-shadow(0 14px 20px ${shadowColor})` }}
            >
              <defs>
                <linearGradient id={`grad-front-${colour}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={hex} />
                  <stop offset="50%" stopColor={hex} />
                  <stop offset="100%" stopColor={hex} stopOpacity="0.94" />
                </linearGradient>
                <linearGradient id={`highlight-${colour}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={highlightColor} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <filter id="cotton-texture" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
                  <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
                </filter>
              </defs>

              {/* Main Body + Sleeves Contour (Seamless Plain T-Shirt) */}
              <g id="tshirt-body">
                <path
                  d="M 180 82 
                     C 195 98, 305 98, 320 82 
                     L 405 135 
                     C 425 150, 442 165, 435 195
                     L 395 210
                     C 385 200, 380 190, 372 178
                     L 362 388 
                     C 362 396, 355 400, 345 400
                     L 155 400 
                     C 145 400, 138 396, 138 388
                     L 128 178
                     C 120 190, 115 200, 105 210
                     L 65 195
                     C 58 165, 75 150, 95 135
                     Z"
                  fill={`url(#grad-front-${colour})`}
                  stroke={isWhite ? '#CBD5E1' : 'rgba(0,0,0,0.25)'}
                  strokeWidth={isWhite ? 1.5 : 1}
                />

                {/* Pure Cotton Fabric Subtle Weave Highlight Overlay */}
                <path
                  d="M 180 82 C 195 98, 305 98, 320 82 L 405 135 L 395 210 L 372 178 L 362 388 L 138 388 L 128 178 L 105 210 L 95 135 Z"
                  fill={`url(#highlight-${colour})`}
                  opacity="0.8"
                />

                {/* Soft Natural Folds (Torso drape) */}
                <path d="M 152 230 Q 185 245 220 238" stroke={foldColor} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
                <path d="M 345 240 Q 315 255 280 248" stroke={foldColor} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
                <path d="M 160 320 Q 250 338 340 320" stroke={foldColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45" />
                
                {/* Armpit seam creases */}
                <path d="M 128 178 Q 140 195 142 215" stroke={foldColor} strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 372 178 Q 360 195 358 215" stroke={foldColor} strokeWidth="2" fill="none" opacity="0.5" />

                {/* Sleeve hems double stitch */}
                <line x1="68" y1="190" x2="102" y2="205" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="71" y1="194" x2="104" y2="208" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="432" y1="190" x2="398" y2="205" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="429" y1="194" x2="396" y2="208" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />

                {/* Bottom Hem Double Needle Stitch */}
                <line x1="140" y1="388" x2="360" y2="388" stroke={foldColor} strokeWidth="1.5" strokeDasharray="4,2" />
                <line x1="140" y1="392" x2="360" y2="392" stroke={foldColor} strokeWidth="1.5" strokeDasharray="4,2" />

                {/* Inner Back Neck view (inside the collar) */}
                <path
                  d="M 188 84 C 215 72, 285 72, 312 84 C 295 98, 205 98, 188 84 Z"
                  fill={isBlack ? '#09090b' : isWhite ? '#E2E8F0' : 'rgba(0,0,0,0.3)'}
                />

                {/* Inside Size Tag print preview */}
                <text x="250" y="80" textAnchor="middle" fill={isBlack ? '#71717A' : '#64748B'} fontSize="9" fontWeight="700" letterSpacing="0.5">
                  VIKRAM ENTERPRESSES • {sizeTag}
                </text>
                <text x="250" y="90" textAnchor="middle" fill={isBlack ? '#52525B' : '#94A3B8'} fontSize="7">
                  100% PURE COTTON
                </text>

                {/* Distinct Round Neck Rib Collar */}
                <path
                  d="M 180 82 
                     C 198 126, 302 126, 320 82 
                     C 305 98, 195 98, 180 82 Z"
                  fill={ribDarker || hex}
                  stroke={isWhite ? '#94A3B8' : 'rgba(0,0,0,0.35)'}
                  strokeWidth="1.5"
                />

                {/* Ribbed lines along collar */}
                <path d="M 210 93 L 212 99" stroke={foldColor} strokeWidth="1" />
                <path d="M 230 98 L 230 106" stroke={foldColor} strokeWidth="1" />
                <path d="M 250 100 L 250 108" stroke={foldColor} strokeWidth="1" />
                <path d="M 270 98 L 270 106" stroke={foldColor} strokeWidth="1" />
                <path d="M 290 93 L 288 99" stroke={foldColor} strokeWidth="1" />
              </g>
            </svg>
          )}

          {currentAngle === 'Side' && (
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-md filter transition-all duration-300"
              style={{ filter: `drop-shadow(0 14px 20px ${shadowColor})` }}
            >
              <defs>
                <linearGradient id={`grad-side-${colour}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={hex} stopOpacity="0.9" />
                  <stop offset="60%" stopColor={hex} />
                  <stop offset="100%" stopColor={hex} stopOpacity="0.95" />
                </linearGradient>
              </defs>
              {/* Side profile silhouette of plain cotton t-shirt */}
              <g id="tshirt-side-view">
                <path
                  d="M 225 80
                     C 255 78, 280 82, 300 86
                     L 320 145
                     C 328 175, 332 205, 310 215
                     L 285 208
                     L 280 185
                     L 288 390
                     C 288 396, 280 400, 270 400
                     L 205 400
                     C 195 400, 190 396, 192 390
                     L 205 160
                     C 202 145, 204 110, 225 80
                     Z"
                  fill={`url(#grad-side-${colour})`}
                  stroke={isWhite ? '#CBD5E1' : 'rgba(0,0,0,0.25)'}
                  strokeWidth={isWhite ? 1.5 : 1}
                />
                {/* Side sleeve contour */}
                <path
                  d="M 245 92 L 315 150 C 322 172, 320 195, 305 210 L 280 195 Z"
                  fill={hex}
                  stroke={foldColor}
                  strokeWidth="1"
                />
                {/* Sleeve cuff stitch */}
                <line x1="305" y1="205" x2="282" y2="192" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                {/* Side seam */}
                <line x1="248" y1="165" x2="246" y2="390" stroke={foldColor} strokeWidth="1.5" strokeDasharray="4,2" />
                {/* Side bottom hem */}
                <line x1="195" y1="392" x2="284" y2="392" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                {/* Collar side rib view */}
                <path d="M 225 80 C 240 85, 265 85, 280 82" stroke={isWhite ? '#94A3B8' : 'rgba(0,0,0,0.4)'} strokeWidth="3" fill="none" />
              </g>
            </svg>
          )}

          {currentAngle === 'Back' && (
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-md filter transition-all duration-300"
              style={{ filter: `drop-shadow(0 14px 20px ${shadowColor})` }}
            >
              <defs>
                <linearGradient id={`grad-back-${colour}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={hex} />
                  <stop offset="100%" stopColor={hex} stopOpacity="0.94" />
                </linearGradient>
              </defs>
              <g id="tshirt-back-view">
                {/* Back silhouette (similar shape, higher collar contour) */}
                <path
                  d="M 180 82 
                     C 215 72, 285 72, 320 82 
                     L 405 135 
                     C 425 150, 442 165, 435 195
                     L 395 210
                     C 385 200, 380 190, 372 178
                     L 362 388 
                     C 362 396, 355 400, 345 400
                     L 155 400 
                     C 145 400, 138 396, 138 388
                     L 128 178
                     C 120 190, 115 200, 105 210
                     L 65 195
                     C 58 165, 75 150, 95 135
                     Z"
                  fill={`url(#grad-back-${colour})`}
                  stroke={isWhite ? '#CBD5E1' : 'rgba(0,0,0,0.25)'}
                  strokeWidth={isWhite ? 1.5 : 1}
                />

                {/* Back Round Neck Rib Collar (High and clean) */}
                <path
                  d="M 180 82 C 215 72, 285 72, 320 82 C 300 87, 200 87, 180 82 Z"
                  fill={ribDarker || hex}
                  stroke={isWhite ? '#94A3B8' : 'rgba(0,0,0,0.4)'}
                  strokeWidth="2"
                />

                {/* Inner Neck taping stitch across back */}
                <path d="M 185 86 C 220 78, 280 78, 315 86" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" fill="none" />

                {/* Clean Plain Back - subtle spine curve fold */}
                <path d="M 250 140 Q 248 250 250 350" stroke={foldColor} strokeWidth="1.5" fill="none" opacity="0.3" />
                <path d="M 160 330 Q 250 345 340 330" stroke={foldColor} strokeWidth="2" fill="none" opacity="0.35" />

                {/* Double stitched bottom hem */}
                <line x1="140" y1="388" x2="360" y2="388" stroke={foldColor} strokeWidth="1.5" strokeDasharray="4,2" />
                <line x1="140" y1="392" x2="360" y2="392" stroke={foldColor} strokeWidth="1.5" strokeDasharray="4,2" />

                {/* Sleeve hem stitches */}
                <line x1="68" y1="190" x2="102" y2="205" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="432" y1="190" x2="398" y2="205" stroke={foldColor} strokeWidth="1.5" strokeDasharray="3,2" />
              </g>
            </svg>
          )}

          {currentAngle === 'Zoom' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden p-6">
              {/* Macro fabric texture simulation */}
              <div 
                className="w-full h-full rounded-xl border border-zinc-200/90 flex flex-col justify-between p-6 shadow-inner relative overflow-hidden"
                style={{ backgroundColor: hex }}
              >
                {/* Cotton weave pattern */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(${isWhite ? '#000' : '#fff'} 1px, transparent 1px)`,
                    backgroundSize: '8px 8px'
                  }}
                />
                
                {/* Collar Ribbing Zoom Detail */}
                <div className="relative z-10 bg-black/10 backdrop-blur-xs p-4 rounded-xl border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-4 h-4 ${isWhite || colour === 'Yellow' ? 'text-zinc-900' : 'text-white'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isWhite || colour === 'Yellow' ? 'text-zinc-900' : 'text-white'}`}>
                      100% Pure Combed Cotton Weave
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isWhite || colour === 'Yellow' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    180 GSM Bio-Washed single jersey knit. Ultra-soft touch, zero synthetic blend, breathable ring-spun yarn with high-density anti-pilling compact weave.
                  </p>
                </div>

                {/* Collar micro rib lines preview */}
                <div className="relative z-10 flex flex-col gap-1 mt-auto bg-black/15 backdrop-blur-xs p-3.5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-center text-[11px] font-semibold text-white/90">
                    <span className={isWhite || colour === 'Yellow' ? 'text-zinc-900' : 'text-white'}>Collar: 1x1 Rib Lycra Neckband</span>
                    <span className={isWhite || colour === 'Yellow' ? 'text-zinc-700' : 'text-zinc-300'}>Anti-Sag Shape Retention</span>
                  </div>
                  <div className="w-full h-2 rounded bg-white/20 overflow-hidden flex">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="flex-1 border-r border-black/20" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Plain T-Shirt Disclaimer */}
        <div className="absolute bottom-2 text-center text-[11px] text-zinc-600 bg-white/90 px-3 py-0.5 rounded-full border border-zinc-200 backdrop-blur-xs">
          Solid Plain • No Prints • No Graphics
        </div>
      </div>

      {/* Angle Selector Controls */}
      {interactive && (
        <div id="angle-controls" className="flex items-center gap-1.5 mt-3 p-1 bg-zinc-100/90 rounded-xl border border-zinc-200">
          {(['Front', 'Side', 'Back', 'Zoom'] as ViewAngle[]).map((ang) => (
            <button
              key={ang}
              id={`angle-btn-${ang.toLowerCase()}`}
              type="button"
              onClick={() => setAngle(ang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentAngle === ang
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/80 font-bold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {ang}
            </button>
          ))}
          <button
            id="angle-reset-btn"
            type="button"
            title="Reset angle to Front"
            onClick={() => setAngle('Front')}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
