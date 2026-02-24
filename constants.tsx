import React from 'react';
import { 
  Map as MapIcon, 
  ShieldAlert, 
  Database, 
  Flame,
  History,
  Target
} from 'lucide-react';
import { NavItem, Signal, AcquisitionPlan, ThreatNode, Source } from './types';

export const MAIN_NAV: NavItem[] = [
  { id: 'map', label: 'Intelligence Map', icon: <MapIcon size={18} /> },
  { id: 'threats', label: 'Threat Registry', icon: <Flame size={18} /> },
  { id: 'sources', label: 'Acquisition Plans', icon: <Database size={18} /> },
  { id: 'solutions', label: 'Resolution Hub', icon: <Target size={18} /> },
  { id: 'risk', label: 'Risk Analytics', icon: <ShieldAlert size={18} /> },
  { id: 'history', label: 'Timeline History', icon: <History size={18} /> },
];

export const BOTTOM_NAV: NavItem[] = [];

export const SOURCES_REGISTRY: Source[] = [
  { source_id: 'src-centcom', label: 'US CENTCOM', reliability: 0.95 },
  { source_id: 'src-un-relief', label: 'UN Relief Web', reliability: 0.88 },
  { source_id: 'src-ukmto', label: 'UKMTO', reliability: 0.92 },
  { source_id: 'src-noaa', label: 'NOAA Satellite Data', reliability: 0.98 },
  { source_id: 'src-sp-global', label: 'S&P Global Commodities', reliability: 0.85 },
  { source_id: 'src-osint-open', label: 'Open Source Intelligence', reliability: 0.72 },
  { source_id: 'src-pla-mod', label: 'PLA MOD Bulletin', reliability: 0.65 },
  { source_id: 'src-wfp', label: 'World Food Programme', reliability: 0.90 },
  { source_id: 'src-hrw', label: 'Human Rights Watch', reliability: 0.89 },
  { source_id: 'src-interpol', label: 'INTERPOL Digital Crime', reliability: 0.91 },
  { source_id: 'src-who-alert', label: 'WHO Global Alert', reliability: 0.94 },
  { source_id: 'src-eia', label: 'Energy Intelligence Agency', reliability: 0.93 },
];

