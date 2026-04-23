export type Standard = {
  id: string;
  title: string;
  category: "Concrete" | "RCC" | "Curing" | "Testing" | "Formwork";
  shortValue: string;
  plain: string;
  detail: string;
  reference: string;
};

export const standards: Standard[] = [
  {
    id: "mix-ratios",
    title: "Nominal Mix Ratios",
    category: "Concrete",
    shortValue: "M15 1:2:4 · M20 1:1.5:3 · M25 1:1:2",
    plain: "Standard cement : sand : aggregate proportions for nominal mix concrete grades up to M25.",
    detail:
      "M5 → 1:5:10, M7.5 → 1:4:8, M10 → 1:3:6, M15 → 1:2:4, M20 → 1:1.5:3, M25 → 1:1:2. Above M25 always use design mix as per IS 10262.",
    reference: "IS 456:2000, Table 9 / IS 10262:2019",
  },
  {
    id: "slump-limits",
    title: "Slump Values",
    category: "Concrete",
    shortValue: "25–125 mm depending on placement",
    plain: "Workability slump range based on the type of structural element being cast.",
    detail:
      "Lightly reinforced sections (slabs, beams, walls): 25–75 mm. Heavily reinforced (columns, RCC retaining): 75–125 mm. Pavements: 20–30 mm. Mass concrete: 25–50 mm.",
    reference: "IS 456:2000, Clause 7.1",
  },
  {
    id: "wc-ratio",
    title: "Water-Cement Ratio",
    category: "Concrete",
    shortValue: "Max 0.45 – 0.55 (exposure dependent)",
    plain: "Lower w/c gives stronger, more durable concrete. Stay within the maximum for your exposure class.",
    detail:
      "Mild exposure: max 0.55. Moderate: 0.50. Severe: 0.45. Very severe: 0.45. Extreme: 0.40. Always use lowest practical value for given workability.",
    reference: "IS 456:2000, Table 5",
  },
  {
    id: "min-cement",
    title: "Minimum Cement Content",
    category: "Concrete",
    shortValue: "300 – 360 kg/m³",
    plain: "Minimum cement per cubic metre of concrete for durability based on exposure.",
    detail: "Mild: 300 kg/m³. Moderate: 300. Severe: 320. Very severe: 340. Extreme: 360 kg/m³.",
    reference: "IS 456:2000, Table 5",
  },
  {
    id: "clear-cover",
    title: "Clear Cover to Reinforcement",
    category: "RCC",
    shortValue: "20 / 25 / 40 / 50 / 75 mm",
    plain: "Minimum concrete cover protecting the steel from corrosion, by element type.",
    detail:
      "Slab: 20–25 mm. Beam: 25 mm. Column: 40 mm. Footing: 50 mm. Foundations against earth: 75 mm. Increase by 5 mm if exposure is severe.",
    reference: "IS 456:2000, Clause 26.4",
  },
  {
    id: "lap-length",
    title: "Lap Length",
    category: "RCC",
    shortValue: "Tension 50d · Compression 40d",
    plain: "Overlap distance between two rebars. 'd' = bar diameter.",
    detail:
      "Tension lap: 50 × bar dia (Fe500 with M20). Compression lap: 40 × bar dia. Stagger laps; not more than 50% of bars at one section. Avoid laps at points of max stress.",
    reference: "IS 456:2000, Clause 26.2.5",
  },
  {
    id: "dev-length",
    title: "Development Length",
    category: "RCC",
    shortValue: "Ld ≈ 47d (Fe500, M20)",
    plain: "Length of bar embedment needed to develop full design stress.",
    detail:
      "Ld = (φ × σs) / (4 × τbd). For Fe500 + M20: ~47d (tension), ~38d (compression). Increase 60% in tension if plain bars are used.",
    reference: "IS 456:2000, Clause 26.2.1",
  },
  {
    id: "curing-days",
    title: "Minimum Curing Period",
    category: "Curing",
    shortValue: "7 days OPC · 10 days PPC/PSC",
    plain: "Keep concrete continuously moist after casting to gain strength.",
    detail:
      "OPC: minimum 7 days. PPC / PSC / blended cements: minimum 10 days. Hot/dry weather: extend by 3 days. Start curing within 24 hours of casting.",
    reference: "IS 456:2000, Clause 13.5",
  },
  {
    id: "formwork-removal",
    title: "Formwork Removal Time",
    category: "Formwork",
    shortValue: "Sides 24h · Slab 7d · Beam 14–21d",
    plain: "Minimum time before stripping formwork (OPC, normal temperature).",
    detail:
      "Vertical sides of beams/columns/walls: 16–24 hours. Soffit of slab (props left): 7 days, props 14 days. Soffit of beams up to 6m: 14 days. Beams >6m / cantilevers: 21 days.",
    reference: "IS 456:2000, Clause 11.3",
  },
  {
    id: "cube-test",
    title: "Cube Test Acceptance",
    category: "Testing",
    shortValue: "Avg ≥ fck + 3 · Min ≥ fck − 3",
    plain: "Compressive strength criteria for 150mm cubes at 28 days.",
    detail:
      "Take 3 cubes per sample, test at 28 days. Mean of group of 4 consecutive samples ≥ fck + 0.825σ (or fck + 3 N/mm² for M20+). Individual result not less than fck − 3 N/mm².",
    reference: "IS 456:2000, Clause 16",
  },
  {
    id: "sampling-frequency",
    title: "Concrete Sampling Frequency",
    category: "Testing",
    shortValue: "1 sample per 1–50 m³",
    plain: "How often to take cube samples per concrete volume placed in a day.",
    detail:
      "1–5 m³: 1 sample. 6–15 m³: 2. 16–30 m³: 3. 31–50 m³: 4. >50 m³: 4 + 1 per additional 50 m³. Each sample = 3 cubes.",
    reference: "IS 456:2000, Clause 15.2.2",
  },
  {
    id: "min-steel",
    title: "Minimum & Maximum Steel",
    category: "RCC",
    shortValue: "Beam 0.85% · Column 0.8–6%",
    plain: "Limits for longitudinal steel area in RCC members.",
    detail:
      "Beam (tension): min 0.85·bd/fy, max 4% of bD. Column: min 0.8%, max 6% (4% practical). Slab: 0.12% of gross area (HYSD), 0.15% (mild steel).",
    reference: "IS 456:2000, Clauses 26.5",
  },
  {
    id: "stirrup-spacing",
    title: "Stirrup / Tie Spacing",
    category: "RCC",
    shortValue: "Beam ≤ 0.75d · Column ≤ 16φ",
    plain: "Maximum spacing between shear stirrups in beams and lateral ties in columns.",
    detail:
      "Beam: min(0.75d, 300 mm). Column ties: min(16 × smallest long. bar dia, least lateral dim, 300 mm). Reduce spacing in seismic zones (IS 13920).",
    reference: "IS 456 26.5.1.5 / IS 13920",
  },
  {
    id: "slump-test",
    title: "Slump Test Procedure",
    category: "Testing",
    shortValue: "300mm cone · 3 layers · 25 tamps",
    plain: "Standard procedure to measure concrete workability on site.",
    detail:
      "Use 300mm tall frustum cone. Fill in 3 equal layers, each tamped 25 times with 16mm rod. Lift cone vertically in 5–10 sec. Measure subsidence — that's the slump.",
    reference: "IS 1199:1959",
  },
  {
    id: "concrete-temp",
    title: "Concrete Placement Temperature",
    category: "Concrete",
    shortValue: "5°C – 40°C at placement",
    plain: "Acceptable temperature range for placing concrete.",
    detail:
      "Below 5°C: protect against freezing, use heated water. Above 40°C: ice in mix, evening pour, fog spray. Concrete temp at placement should not exceed 30°C ideally.",
    reference: "IS 7861 (Parts 1 & 2)",
  },
];
