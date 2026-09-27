import gasTurbineHero from "@/assets/gas-turbine-hero.png";
import steamTurbineHero from "@/assets/steam-turbine-hero.png";
import gt9f04 from "@/assets/ps/gt-9f04.png";
import stA650 from "@/assets/ps/st-a650.png";
import auxPiping3d from "@/assets/ps/aux-piping-3d.png";
import skidModule from "@/assets/ps/skid-module.jpg";
import skidTower from "@/assets/ps/aux-skid-tower.jpg";
import skidCabinet from "@/assets/ps/skid-cabinet.jpg";
import accessoryModule from "@/assets/ps/accessory-module.jpg";
import welding from "@/assets/ps/welding.jpg";
import repCombustionCaps from "@/assets/ps/repair/combustion-caps.jpg";
import repFuelNozzles from "@/assets/ps/repair/fuel-nozzles.jpg";
import repTransitionPieces from "@/assets/ps/repair/transition-pieces.jpg";
import repCombustionLiner from "@/assets/ps/repair/combustion-liner.jpg";
import repPowerNozzles from "@/assets/ps/repair/power-nozzles.jpg";
import repShrouds from "@/assets/ps/repair/shrouds.jpg";
import workshop from "@/assets/ps/workshop.jpg";
import markviCabinet from "@/assets/ps/markvi-cabinet.png";
import controlCabinets from "@/assets/ps/control-cabinets.jpg";
import controlHall from "@/assets/ps/control-hall.jpg";
import dcsCabinets from "@/assets/ps/dcs-cabinets.jpg";
import telecomCabinet from "@/assets/ps/telecom-cabinet.jpg";
import gis from "@/assets/ps/gis.jpg";
import ais from "@/assets/ps/ais.jpg";
import circuitBreaker from "@/assets/ps/circuit-breaker.jpg";
import disconnector from "@/assets/ps/disconnector.jpg";
import substationAerial from "@/assets/ps/substation-aerial.jpg";
import gridSubstationAerial from "@/assets/ps/grid-substation-aerial.png";
import gridAisValley from "@/assets/ps/grid-ais-valley.png";
import digitalEnergy from "@/assets/ps/digital-energy.png";
import lm2500 from "@/assets/ps/lm2500.jpg";
import auxGasTurbinePiping from "@/assets/ps/auxiliary/gas-turbine-piping.png";
import auxAtomizingAir from "@/assets/ps/auxiliary/atomizing-air-piping.png";
import auxCoolingSealing from "@/assets/ps/auxiliary/cooling-sealing-air-piping.png";
import auxFuelNozzlePurge from "@/assets/ps/auxiliary/fuel-nozzle-purge.png";
import auxLubeOilFeed from "@/assets/ps/auxiliary/lube-oil-feed-drain.png";
import auxCoolingExhaust from "@/assets/ps/auxiliary/cooling-air-exhaust-frame.png";
import auxCompressorWash from "@/assets/ps/auxiliary/compressor-wash-piping.png";
import auxExhaustPlenum from "@/assets/ps/auxiliary/exhaust-plenum-drain.png";
import auxLuboFeedBase from "@/assets/ps/auxiliary/lubo-feed-dr-base.png";
import auxCoolingWater from "@/assets/ps/auxiliary/cooling-water-turb.png";
import auxInletPlenum from "@/assets/ps/auxiliary/inlet-plenum-drain.png";
import auxLiquidFuelRecirc from "@/assets/ps/auxiliary/liquid-fuel-recirculation.png";
import auxLiquidFuelSpool from "@/assets/ps/auxiliary/liquid-fuel-management-spool.png";
import auxDistillateFuel from "@/assets/ps/auxiliary/distillate-fuel-forwarding.png";
import auxWaterWash from "@/assets/ps/auxiliary/water-wash-skid.png";
import auxWaterInjection from "@/assets/ps/auxiliary/water-injection-skid.png";
import auxFuelGasSeparator from "@/assets/ps/auxiliary/fuel-gas-absolute-separator.png";