export const BASELINE_THREAT_NODES: ThreatNode[] = [
  {
    threat_node_id: 'tn-ukraine',
    region_id: 'Donbas / Kharkiv Axis',
    lat: 48.0,
    lng: 37.5,
    threat_type: 'kinetic_war',
    active_since: '2022-02-24',
    intensity: 'high',
    status: 'red',
    primary_actors: ['Russia', 'Ukraine'],
    domains: ['military', 'energy'],
    persistence_reason: 'High-intensity industrial attrition war.',
    analysis: {
      risk_posture: "TOTAL KINETIC ATTRITION",
      primary_drivers: ["Ammunition parity", "Mobilization cycles"],
      cross_domain_cascade_paths: "Energy grid collapse in Eastern Europe; global grain price shock.",
      time_to_effect: "Ongoing",
      confidence: 0.98,
      country_center: { lat: 48.3794, lng: 31.1656 },
      history: [
        { date: '2014-02-20', event: 'Crimean Annexation', impact: 'Initial breach of sovereignty.' },
        { date: '2022-02-24', event: 'Full-Scale Invasion', impact: 'Industrial scale warfare resumed.' }
      ]
    },
    review_interval: 'days'
  },
  {
    threat_node_id: 'tn-taiwan',
    region_id: 'Taiwan Strait',
    lat: 24.5,
    lng: 121.0,
    threat_type: 'proxy_conflict',
    active_since: '1949-10-01',
    intensity: 'medium',
    status: 'yellow',
    primary_actors: ['China', 'Taiwan', 'USA'],
    domains: ['military', 'tech', 'finance'],
    persistence_reason: 'Sovereignty dispute with global economic stakes.',
    analysis: {
      risk_posture: "ESCALATING GRAY-ZONE PRESSURE",
      primary_drivers: ["ADIZ incursions", "Semiconductor decoupling"],
      cross_domain_cascade_paths: "Global tech industry paralysis; Pacific naval blockade.",
      time_to_effect: "12-24 Months",
      confidence: 0.85,
      country_center: { lat: 23.6978, lng: 120.9605 }
    },
    review_interval: 'weeks'
  },
  {
    threat_node_id: 'tn-central-asia-hydro',
    region_id: 'Kyrgyzstan / Tajikistan Border',
    lat: 39.8,
    lng: 69.5,
    threat_type: 'resource_scarcity',
    active_since: '2021-04-28',
    intensity: 'medium',
    status: 'yellow',
    primary_actors: ['Kyrgyzstan', 'Tajikistan'],
    domains: ['governance', 'military'],
    persistence_reason: 'Hydro-politics and disputed water distribution infrastructure.',
    analysis: {
      risk_posture: "BORDER SKIRMISH POTENTIAL",
      primary_drivers: ["Water rights", "Soviet-era enclave disputes"],
      cross_domain_cascade_paths: "Regional energy blackouts; destabilization of Silk Road logistics.",
      time_to_effect: "Sudden",
      confidence: 0.82
    },
    review_interval: 'weeks'
  },
  {
    threat_node_id: 'tn-deep-sea-mining',
    region_id: 'Clarion-Clipperton Zone / Pacific',
    lat: 10.0,
    lng: -120.0,
    threat_type: 'economic_warfare',
    active_since: '2023-01-01',
    intensity: 'low',
    status: 'white',
    primary_actors: ['ISA', 'Deep-sea mining firms', 'Pacific Island Nations'],
    domains: ['environment', 'energy', 'tech'],
    persistence_reason: 'Race for cobalt and nickel seabed rights.',
    analysis: {
      risk_posture: "UNREGULATED RESOURCE EXTRACTION",
      primary_drivers: ["EV battery demand", "Ocean-floor sovereignty"],
      cross_domain_cascade_paths: "Benthic ecosystem collapse; naval friction in international waters.",
      time_to_effect: "Years",
      confidence: 0.74
    },
    review_interval: 'months'
  },
  {
    threat_node_id: 'tn-sahel-terror',
    region_id: 'Liptako-Gourma Tri-border',
    lat: 14.5,
    lng: 0.5,
    threat_type: 'internal_security_collapse',
    active_since: '2015-01-01',
    intensity: 'high',
    status: 'red',
    primary_actors: ['JNIM', 'ISGS', 'Malian Armed Forces'],
    domains: ['social', 'military'],
    persistence_reason: 'State withdrawal and extremist territorial expansion.',
    analysis: {
      risk_posture: "INSURGENT STATEHOOD",
      primary_drivers: ["Gold mining control", "Ethnic marginalization"],
      cross_domain_cascade_paths: "Mass migration to coastal West Africa; proliferation of small arms.",
      time_to_effect: "Ongoing",
      confidence: 0.91
    },
    review_interval: 'days'
  },
  {
    threat_node_id: 'tn-arctic-militarization',
    region_id: 'Franz Josef Land / Murmansk',
    lat: 80.0,
    lng: 50.0,
    threat_type: 'nuclear_deterrence',
    active_since: '2022-03-01',
    intensity: 'medium',
    status: 'red',
    primary_actors: ['Russia', 'NATO'],
    domains: ['military', 'space'],
    persistence_reason: 'Northern Sea Route control and strategic bomber basing.',
    analysis: {
      risk_posture: "HIGH-NORTH FRICTION",
      primary_drivers: ["Ice-breaker dominance", "Undersea cable vulnerability"],
      cross_domain_cascade_paths: "Arctic ecological tipping point; satellite navigation jamming.",
      time_to_effect: "Days",
      confidence: 0.88
    },
    review_interval: 'weeks'
  },
  {
    threat_node_id: 'tn-biometric-repression',
    region_id: 'Xinjiang / Central Asia',
    lat: 43.0,
    lng: 87.0,
    threat_type: 'hybrid_warfare',
    active_since: '2017-01-01',
    intensity: 'high',
    status: 'red',
    primary_actors: ['State Security Agencies', 'Tech Surveillance Contractors'],
    domains: ['tech', 'social', 'governance'],
    persistence_reason: 'Algorithmic social control and cultural homogenization.',
    analysis: {
      risk_posture: "TOTAL DIGITAL ENCLOSURE",
      primary_drivers: ["AI facial recognition", "DNA profiling"],
      cross_domain_cascade_paths: "Export of surveillance tech to other autocracies; collapse of privacy norms.",
      time_to_effect: "Persistent",
      confidence: 0.97
    },
    review_interval: 'months'
  },
  {
    threat_node_id: 'tn-mexico-fentanyl',
    region_id: 'Culiacán / Sinaloa',
    lat: 24.8,
    lng: -107.4,
    threat_type: 'internal_security_collapse',
    active_since: '2019-10-17',
    intensity: 'high',
    status: 'red',
    primary_actors: ['Sinaloa Cartel', 'CJNG', 'Mexican Sedena'],
    domains: ['social', 'finance', 'health'],
    persistence_reason: 'Narcotics production and distribution hegemony.',
    analysis: {
      risk_posture: "NARCO-PARAMILITARIZATION",
      primary_drivers: ["Synthetic opioid exports", "State corruption"],
      cross_domain_cascade_paths: "Public health collapse in North America; regional economic distortion.",
      time_to_effect: "Immediate",
      confidence: 0.95
    },
    review_interval: 'days'
  },
  {
    threat_node_id: 'tn-space-race-lunar',
    region_id: 'Lunar South Pole / Shackleton',
    lat: -89.0,
    lng: 0.0,
    threat_type: 'proxy_conflict',
    active_since: '2024-01-01',
    intensity: 'low',
    status: 'white',
    primary_actors: ['NASA', 'CNSA', 'Private Space Firms'],
    domains: ['space', 'tech', 'military'],
    persistence_reason: 'Strategic water-ice resource control.',
    analysis: {
      risk_posture: "EXTRATERRESTRIAL SOVEREIGNTY CLAIM",
      primary_drivers: ["Ice-mining rights", "Strategic landing sites"],
      cross_domain_cascade_paths: "Militarization of orbital transit; terrestrial geopolitical friction via space assets.",
      time_to_effect: "Years",
      confidence: 0.68
    },
    review_interval: 'months'
  },
  {
    threat_node_id: 'tn-rhino-poaching',
    region_id: 'Kruger / South Africa',
    lat: -24.0,
    lng: 31.5,
    threat_type: 'internal_security_collapse',
    active_since: '2010-01-01',
    intensity: 'medium',
    status: 'yellow',
    primary_actors: ['Wildlife Syndicates', 'SanParks Rangers'],
    domains: ['environment', 'finance'],
    persistence_reason: 'Transnational illicit trade in high-value biological assets.',
    analysis: {
      risk_posture: "BIODIVERSITY ERADICATION",
      primary_drivers: ["Traditional medicine demand", "Rural poverty"],
      cross_domain_cascade_paths: "Ecosystem service collapse; funding for regional rebel groups.",
      time_to_effect: "Months",
      confidence: 0.83
    },
    review_interval: 'weeks'
  }
];

