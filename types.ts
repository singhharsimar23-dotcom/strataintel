
import React from 'react';

export type Severity = 'low' | 'medium' | 'high';
export type Domain = 'military' | 'energy' | 'finance' | 'tech' | 'governance' | 'social' | 'environment' | 'space' | 'health' | 'infrastructure' | 'biosecurity';
export type NodeStatus = 'white' | 'green' | 'yellow' | 'red';
export type ThreatType = 'kinetic_war' | 'frozen_conflict' | 'cyber_warfare' | 'hybrid_warfare' | 'economic_warfare' | 'proxy_conflict' | 'nuclear_deterrence' | 'internal_security_collapse' | 'climate_catastrophe' | 'resource_scarcity' | 'epidemic_outbreak' | 'satellite_denial' | 'civil_unrest' | 'biosecurity_breach' | 'orbital_conflict' | 'seabed_mining_dispute';

export interface HistoryEvent {
  date: string;
  event: string;
  impact: string;
}

export interface NodeAcquisitionPlan {
  baseline_sources: string[];
  event_sources: string[];
  ambiguity_sources: string[];
  expected_signal: string;
  max_gap_hours: number;
}

export interface NodeSolution {
  long_term_strategy: string;
  tactical_steps: string[];
  key_stakeholders: string[];
  resource_requirements: string;
  success_metrics: string[];
  feasibility_score: number;
}

export interface InvestmentRecommendation {
  rank: number;
  problem_summary: string;
  target_industry: string;
  tickers: { symbol: string; company: string; rationale: string }[];
  projected_upside: string;
  confidence_score: number;
  time_horizon: string;
  risk_rating: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface GlobalInvestmentIntelligence {
  summary: string;
  top_5_opportunities: InvestmentRecommendation[];
}

export interface SignalAnalysis {
  contradiction_detection?: string;
  threshold_proximity?: string;
  slow_decay_indicators?: string;
  narrative_power_shifts?: string;
  cross_domain_cascade_paths?: string;
  strategic_silence?: string;
  time_compression?: string;
  capability_drift?: string;
  false_stability_risk?: string;
  forward_pressure_conditions?: string;
  time_to_effect?: string;
  risk_posture?: string;
  primary_drivers?: string[];
  confidence?: number;
  review_horizon?: 'hours' | 'days' | 'weeks' | 'months';
  country_center?: { lat: number; lng: number };
  economic_impact?: {
    gdp_drag_bps: number;
    global_trade_friction_index: number; 
    affected_sectors: { sector: string; impact_score: number; delta: string }[];
  };
  alpha_thesis?: {
    strategy: string;
    instruments: string[];
    potential_roi: string;
    liquidity_risk: 'low' | 'medium' | 'high';
    trade_rationale: string;
  };
  history?: HistoryEvent[];
  acquisition_plan?: NodeAcquisitionPlan;
  practical_solution?: NodeSolution;
}

export interface ThreatNode {
  threat_node_id: string;
  region_id: string;
  lat: number;
  lng: number;
  threat_type: ThreatType;
  active_since: string;
  intensity: 'low' | 'medium' | 'high';
  primary_actors: string[];
  domains: Domain[];
  persistence_reason: string;
  analysis?: SignalAnalysis;
  status: NodeStatus;
  review_interval: 'days' | 'weeks' | 'months';
}

export interface Signal {
  signal_id: string;
  region_id: string;
  lat: number;
  lng: number;
  domain: Domain;
  severity: Severity;
  strategic_weight: 1 | 2 | 3 | 4 | 5;
  status: NodeStatus;
  created_at: string;
  source_ids: string[];
  analysis?: SignalAnalysis;
  headline?: string;
  source_label?: string; 
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface Source {
  source_id: string;
  label: string;
  reliability: number;
}

export interface RawEvent {
  event_id: string;
  headline: string;
  timestamp: string;
}

export interface AcquisitionPlan {
  region_id: string;
  strategic_weight: 1 | 2 | 3 | 4 | 5;
  baseline_sources: string[];
  event_sources: string[];
  ambiguity_sources: string[];
  silence_watch: {
    expected_signal: string;
    max_gap_hours: number;
  };
  coverage_status: 'sufficient' | 'insufficient';
}