export const psImages = {
  gt9f04: gt9f04,
  stA650: stA650,
  auxPiping3d: auxPiping3d,
  skidModule: skidModule,
  skidTower: skidTower,
  skidCabinet: skidCabinet,
  accessoryModule: accessoryModule,
  welding: welding,
  workshop: workshop,
  markviCabinet: markviCabinet,
  controlCabinets: controlCabinets,
  controlHall: controlHall,
  dcsCabinets: dcsCabinets,
  telecomCabinet: telecomCabinet,
  gis: gis,
  ais: ais,
  circuitBreaker: circuitBreaker,
  disconnector: disconnector,
  substationAerial: substationAerial,
  digitalEnergy: digitalEnergy,
  lm2500: lm2500,
};

export type PsCategory = "Products" | "Technologies & Solutions" | "Services";

export interface SpecColumn {
  /** Configuration name, e.g. "Simple Cycle" */
  name: string;
  rows: { label: string; value: string }[];
}

export interface ListItem {
  name: string;
  description?: string;
  image?: string;
  /** MLI / SKID reference code shown in table layout */
  code?: string;
  /** Long-form overview content shown when the item is selected */
  detail?: string;
}

export interface ItemGroup {
  title: string;
  intro?: string;
  items: ListItem[];
  /** Render as image cards instead of a compact list */
  visual?: boolean;
  /** Show visual card images fully (contain) instead of cropping them */
  imageContain?: boolean;
  /** Render as a reference table (code / description / illustration) */
  table?: boolean;
  /** Label for the first table column */
  codeLabel?: string;
}


export interface ProductEntry {
  slug: string;
  name: string;
  /** Short model / range label shown under the name in grids */
  model?: string;
  category: PsCategory;
  summary: string;
  heroImage: string;
  heroAlt: string;
  /** Optional cut-out product illustration used in the overview block */
  showcaseImage?: string;
  showcaseAlt?: string;
  showcaseContained?: boolean;
  paragraphs: string[];
  /** Headline figures rendered as spec cards */
  keyFigures?: { label: string; value: string }[];
  specTable?: { title: string; columns: SpecColumn[] };
  groups?: ItemGroup[];
  badges?: string[];
  /** Optional schema / diagram block rendered with an animated ring */
  schema?: { image: string; alt: string; title?: string; caption?: string };
}