export const BASELINE_SIGNALS: Signal[] = [
  {
    signal_id: 'sig-redsea',
    region_id: 'Bab el-Mandeb',
    lat: 12.6,
    lng: 43.3,
    domain: 'military',
    severity: 'high',
    strategic_weight: 5,
    status: 'red',
    created_at: new Date().toISOString(),
    source_ids: ['src-ukmto', 'src-centcom'],
    source_label: 'UKMTO / CENTCOM',
    headline: 'Maritime Chokepoint Interdiction',
    analysis: {
      risk_posture: "CRITICAL NAVIGATION DENIAL",
      primary_drivers: ["UAV swarm tactics"],
      cross_domain_cascade_paths: "Global shipping rerouting; inflation spikes.",
      time_to_effect: "Hours",
      confidence: 0.96
    }
  },
  {
    signal_id: 'sig-speech-lockdown',
    region_id: 'Sub-Saharan / MENA',
    lat: 30.0,
    lng: 31.0,
    domain: 'governance',
    severity: 'high',
    strategic_weight: 5,
    status: 'red',
    created_at: new Date().toISOString(),
    source_ids: ['src-hrw'],
    source_label: 'Citizen Lab / HRW',
    headline: 'Internet Shutdown / Digital Censorship',
    analysis: {
      risk_posture: "INFORMATION BLACKOUT",
      primary_drivers: ["Election cycle control", "BGP hijacking"],
      cross_domain_cascade_paths: "Economic paralysis; cover for human rights abuses.",
      time_to_effect: "Sudden",
      confidence: 0.92
    }
  },
  {
    signal_id: 'sig-water-poison-indus',
    region_id: 'Indus River Delta',
    lat: 24.5,
    lng: 67.5,
    domain: 'environment',
    severity: 'high',
    strategic_weight: 4,
    status: 'red',
    created_at: new Date().toISOString(),
    source_ids: ['src-who-alert'],
    source_label: 'WHO / Environmental Watch',
    headline: 'Industrial Chemical Toxicity Breach',
    analysis: {
      risk_posture: "ACUTE ECO-SYSTEM COLLAPSE",
      primary_drivers: ["Illegal effluent dumping", "Flooding overflow"],
      cross_domain_cascade_paths: "Mass poisoning of drinking water; destruction of regional agriculture.",
      time_to_effect: "Immediate",
      confidence: 0.88
    }
  },
  {
    signal_id: 'sig-land-salinity',
    region_id: 'Nile Delta / Egypt',
    lat: 31.0,
    lng: 31.0,
    domain: 'environment',
    severity: 'medium',
    strategic_weight: 3,
    status: 'white',
    created_at: new Date().toISOString(),
    source_ids: ['src-noaa'],
    source_label: 'Copernicus / FAO',
    headline: 'Soil Salinization / Arable Land Decay',
    analysis: {
      risk_posture: "FOOD SECURITY FAILURE",
      primary_drivers: ["Sea-level rise", "Reduced sediment flow"],
      cross_domain_cascade_paths: "Internal migration to Cairo; dependence on wheat imports.",
      time_to_effect: "Years (Progressive)",
      confidence: 0.85
    }
  },
  {
    signal_id: 'sig-democ-erosion-hungary',
    region_id: 'Budapest / Hungary',
    lat: 47.5,
    lng: 19.0,
    domain: 'governance',
    severity: 'medium',
    strategic_weight: 4,
    status: 'yellow',
    created_at: new Date().toISOString(),
    source_ids: ['src-hrw'],
    source_label: 'V-Dem Institute / OSINT',
    headline: 'Judicial Independence Degradation',
    analysis: {
      risk_posture: "CONSTITUTIONAL CAPTURE",
      primary_drivers: ["Executive overreach", "Media consolidation"],
      cross_domain_cascade_paths: "EU internal policy deadlock; loss of rule of law.",
      time_to_effect: "Months",
      confidence: 0.91
    }
  },
  {
    signal_id: 'sig-micro-militarization',
    region_id: 'Poland / Belarus Border',
    lat: 53.5,
    lng: 23.5,
    domain: 'military',
    severity: 'medium',
    strategic_weight: 4,
    status: 'yellow',
    created_at: new Date().toISOString(),
    source_ids: ['src-centcom'],
    source_label: 'Frontex / OSINT',
    headline: 'Weaponized Migration / Border Fortification',
    analysis: {
      risk_posture: "HYBRID CONFRONTATION",
      primary_drivers: ["Migrant channeling", "Fence construction"],
      cross_domain_cascade_paths: "Humanitarian crisis; NATO Article 4 potential.",
      time_to_effect: "Days",
      confidence: 0.89
    }
  },
  {
    signal_id: 'sig-bioweapon-leak-rumor',
    region_id: 'Unknown Lab / Global',
    lat: 55.0,
    lng: 82.0,
    domain: 'health',
    severity: 'high',
    strategic_weight: 5,
    status: 'red',
    created_at: new Date().toISOString(),
    source_ids: ['src-who-alert'],
    source_label: 'DARPA / WHO',
    headline: 'Pathogen Biosafety Breach Protocol',
    analysis: {
      risk_posture: "EPIDEMIOLOGICAL ALERT",
      primary_drivers: ["Containment failure", "Unusual hospital cluster"],
      cross_domain_cascade_paths: "Global pandemic; socio-economic shutdown.",
      time_to_effect: "Weeks",
      confidence: 0.62
    }
  },
  {
    signal_id: 'sig-lithium-grab-bolivia',
    region_id: 'Salar de Uyuni',
    lat: -20.0,
    lng: -67.5,
    domain: 'energy',
    severity: 'medium',
    strategic_weight: 4,
    status: 'yellow',
    created_at: new Date().toISOString(),
    source_ids: ['src-sp-global'],
    source_label: 'EIA / Mineral Market Watch',
    headline: 'Critical Mineral Concession Conflict',
    analysis: {
      risk_posture: "STRATEGIC ASSET GEOPOLITICIZATION",
      primary_drivers: ["Foreign state-firm bidding", "Local indigenous unrest"],
      cross_domain_cascade_paths: "Energy transition supply bottleneck; regional civil unrest.",
      time_to_effect: "Months",
      confidence: 0.84
    }
  },
  {
    signal_id: 'sig-amazon-tipping-point',
    region_id: 'Southern Amazon Basin',
    lat: -10.0,
    lng: -55.0,
    domain: 'environment',
    severity: 'high',
    strategic_weight: 5,
    status: 'red',
    created_at: new Date().toISOString(),
    source_ids: ['src-noaa'],
    source_label: 'INPE / Satellite Bio-scan',
    headline: 'Forest-to-Savannah Transition Trigger',
    analysis: {
      risk_posture: "IRREVERSIBLE CLIMATIC SHIFT",
      primary_drivers: ["Deforestation rates", "Rainfall collapse"],
      cross_domain_cascade_paths: "Global carbon cycle breakdown; agricultural failure in Brazil.",
      time_to_effect: "Years (Critical Threshold)",
      confidence: 0.94
    }
  },
  {
    signal_id: 'sig-crypto-sanction-bypass',
    region_id: 'Global Digital Layer',
    lat: 40.0,
    lng: 10.0,
    domain: 'finance',
    severity: 'medium',
    strategic_weight: 3,
    status: 'white',
    created_at: new Date().toISOString(),
    source_ids: ['src-interpol'],
    source_label: 'Chainalysis / FBI',
    headline: 'Decentralized Financial Warfare Assets',
    analysis: {
      risk_posture: "SANCTION INTEGRITY THREAT",
      primary_drivers: ["Mixing services", "State-sponsored hacking groups"],
      cross_domain_cascade_paths: "Funding for rogue states; erosion of US Dollar hegemony.",
      time_to_effect: "Continuous",
      confidence: 0.77
    }
  }
];

