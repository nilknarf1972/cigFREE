import React from 'react';

/**
 * Accessible, custom-authored SVG educational illustrations created by The Primo IT Tech LLC.
 * Never uses scraped images or deceptive AI patient photos.
 */
export default function EducationalIllustration({
  type = 'cilia-renewal',
  title = 'Educational Illustration',
  description = 'An educational vector diagram supporting smoking cessation.',
  reducedMotion = false
}) {
  const titleId = `svg-title-${type}`;
  const descId = `svg-desc-${type}`;

  return (
    <div className="illustration-canvas" role="img" aria-label={description}>
      <svg
        viewBox="0 0 420 210"
        width="100%"
        height="210"
        aria-labelledby={`${titleId} ${descId}`}
        focusable="false"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{description}</desc>

        <defs>
          <linearGradient id="bgCalm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6F4F1" />
            <stop offset="100%" stopColor="#D3ECE7" />
          </linearGradient>
          <linearGradient id="bgDirect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EFEA" />
            <stop offset="100%" stopColor="#EAE0D7" />
          </linearGradient>
          <linearGradient id="bgSunrise" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FCECD2" />
            <stop offset="60%" stopColor="#E4F2EE" />
            <stop offset="100%" stopColor="#C8E4DD" />
          </linearGradient>
        </defs>

        {type === 'cilia-renewal' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            {/* Clean airflow streams */}
            <path
              d="M 40 65 Q 130 45, 220 65 T 380 58"
              fill="none"
              stroke="#14746F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={reducedMotion ? 'none' : '8 6'}
            />
            <path
              d="M 40 95 Q 150 75, 240 95 T 380 88"
              fill="none"
              stroke="#2A9D8F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Airway base tissue */}
            <rect x="30" y="155" width="360" height="32" rx="10" fill="#0F5257" />
            {/* Microscopic cilia brushes */}
            {[55, 85, 115, 145, 175, 205, 235, 265, 295, 325, 355].map((x) => (
              <g key={x}>
                <path
                  d={`M ${x} 155 Q ${x + 6} 128, ${x + 14} 115`}
                  fill="none"
                  stroke="#1E8E83"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <circle cx={x + 14} cy={115} r="3.5" fill="#2A9D8F" />
              </g>
            ))}
            <text x="44" y="36" fill="#0F5257" fontSize="13" fontWeight="700">
              Clean Airflow &amp; Cilia Recovery Diagram
            </text>
          </g>
        )}

        {type === 'oxygen-flow' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            <rect x="28" y="68" width="364" height="84" rx="42" fill="#FFFFFF" stroke="#14746F" strokeWidth="3" />
            {[85, 165, 245, 325].map((cx, idx) => (
              <g key={cx}>
                <circle cx={cx} cy={110} r="24" fill="#D9534F" opacity="0.9" />
                <circle cx={cx} cy={110} r="10" fill="#B53834" />
                {/* Oxygen molecule */}
                <circle cx={cx + 15} cy={92} r="9" fill="#1D70B8" />
                <text x={cx + 15} y={96} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700">
                  O₂
                </text>
                {idx < 3 && (
                  <path d={`M ${cx + 34} 110 L ${cx + 50} 110`} stroke="#14746F" strokeWidth="2.5" />
                )}
              </g>
            ))}
            <text x="42" y="42" fill="#0F5257" fontSize="13" fontWeight="700">
              Red Blood Cell Oxygen (O₂) Transport Diagram
            </text>
            <text x="42" y="182" fill="#234E52" fontSize="12">
              Without new carbon monoxide, red blood cells pair freely with oxygen.
            </text>
          </g>
        )}

        {type === 'airway-comparison-direct' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgDirect)" />
            {/* Left: Clear Bronchial Cross Section */}
            <circle cx="120" cy="108" r="56" fill="#D8ECE8" stroke="#0F5257" strokeWidth="5" />
            <circle cx="120" cy="108" r="38" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="3" />
            <text x="120" y="112" textAnchor="middle" fill="#0F5257" fontSize="12" fontWeight="700">
              Clear Lumen
            </text>
            <text x="120" y="184" textAnchor="middle" fill="#0F5257" fontSize="12" fontWeight="700">
              Smoke-Free Airway
            </text>

            {/* Right: Irritated & Tar-Coated Airway */}
            <circle cx="300" cy="108" r="56" fill="#C9A99A" stroke="#5C3D2E" strokeWidth="5" />
            <circle cx="300" cy="108" r="36" fill="#8C584C" />
            <circle cx="300" cy="108" r="17" fill="#3D2B24" stroke="#E07A5F" strokeWidth="3" />
            <text x="300" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">
              Narrowed
            </text>
            <text x="300" y="184" textAnchor="middle" fill="#5C3D2E" fontSize="12" fontWeight="700">
              Smoke &amp; Particulate Buildup
            </text>
            <text x="210" y="30" textAnchor="middle" fill="#3D2B24" fontSize="13" fontWeight="700">
              Direct Cross-Section Diagram: Airway Lining Comparison
            </text>
          </g>
        )}

        {type === 'vascular-calm' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            <path
              d="M 55 105 C 125 55, 295 55, 365 105 C 295 155, 125 155, 55 105 Z"
              fill="#FFFFFF"
              stroke="#14746F"
              strokeWidth="3.5"
            />
            <circle cx="210" cy="105" r="28" fill="#2A9D8F" />
            <path
              d="M 196 105 L 206 115 L 226 95"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="210" y="38" textAnchor="middle" fill="#0F5257" fontSize="13" fontWeight="700">
              Relaxed Vascular Tone &amp; Steady Circulation
            </text>
            <text x="210" y="182" textAnchor="middle" fill="#1D4E52" fontSize="12">
              Stepping away from nicotine eases acute vessel constriction.
            </text>
          </g>
        )}

        {type === 'arterial-stress-direct' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgDirect)" />
            {/* Top vessel: open */}
            <rect x="45" y="48" width="330" height="44" rx="22" fill="#FFFFFF" stroke="#14746F" strokeWidth="3.5" />
            <text x="210" y="75" textAnchor="middle" fill="#0F5257" fontSize="12" fontWeight="700">
              Unobstructed Vessel Flow (Smoke-Free)
            </text>
            {/* Bottom vessel: constricted with wall plaque */}
            <rect x="45" y="114" width="330" height="48" rx="24" fill="#F2D7D0" stroke="#7A3E32" strokeWidth="3.5" />
            <path d="M 95 116 Q 210 136, 325 116 Z" fill="#8C584C" />
            <path d="M 95 160 Q 210 140, 325 160 Z" fill="#8C584C" />
            <text x="210" y="142" textAnchor="middle" fill="#4A251D" fontSize="11" fontWeight="700">
              Constricted Vessel Wall Stress From Smoke Chemicals
            </text>
            <text x="210" y="188" textAnchor="middle" fill="#4A251D" fontSize="12">
              Stopping tobacco smoke exposure supports endothelial recovery at any age.
            </text>
          </g>
        )}

        {type === 'senses-bloom' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            <circle cx="135" cy="115" r="42" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="3" />
            <path d="M 118 122 Q 135 142, 152 122" fill="none" stroke="#0F5257" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 125 96 Q 130 82, 135 96" fill="none" stroke="#E07A5F" strokeWidth="3" strokeLinecap="round" />
            <path d="M 140 96 Q 145 82, 150 96" fill="none" stroke="#E07A5F" strokeWidth="3" strokeLinecap="round" />

            <circle cx="285" cy="115" r="42" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="3" />
            <path d="M 285 88 C 302 98, 302 128, 285 142 C 268 128, 268 98, 285 88 Z" fill="#2A9D8F" />
            <text x="210" y="40" textAnchor="middle" fill="#0F5257" fontSize="13" fontWeight="700">
              Taste &amp; Olfactory Receptor Renewal Diagram
            </text>
            <text x="210" y="184" textAnchor="middle" fill="#0F5257" fontSize="12">
              Natural food flavors and clean scents return as smoke irritation fades.
            </text>
          </g>
        )}

        {type === 'clean-home' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            <polygon points="210,36 115,96 305,96" fill="#14746F" />
            <rect x="135" y="96" width="150" height="76" rx="8" fill="#FFFFFF" stroke="#0F5257" strokeWidth="3" />
            <rect x="188" y="114" width="44" height="36" rx="4" fill="#D8F3DC" stroke="#2A9D8F" strokeWidth="2.5" />
            <text x="210" y="192" textAnchor="middle" fill="#0F5257" fontSize="12" fontWeight="700">
              Clean Indoor Air for Family, Friends &amp; Pets
            </text>
          </g>
        )}

        {type === 'oral-tissue-direct' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgDirect)" />
            <rect x="44" y="54" width="150" height="106" rx="12" fill="#FFFFFF" stroke="#2A9D8F" strokeWidth="3" />
            <rect x="64" y="72" width="110" height="34" rx="10" fill="#F4ACB7" />
            <rect x="78" y="106" width="36" height="34" rx="6" fill="#F8F9FA" stroke="#ADB5BD" strokeWidth="2" />
            <rect x="122" y="106" width="36" height="34" rx="6" fill="#F8F9FA" stroke="#ADB5BD" strokeWidth="2" />
            <text x="119" y="178" textAnchor="middle" fill="#0F5257" fontSize="11" fontWeight="700">
              Healthy Gum Circulation
            </text>

            <rect x="226" y="54" width="150" height="106" rx="12" fill="#F7EDE2" stroke="#7A3E32" strokeWidth="3" />
            <rect x="246" y="72" width="110" height="34" rx="10" fill="#B5838D" />
            <rect x="260" y="106" width="36" height="34" rx="6" fill="#DDD0B8" stroke="#8C584C" strokeWidth="2" />
            <rect x="304" y="106" width="36" height="34" rx="6" fill="#DDD0B8" stroke="#8C584C" strokeWidth="2" />
            <text x="301" y="178" textAnchor="middle" fill="#5C3D2E" fontSize="11" fontWeight="700">
              Smoke-Exposed Gum &amp; Enamel
            </text>
            <text x="210" y="34" textAnchor="middle" fill="#3D2B24" fontSize="13" fontWeight="700">
              Direct Diagram: Oral Capillary Flow &amp; Surface Staining
            </text>
          </g>
        )}

        {type === 'craving-wave' && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgCalm)" />
            <line x1="45" y1="158" x2="375" y2="158" stroke="#0F5257" strokeWidth="2" />
            <path
              d="M 45 155 C 105 150, 145 52, 195 52 C 245 52, 285 148, 375 155"
              fill="none"
              stroke="#14746F"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="195" cy="52" r="7" fill="#E07A5F" />
            <text x="195" y="36" textAnchor="middle" fill="#0F5257" fontSize="12" fontWeight="700">
              Craving Peak (3–5 Minutes)
            </text>
            <text x="325" y="136" textAnchor="middle" fill="#14746F" fontSize="12" fontWeight="700">
              Urge Subsides
            </text>
            <text x="210" y="186" textAnchor="middle" fill="#0F5257" fontSize="12">
              Delaying a decision for 5 minutes lets the wave crest and pass.
            </text>
          </g>
        )}

        {(type === 'sunrise-horizon' || type === 'forest-breeze' || type === 'harbor-beacon') && (
          <g>
            <rect width="420" height="210" rx="16" fill="url(#bgSunrise)" />
            <circle cx="210" cy="92" r="36" fill="#F4A261" opacity="0.85" />
            <path d="M 0 155 Q 110 115, 220 145 T 420 135 L 420 210 L 0 210 Z" fill="#2A9D8F" />
            <path d="M 0 175 Q 160 145, 290 168 T 420 162 L 420 210 L 0 210 Z" fill="#0F5257" />
            <path
              d="M 185 210 Q 205 165, 210 142 Q 220 165, 240 210 Z"
              fill="#FCECD2"
              opacity="0.9"
            />
            <text x="210" y="36" textAnchor="middle" fill="#0F5257" fontSize="14" fontWeight="700">
              Clear Path Inspirational Pause
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