export const products: ProductEntry[] = [
  {
    slug: "gas-turbines",
    name: "Gas Turbines",
    model: "9F.04",
    category: "Products",
    summary:
      "Fast-start, fuel-flexible 9F.04 gas turbines for simple and combined cycle power generation.",
    heroImage: gasTurbineHero,
    heroAlt: "9F.04 gas turbine with advanced energy visualization",
    showcaseImage: gt9f04,
    showcaseAlt: "9F.04 gas turbine",
    showcaseContained: true,
    paragraphs: [
      "The 9F.04 gas turbines offer significantly faster startup times — up to 20 minutes in simple cycle and 30 minutes in combined cycle — along with improved availability and fuel flexibility, as well as enhanced resilience against grid disturbances and transient loads.",
      "All 9F gas turbines come equipped with a three-stage hot gas path (HGP) system. Each 9F.04 gas turbine features Advanced Gas Path functionalities, and enhanced materials ensuring improved cooling and longer part durability.",
      "The 9F.04 gas turbine is well-suited for combined cycle applications, offering high reliability and availability, and achieving a 35% reduction in base load while meeting emission standards.",
    ],
    keyFigures: [
      { label: "Simple cycle output", value: "288 MW" },
      { label: "Combined cycle 2x1 output", value: "889 MW" },
      { label: "Combined cycle efficiency", value: "60.4%" },
      { label: "Simple cycle startup", value: "23 min" },
    ],
    specTable: {
      title: "9F.04 gas turbine technical specifications",
      columns: [
        {
          name: "Simple Cycle",
          rows: [
            { label: "Net output", value: "288 MW" },
            { label: "Net efficiency", value: "38.7%" },
            { label: "Ramp rate", value: "23 MW/min" },
            { label: "Startup time", value: "23 min" },
          ],
        },
        {
          name: "Combined Cycle 1x1",
          rows: [
            { label: "Net output", value: "443 MW" },
            { label: "Net efficiency", value: "60.2%" },
            { label: "Ramp rate", value: "22 MW/min" },
            { label: "Startup time", value: "30 min" },
          ],
        },
        {
          name: "Combined Cycle 2x1",
          rows: [
            { label: "Net output", value: "889 MW" },
            { label: "Net efficiency", value: "60.4%" },
            { label: "Ramp rate", value: "44 MW/min" },
            { label: "Startup time", value: "39 min" },
          ],
        },
      ],
    },
  },
  {
    slug: "steam-turbines",
    name: "Steam Turbines",
    model: "STF-A650",
    category: "Products",
    summary:
      "Reheating steam turbines for high-parameter renewable steam, combined cycle and cogeneration applications.",
    heroImage: steamTurbineHero,
    heroAlt: "GEAT advanced steam turbine technology with energy visualization",
    showcaseImage: stA650,
    showcaseAlt: "STF-A650 steam turbine",
    showcaseContained: true,
    paragraphs: [
      "The STF-A650 reheating steam turbines offer exceptional competitive performance for high-parameter renewable steam and combined cycle applications, utilizing GE's latest generation of 3D reaction blades, advanced rear stages, and high-performance sealing technology with gland and inter-stage seals.",
      "A versatile platform optimized for high-parameter concentrated solar power applications as well as advanced combined cycle steam tails and high-efficiency industrial cogeneration applications in 50 or 60 Hz grids.",
      "Robust and versatile turbines with a successful track record of over 30 years.",
    ],
    keyFigures: [
      { label: "Net output efficiency", value: "up to 48%" },
      { label: "Output range", value: "100–300 MW" },
      { label: "Main steam pressure", value: "190 bar" },
      { label: "Track record", value: "30+ years" },
    ],
  },
  {
    slug: "auxiliaries",
    name: "Auxiliaries",
    model: "Piping & Skids",
    category: "Products",
    summary:
      "Piping systems and SKID module assemblies for the 9F.04 gas turbine, welded and assembled at GEAT.",
    heroImage: skidModule,
    heroAlt: "GEAT auxiliary skid module assembly",
    showcaseImage: auxPiping3d,
    showcaseAlt: "9F.04 auxiliary piping and skid layout",
    showcaseContained: true,
    paragraphs: [
      "The welding and assembly process of the gas turbine type 9F.04 auxiliaries, including piping systems and SKID module assemblies, are of major importance in optimizing the performance of turbines used in power generation.",
      "The function of auxiliary systems is highly diverse, ranging from ensuring smooth startup of the gas turbine, providing effective lubrication & cooling, meticulous monitoring, precise control, and managing fuel supply effectively. These auxiliary systems are essential for maintaining reliable, secure, and efficient operation of gas turbines, thereby significantly contributing to continuous and optimal power generation.",
    ],
    groups: [
      {
        title: "Piping products",
        intro:
          "Piping systems welded and assembled at GEAT for the 9F.04 gas turbine, referenced by MLI code.",
        table: true,
        codeLabel: "MLI",
        items: [
          { code: "962", name: "Gas Turbine Piping", image: auxGasTurbinePiping },
          { code: "965", name: "Atomizing air piping", image: auxAtomizingAir },
          { code: "909", name: "Cooling & Sealing air piping", image: auxCoolingSealing },
          { code: "918", name: "Fuel nozzle purge", image: auxFuelNozzlePurge },
          { code: "906", name: "Lube Oil Feed & Drain", image: auxLubeOilFeed },
          { code: "972", name: "Cooling air Exhaust Frame", image: auxCoolingExhaust },
          { code: "953", name: "Compressor Wash piping", image: auxCompressorWash },
          { code: "976", name: "Exhaust Plenum drain piping", image: auxExhaustPlenum },
          { code: "905", name: "Lubo Feed & DR Base piping", image: auxLuboFeedBase },
          { code: "915", name: "Cooling Water turb", image: auxCoolingWater },
          { code: "979", name: "Inlet Plenum Drain", image: auxInletPlenum },
        ],
      },
      {
        title: "Skids",
        intro:
          "SKID module assemblies produced at GEAT, referenced by SKID code.",
        table: true,
        codeLabel: "SKID",
        items: [
          {
            code: "969S",
            name: "Liquid Fuel Recirculation Module",
            description:
              "Maintains pressure and manages injection to ensure optimal operation, providing operational flexibility to adapt to varying operating conditions.",
            image: auxLiquidFuelRecirc,
          },
          {
            code: "A246",
            name: "Liquid Fuel Management Spool",
            description:
              "Ensures optimal operation by regulating fuel flow, guaranteeing optimization and efficiency by controlling emissions and adjusting output power.",
            image: auxLiquidFuelSpool,
          },
          {
            code: "A245",
            name: "Distillate Fuel Forwarding Skid",
            description:
              "Efficiently routes distilled fuel to the turbine, ensuring smooth and reliable fuel supply for optimal turbine operation.",
            image: auxDistillateFuel,
          },
          {
            code: "E025",
            name: "Water Wash Skid",
            description:
              "Cleans internal turbine components using pressurized water and detergent, eliminating dirt and contaminant deposits that could compromise performance.",
            image: auxWaterWash,
          },
          {
            code: "A035",
            name: "Water Injection Skid",
            description:
              "Injects water into the combustion chamber to cool the gases and reduce NOx emissions, enhancing output power by optimizing combustion efficiency.",
            image: auxWaterInjection,
          },
          {
            code: "G015",
            name: "Fuel Gas Absolute Separator",
            description:
              "Ensures the purity of the gas feeding the turbine by removing contaminants such as water and solid particles, protecting internal components and extending part lifespan.",
            image: auxFuelGasSeparator,
          },
          { code: "G002", name: "Fuel Gas Scrubber" },
          { code: "A160", name: "Accessory Module", image: accessoryModule },
          { code: "A162", name: "Liquid Fuel Atomizing Air Skid" },
          { code: "PR20", name: "Combined Lub & Hyd Oil Module" },
        ],
      },

      {
        title: "Manufacturing at GEAT",
        visual: true,
        items: [
          { name: "Skid assembly", image: skidModule },
          { name: "Fuel gas separation module", image: skidTower },
          { name: "Accessory module", image: accessoryModule },
          { name: "Welding & assembly", image: welding },
        ],
      },
    ],
  },
  {
    slug: "control-systems",
    name: "Control Systems",
    model: "SPEEDTRONIC Mark VI",
    category: "Technologies & Solutions",
    summary:
      "Integrated control, protection and monitoring for gas and steam turbines, assembled and certified at GEAT.",
    heroImage: controlHall,
    heroAlt: "GEAT control cabinet assembly line",
    showcaseImage: markviCabinet,
    showcaseAlt: "SPEEDTRONIC Mark VI control cabinet",
    showcaseContained: true,
    paragraphs: [
      "The SPEEDTRONIC Mark VI turbine control is designed as a complete integrated control, protection, and monitoring system for generator and mechanical drive applications of gas and steam turbines. It is also an ideal platform for integrating all power island and balance-of-plant controls.",
    ],
    badges: ["CE marking", "SIL 3 certification"],
    groups: [
      {
        title: "Control platforms",
        items: [
          {
            name: "Mark-VI-e TG (A014)",
            description: "Flexible control system for gas turbine — 8 cabinets",
          },
          {
            name: "Mark-VI-es TV (HALS)",
            description: "Safety control system for steam turbine — 2 cabinets",
          },
          {
            name: "Mark-VI-es TG (A314)",
            description: "Functional safety system for gas turbine — 3 cabinets",
          },
          {
            name: "Mark-VI-e TV (HALO)",
            description: "Control platform for steam turbine — 5 cabinets",
          },
        ],
      },
      {
        title: "Assembly & testing at GEAT",
        visual: true,
        items: [
          { name: "Cabinet wiring", image: controlCabinets },
          { name: "Control panel line", image: controlHall },
        ],
      },
    ],
  },
  {
    slug: "grid-solutions",
    name: "Grid Solutions",
    category: "Technologies & Solutions",
    summary:
      "Protection and telecommunication cabinets, gas-insulated switchgear, air-insulated substations and high-voltage devices.",
    heroImage: gridSubstationAerial,
    heroAlt: "Aerial view of a high-voltage substation",
    paragraphs: [
      "GEAT delivers grid equipment for substations: DCS & protection cabinets, telecommunication cabinets, gas-insulated switchgear, air-insulated substations, disconnectors and circuit breakers.",
      "DCS & Protection cabinets continuously monitor electrical parameters and trigger appropriate protection devices during failures or abnormal conditions. Telecommunication cabinets provide real-time monitoring, remote control and communication of essential data within substations.",
      "GIS uses high-voltage equipment enclosed in a sealed metal enclosure filled with insulating gas and provides a compact, safe and reliable solution. AIS uses air as the insulating medium between different parts of the installation.",
    ],
    groups: [
      {
        title: "Grid products",
        visual: true,
        items: [
          {
            name: "DCS & Protection Cabinets",
            description:
              "Continuously monitor electrical parameters and trigger appropriate protection devices during failures or abnormal conditions.",
            image: dcsCabinets,
            detail:
              "The role of DCS & Protection cabinets is to continuously monitor the electrical parameters of the system and trigger appropriate protection devices in case of failure or abnormal conditions. This may include activating circuit breakers to isolate faulty parts of the system, closing disconnectors to redirect the current to alternative paths, or even sending alarm signals to alert in case of a problem.",
          },
          {
            name: "Telecommunication Cabinets",
            description:
              "Real-time monitoring, remote control and communication of essential data within substations.",
            image: telecomCabinet,
            detail:
              "Telecommunication cabinets in electrical substations provide real time monitoring, remote control, and communication of essential data within the substation and with adjacent substations. This optimizes the management and security of the electrical network.",
          },
          {
            name: "Gas-Insulated Switchgear (GIS)",
            description:
              "High-voltage equipment enclosed in a sealed metal enclosure filled with insulating gas — a compact, safe and reliable solution.",
            image: gis,
            detail:
              "Gas-insulated switchgear (GIS) substations are electrical substations where high-voltage equipment is enclosed in a sealed metal enclosure filled with insulating gas, usually sulfur hexafluoride (SF6). They are compact, safe, reliable, and require less maintenance compared to conventional air-insulated substations (AIS).",
          },
          {
            name: "Air-Insulated Substation (AIS)",
            description:
              "Air is used as the insulating medium between the different parts of the installation.",
            image: gridAisValley,
            detail:
              "Air-insulated substations, in which air is used as the insulating medium between different parts of the installation, are called air-insulated switchgear (AIS). Due to the electrical properties of air, unlike SF6, for example, these installations require a lot of space and are therefore much larger than gas insulated substations.",
          },
          {
            name: "Disconnector",
            description:
              "Isolates a specific section of the network to facilitate maintenance and repair operations.",
            image: disconnector,
            detail:
              "A disconnector in an air-insulated substation (AIS) is a device used to isolate a specific section of the electrical network to facilitate maintenance and repair operations, while ensuring the safety of technicians and equipment.",
          },
          {
            name: "Circuit Breaker",
            description:
              "Protects the network by detecting and automatically interrupting overloads and short circuits.",
            image: circuitBreaker,
            detail:
              "In an Air Insulated Switchgear (AIS) electrical substation, the circuit breaker's primary role is to protect the electrical network by detecting and automatically interrupting overloads and short circuits. It also facilitates circuit isolation and contributes to equipment safety.",
          },
        ],
      },
    ],
  },
  {
    slug: "digital-solutions",
    name: "Digital Solutions",
    model: "Digital Energy",
    category: "Technologies & Solutions",
    summary:
      "Advanced energy and distribution management, power plant digitization, WAMS and analytics.",
    heroImage: controlHall,
    heroAlt: "GEAT digital energy control environment",
    showcaseImage: digitalEnergy,
    showcaseAlt: "Network level optimization: analytics, orchestration, optimization",
    showcaseContained: true,
    paragraphs: [
      "Deployment of the Advanced Energy Management System (AEMS) and Advanced Distribution Management System (ADMS) to enhance the efficiency and reliability of dispatching and transmission & distribution operations.",
      "Digitization of the power plant management and monitoring system, integrating WAMS, renewable energy sources, and enterprise-scale analytics for real-time insight and control.",
    ],
    groups: [
      {
        title: "Digital energy portfolio",
        items: [
          { name: "Advanced Energy Management System (AEMS)" },
          { name: "Advanced Distribution Management System (ADMS)" },
          { name: "Power plant digitization" },
          { name: "WAMS" },
          { name: "Renewable energy integration" },
          { name: "Analytics" },
        ],
      },
      {
        title: "Proof points",
        intro: "Validated outcomes from digital energy deployments worldwide.",
        items: [
          { name: "Early detection with WAMS of oscillation 30 minutes before power outage." },
          { name: "Up to 18 GW of demand response in the US RTO." },
          { name: "In many European utilities, renewable energies represent over 50% of the total production supply." },
          { name: "Rapid frequency response with WAMS." },
          { name: "DLR up to 25% additional usable capacity (DOE 2014 source)." },
          { name: "Optimal asset maintenance." },
          { name: "OSM: Over 100,000 changes per year for a US public utility client." },
          { name: "From 300 controls to over 600 per day for an Australian public utility client." },
          { name: "Faster state-estimator convergence, increased observability and complete phasor angles." },
        ],
      },
    ],
  },
  {
    slug: "repair-services",
    name: "Repair Services",
    model: "9F.04 hot parts",
    category: "Services",
    summary:
      "Repair service center for the hot parts of 9F.04 gas turbines.",
    heroImage: welding,
    heroAlt: "GEAT welding and repair operations",
    paragraphs: [
      "Repair service center for the hot parts of 9F.04 gas turbines: fuel nozzles, combustion caps, transition pieces, combustion liners, power nozzles 1st, 2nd and 3rd stage, shrouds 1st, 2nd and 3rd stage.",
      "In addition to repair through TIG/MIG welding and brazing processes, new special processes are implemented to enable repairs using high technologies in the field of plasma & HVOF coating, heat treatment, EDM machining, and three-dimensional measurement for quality control of repairs.",
    ],
    keyFigures: [
      { label: "Hot part families repaired", value: "6" },
      { label: "Turbine stages covered", value: "3" },
      { label: "Repair technologies", value: "7" },
    ],
    groups: [
      {
        title: "Repair components",
        intro: "Hot gas path components repaired and requalified in the GEAT repair center.",
        visual: true,
        imageContain: true,
        items: [
          { name: "Combustion Caps", image: repCombustionCaps },
          { name: "Fuel Nozzles", image: repFuelNozzles },
          { name: "Transition Pieces", image: repTransitionPieces },
          { name: "Combustion Liners", image: repCombustionLiner },
          { name: "Power Nozzles", description: "1st, 2nd and 3rd stage", image: repPowerNozzles },
          { name: "Shrouds", description: "1st, 2nd and 3rd stage", image: repShrouds },
        ],
      },
      {
        title: "Repair technologies",
        items: [
          { name: "TIG/MIG welding" },
          { name: "Brazing" },
          { name: "Plasma coating" },
          { name: "HVOF coating" },
          { name: "Heat treatment" },
          { name: "EDM machining" },
          { name: "3D measurement for quality control" },
        ],
      },
    ],
  },
  {
    slug: "power-plant-maintenance",
    name: "Power Plant Maintenance",
    category: "Services",
    summary:
      "Turbine maintenance, inspection, repair, overhaul and I&C support for power plants.",
    heroImage: workshop,
    heroAlt: "GEAT maintenance operations in the workshop",
    paragraphs: [
      "GEAT supports power plant operators with turbine maintenance, inspection, repair, overhaul, exchange and instrumentation & control services.",
    ],
    groups: [
      {
        title: "Maintenance capabilities",
        items: [
          { name: "Level I and II turbine maintenance" },
          { name: "Inspection" },
          { name: "Repair" },
          { name: "Overhaul" },
          { name: "Exchange / replacement" },
          { name: "I&C troubleshooting" },
          { name: "MKVIe start-up" },
        ],
      },
    ],
  },
  {
    slug: "aero-derivative-turbine-services",
    name: "Aero-Derivative Turbine Services",
    model: "LM2500",
    category: "Services",
    summary: "Maintenance service for L1 and L2 Aero-Derivative LM2500.",
    heroImage: lm2500,
    heroAlt: "LM2500 aero-derivative turbine under maintenance at GEAT",
    showcaseImage: lm2500,
    showcaseAlt: "LM2500 aero-derivative turbine",
    paragraphs: [
      "Maintenance service for L1 and L2 Aero-Derivative LM2500.",
      "I&C troubleshooting and MKVIe start up.",
    ],
    groups: [
      {
        title: "Services",
        items: [
          { name: "Level 1 inspection" },
          { name: "Level 2 inspection" },
          { name: "Repair" },
          { name: "Overhaul" },
          { name: "Exchange / replacement" },
        ],
      },
      {
        title: "Supported components",
        items: [
          { name: "Lube & scavenge pump" },
          { name: "Magnetic detector plug" },
          { name: "Igniter plug and ignition lead" },
          { name: "Thermocouple probe" },
          { name: "Power turbine inlet pressure probe" },
          { name: "RTD" },
          { name: "Accelerometer" },
          { name: "Gas generator speed sensor" },
          { name: "Power turbine speed transducer" },
          { name: "Pneumatic starter" },
          { name: "Hydraulic starter" },
          { name: "Flame sensor" },
          { name: "Hydraulic pump" },
          { name: "VSV controller" },
          { name: "HCU" },
          { name: "HPC discharge temperature sensor" },
          { name: "Accessory gearbox" },
          { name: "Radial drive shaft" },
          { name: "Inlet gearbox" },
          { name: "Compressor front frame" },
          { name: "A-sump components" },
          { name: "Turbine mid frame" },
          { name: "C-sump components" },
          { name: "Combustion chamber" },
        ],
      },
    ],
  },
];

export const psCategories: { name: PsCategory; description: string }[] = [
  {
    name: "Products",
    description:
      "Gas turbines, steam turbines and auxiliary piping and skid systems.",
  },
  {
    name: "Technologies & Solutions",
    description:
      "Turbine control systems, grid equipment and digital energy platforms.",
  },
  {
    name: "Services",
    description:
      "Hot parts repair, power plant maintenance and aero-derivative turbine support.",
  },
];

export const getProduct = (slug?: string) =>
  products.find((p) => p.slug === slug);

export const psPath = (slug: string) => `/products-services/${slug}`;