export const BASELINE_ACQUISITION_PLANS: AcquisitionPlan[] = [
  {
    region_id: "Taiwan Strait",
    strategic_weight: 5,
    baseline_sources: ["AIS/SAR Satellite Feed", "Ministry of Defense Daily Bulletin"],
    event_sources: ["ADIZ Scramble Comms", "PLA Live-Fire Alerts"],
    ambiguity_sources: ["Mainland Port Congestion"],
    silence_watch: { expected_signal: "Routine CS-1 Pattern", max_gap_hours: 8 },
    coverage_status: "sufficient"
  },
  {
    region_id: "Lake Chad Basin",
    strategic_weight: 4,
    baseline_sources: ["MODIS Water Index", "WFP Field Reports"],
    event_sources: ["Militia Radio Monitoring", "Local NGO alerts"],
    ambiguity_sources: ["Data blackouts in rural zones"],
    silence_watch: { expected_signal: "Weekly Toxicity Sampling", max_gap_hours: 168 },
    coverage_status: "insufficient"
  },
  {
    region_id: "Lunar South Pole",
    strategic_weight: 3,
    baseline_sources: ["LRO Optical", "Deep Space Network Telemetry"],
    event_sources: ["Mission Comms Decrypts", "Landing Site Optical"],
    ambiguity_sources: ["Polar Shadowing", "Comms Lag"],
    silence_watch: { expected_signal: "Rover Heartbeat Trace", max_gap_hours: 24 },
    coverage_status: "insufficient"
  }
];