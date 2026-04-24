export type ChecklistItem = { id: string; text: string; hint?: string };
export type Checklist = {
  id: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  items: ChecklistItem[];
};

export const checklists: Checklist[] = [
  // Pre-Construction Setup
  {
    id: "site-layout-marking",
    category: "Pre-Construction Setup",
    title: "Site Layout Marking",
    description: "Ensure site layout and grid lines are marked correctly.",
    duration: "1 day",
    items: [
      { id: "1", text: "Grid lines marked as per approved drawing" },
      { id: "2", text: "Centerline verified and fixed" },
      { id: "3", text: "Reference level (TBM) fixed and transferred", hint: "Check level mismatch" },
      { id: "4", text: "Boundary dimensions cross-checked" },
    ],
  },
  {
    id: "excavation",
    category: "Pre-Construction Setup",
    title: "Excavation",
    description: "Check depth, soil, and safety before proceeding.",
    duration: "1-2 days",
    items: [
      { id: "1", text: "Depth and dimensions as per drawing" },
      { id: "2", text: "Soil condition and bearing capacity checked" },
      { id: "3", text: "Side support / shoring provided if required" },
      { id: "4", text: "Bottom surface leveled and compacted" },
      { id: "5", text: "Dewatering arrangement in place if needed" },
    ],
  },
  {
    id: "pcc",
    category: "Pre-Construction Setup",
    title: "PCC (Plain Cement Concrete)",
    description: "Ensure uniform base level before footing reinforcement.",
    duration: "Half day",
    items: [
      { id: "1", text: "Base level uniform and compacted" },
      { id: "2", text: "Thickness maintained as per drawing (e.g., 75mm/100mm)" },
      { id: "3", text: "Surface leveled and finished properly" },
      { id: "4", text: "Proper curing started after initial setting" },
    ],
  },

  // Reinforcement Work
  {
    id: "reinforcement-placement",
    category: "Reinforcement Work",
    title: "Reinforcement Placement",
    description: "Validate bar diameter, spacing, and binding.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Bar diameter used as per drawing" },
      { id: "2", text: "Spacing maintained within tolerance", hint: "Warning: Verify spacing doesn't exceed limit" },
      { id: "3", text: "Bars properly tied with binding wire" },
      { id: "4", text: "Bending shape and hooks correct as per BBS" },
      { id: "5", text: "Lap length and staggering checked" },
    ],
  },
  {
    id: "cover-blocks",
    category: "Reinforcement Work",
    title: "Cover Block Placement",
    description: "Quick check for proper cover before pour.",
    duration: "Pre-pour",
    items: [
      { id: "1", text: "Cover block grade ≥ concrete grade" },
      { id: "2", text: "Correct thickness used per element (slab 20, col 40, ftg 50)" },
      { id: "3", text: "Spacing 1 m c/c (max), staggered" },
      { id: "4", text: "Tied with binding wire, not loose" },
      { id: "5", text: "Sides of beams & columns also covered" },
      { id: "6", text: "Replace any broken / chipped blocks" },
    ],
  },

  // Formwork Erection
  {
    id: "formwork-erection",
    category: "Formwork Erection",
    title: "Formwork Erection",
    description: "Ensure formwork is aligned, safe and ready before pouring.",
    duration: "1 day",
    items: [
      { id: "1", text: "Formwork aligned and plumb checked" },
      { id: "2", text: "Joints sealed properly", hint: "Risk alert: Leakage possible if gaps remain" },
      { id: "3", text: "Props and supports stable and cross-braced", hint: "Risk alert: Weak support can cause failure" },
      { id: "4", text: "Inside surface cleaned and oiled" },
    ],
  },
  {
    id: "formwork-removal",
    category: "Formwork Erection",
    title: "Formwork Removal",
    description: "Stripping sequence to avoid damage.",
    duration: "As per IS 456",
    items: [
      { id: "1", text: "Minimum age verified (sides 24h, slab 7d)" },
      { id: "2", text: "Cube test (3-day or 7-day) shows expected strength" },
      { id: "3", text: "Side shuttering removed first, props retained" },
      { id: "4", text: "Slab/beam soffit stripped only after specified period" },
      { id: "5", text: "Reshoring done for slabs above" },
      { id: "6", text: "No hammering on green concrete" },
      { id: "7", text: "Surface defects marked & rectified" },
    ],
  },

  // Concreting Work
  {
    id: "slab-concreting",
    category: "Concreting Work",
    title: "Slab Concreting",
    description: "Pre-pour to post-pour checks for RCC slab casting.",
    duration: "Full day pour",
    items: [
      { id: "1", text: "Formwork level, line & supports verified", hint: "Check with auto/laser level" },
      { id: "2", text: "Reinforcement laid as per drawing & BBS" },
      { id: "3", text: "Cover blocks placed at 1m c/c grid", hint: "20–25 mm cover" },
      { id: "4", text: "Electrical conduits & sleeves fixed" },
      { id: "5", text: "Surface cleaned, no loose binding wire / debris" },
      { id: "6", text: "Formwork wetted before pour" },
      { id: "7", text: "Slump test taken at site (75–100 mm)" },
      { id: "8", text: "Cube samples cast (1 sample / 5 m³)" },
      { id: "9", text: "Vibrator team & spare in place" },
      { id: "10", text: "Concrete placed & vibrated, no segregation" },
      { id: "11", text: "Surface finished — screed, float, trowel" },
    ],
  },
  {
    id: "column-concreting",
    category: "Concreting Work",
    title: "Column Concreting",
    description: "RCC column casting — verticality & cover critical.",
    duration: "2–4 hours per column",
    items: [
      { id: "1", text: "Column starter / kicker checked for line & level" },
      { id: "2", text: "Vertical bars plumbed, ties spacing as per drawing" },
      { id: "3", text: "Cover blocks on all 4 faces (40 mm)" },
      { id: "4", text: "Shuttering plumb checked (≤ 1:300 deviation)" },
      { id: "5", text: "Shuttering tightly clamped, no gaps" },
      { id: "6", text: "Inside of formwork oiled & cleaned" },
      { id: "7", text: "Slump test (75–125 mm)" },
      { id: "8", text: "Concrete poured in 300mm layers, vibrated" },
      { id: "9", text: "Top finished level for next pour" },
      { id: "10", text: "Side formwork stripped after 24 hr min" },
    ],
  },
  {
    id: "beam-concreting",
    category: "Concreting Work",
    title: "Beam Concreting",
    description: "Usually cast monolithic with slab — sequence & vibration matter.",
    duration: "With slab pour",
    items: [
      { id: "1", text: "Beam bottom level checked from beam soffit" },
      { id: "2", text: "Main bars, stirrups & extra top bars as per BBS" },
      { id: "3", text: "Stirrup spacing reduced near supports" },
      { id: "4", text: "Cover blocks at sides & bottom (25 mm)" },
      { id: "5", text: "Side & bottom shuttering tight, no honeycomb risk" },
      { id: "6", text: "Concrete placed beam first, then slab" },
      { id: "7", text: "Needle vibrator used along beam length" },
      { id: "8", text: "Cubes cast & slump recorded" },
    ],
  },
  {
    id: "footing",
    category: "Concreting Work",
    title: "Footing Concreting",
    description: "Isolated / combined footing checks.",
    duration: "Half day per footing",
    items: [
      { id: "1", text: "Excavation depth & dimensions verified" },
      { id: "2", text: "PCC laid (min 75mm, M10) and cured" },
      { id: "3", text: "Footing reinforcement mat as per drawing" },
      { id: "4", text: "Cover blocks 50 mm at bottom" },
      { id: "5", text: "Column starter bars tied, plumb checked" },
      { id: "6", text: "Shuttering line & level checked" },
      { id: "7", text: "Slump test & cube samples" },
      { id: "8", text: "Concrete poured & vibrated thoroughly" },
      { id: "9", text: "Top surface roughened for column joint" },
    ],
  },

  // Masonry
  {
    id: "brickwork",
    category: "Masonry",
    title: "Brickwork",
    description: "Guides execution of brick work with focus on alignment and mortar.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Line & level maintained" },
      { id: "2", text: "Mortar ratio correct as per specification" },
      { id: "3", text: "Joint thickness uniform (approx 10mm)" },
      { id: "4", text: "Bricks soaked in water before use" },
      { id: "5", text: "Proper bonding (e.g., English bond) followed" },
    ],
  },
  {
    id: "blockwork",
    category: "Masonry",
    title: "Blockwork",
    description: "Guides execution of AAC/concrete block work.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Line & level maintained" },
      { id: "2", text: "Block jointing adhesive mixed properly" },
      { id: "3", text: "Joint thickness uniform (2-3mm for adhesive)" },
      { id: "4", text: "Coping / bond lintel provided at sill/lintel level" },
    ],
  },

  // Finishing Work
  {
    id: "plastering",
    category: "Finishing Work",
    title: "Plastering",
    description: "Ensures quality internal and external plastering.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Surface cleaned and hacked for grip" },
      { id: "2", text: "Bull marks / level buttons placed" },
      { id: "3", text: "Mortar mix ratio correct" },
      { id: "4", text: "Thickness checked (internal 12-15mm, external 20mm)" },
      { id: "5", text: "Curing started next day (min 7 days)" },
    ],
  },
  {
    id: "flooring",
    category: "Finishing Work",
    title: "Flooring / Tiling",
    description: "Checks for floor preparation and tile laying.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Base surface cleaned and prepared" },
      { id: "2", text: "Level and slope checked (for wet areas)" },
      { id: "3", text: "Tiles aligned properly, patterns matched" },
      { id: "4", text: "Spacers used for uniform joints" },
      { id: "5", text: "Grouting done properly after 24 hours" },
    ],
  },
  {
    id: "painting",
    category: "Finishing Work",
    title: "Painting",
    description: "Checks for surface preparation and painting coats.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Surface cleaned, dry, and free from dust/grease" },
      { id: "2", text: "Putty applied and sanded smooth" },
      { id: "3", text: "Primer applied uniformly" },
      { id: "4", text: "First coat of paint applied and dried" },
      { id: "5", text: "Final coat of paint applied with uniform finish" },
    ],
  },

  // Waterproofing
  {
    id: "waterproofing",
    category: "Waterproofing",
    title: "Waterproofing",
    description: "Ensures leak-proof construction in wet areas/terraces.",
    duration: "3-5 days",
    items: [
      { id: "1", text: "Surface completely cleaned and dust-free" },
      { id: "2", text: "Cracks and joints sealed properly" },
      { id: "3", text: "Base primer/chemical applied properly" },
      { id: "4", text: "Required number of coats applied with proper curing interval" },
      { id: "5", text: "Ponding test completed (min 48 hours without leakage)" },
    ],
  },

  // Quality Control
  {
    id: "cube-test",
    category: "Quality Control",
    title: "Cube Test",
    description: "Record and validate concrete compressive strength.",
    duration: "7/28 days",
    items: [
      { id: "1", text: "Cube samples taken as per sampling frequency" },
      { id: "2", text: "Moulds correctly sized, oiled, and filled in layers" },
      { id: "3", text: "Proper curing of cubes done in curing tank" },
      { id: "4", text: "7-day test performed and results recorded" },
      { id: "5", text: "28-day test performed and results recorded" },
    ],
  },
  {
    id: "level-checking",
    category: "Quality Control",
    title: "Level Checking",
    description: "Validation of site levels across different stages.",
    duration: "Ongoing",
    items: [
      { id: "1", text: "Instrument (Auto level/Total station) calibrated" },
      { id: "2", text: "TBM established and verified" },
      { id: "3", text: "Slab/beam bottom levels verified before pour" },
      { id: "4", text: "Finished floor levels (FFL) marked correctly" },
    ],
  },
  {
    id: "curing",
    category: "Quality Control",
    title: "Curing Routine",
    description: "Daily curing routine for fresh concrete.",
    duration: "Min 7 days",
    items: [
      { id: "1", text: "Curing started within 24 hr of casting" },
      { id: "2", text: "Surface kept continuously moist (not just damp)" },
      { id: "3", text: "Ponding for slabs (min 25mm water)" },
      { id: "4", text: "Hessian / gunny bags wrapped on columns & beams" },
      { id: "5", text: "Spray water 3–4 times daily" },
      { id: "6", text: "Curing log maintained — start & end dates" },
      { id: "7", text: "Min 7 days OPC / 10 days PPC" },
    ],
  },
  {
    id: "slump-test",
    category: "Quality Control",
    title: "Slump Test",
    description: "Workability check at every concrete delivery.",
    duration: "5 minutes",
    items: [
      { id: "1", text: "Cone & base plate cleaned & wetted" },
      { id: "2", text: "Cone placed on level non-absorbent surface" },
      { id: "3", text: "Filled in 3 equal layers" },
      { id: "4", text: "Each layer tamped 25 times with 16mm rod" },
      { id: "5", text: "Top struck off level with trowel" },
      { id: "6", text: "Cone lifted vertically in 5–10 seconds" },
      { id: "7", text: "Subsidence measured & recorded" },
      { id: "8", text: "Result within spec range — accept / reject load" },
    ],
  },

  // Safety
  {
    id: "safety-checks",
    category: "Safety",
    title: "Daily Safety Checks",
    description: "Ensures site safety compliance and risk mitigation.",
    duration: "Daily",
    items: [
      { id: "1", text: "Helmet worn by all personnel", hint: "Critical: No entry without helmet" },
      { id: "2", text: "Safety shoes and high-vis vests used" },
      { id: "3", text: "Scaffolding properly erected with guardrails" },
      { id: "4", text: "Safety harnesses used for work at height (>2m)" },
      { id: "5", text: "No exposed electrical hazards / naked wires" },
      { id: "6", text: "First aid kit accessible and stocked" },
    ],
  },

  // Daily Site Routine
  {
    id: "daily-routine",
    category: "Daily Site Routine",
    title: "Daily Progress & Routine",
    description: "Tracks daily site progress, issues, and checks.",
    duration: "Daily",
    items: [
      { id: "1", text: "Labour attendance and deployment recorded" },
      { id: "2", text: "Work progress visually checked against schedule" },
      { id: "3", text: "Material received and stock updated" },
      { id: "4", text: "Quality visually verified for ongoing tasks" },
      { id: "5", text: "Safety walk done around the site" },
      { id: "6", text: "Any delays or issues noted in daily log" },
    ],
  },
];
