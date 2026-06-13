export const CAR_BRANDS = [
  "Abarth",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Cupra",
  "Dacia",
  "Daihatsu",
  "Dodge",
  "DS",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Saab",
  "Seat",
  "Skoda",
  "Smart",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "WEY",
  "Xpeng",
] as const;

export const FUEL_TYPES = [
  "Benzin",
  "Diesel",
  "Elektro",
  "Hybrid",
  "Plug-in-Hybrid",
  "LPG",
  "Erdgas",
  "Wasserstoff",
] as const;

export const TRANSMISSION_TYPES = ["Automatik", "Schaltgetriebe"] as const;

export const EQUIPMENT_FEATURES_COL1 = [
  "ABS",
  "Armlehne",
  "Blendfreies Fernlicht",
  "CD-Player",
  "Elektrisch anklappbare Außenspiegel",
  "Elektrische Fensterheber",
  "Fernlichtassistent",
  "Garantie",
  "Head-Up-Display",
  "Lederlenkrad",
  "Lordosenstütze",
  "Multifunktionslenkrad",
  "Nichtraucherfahrzeug",
  "Reifendruckkontrolle",
  "Schlüsselloses Schließen",
  "Soundsystem",
  "Spurhalteassistent",
  "Touchscreen",
  "Verkehrszeichenerkennung",
] as const;

export const EQUIPMENT_FEATURES_COL2 = [
  "Abstandswarner",
  "Automatisch abblendender Innenspiegel",
  "Bluetooth",
  "Dieselpartikelfilter",
  "Elektrisch verstellbare Sitze",
  "Elektrische Heckklappe",
  "Freisprecheinrichtung",
  "Geschwindigkeitsbegrenzer",
  "ISOFIX",
  "Leichtmetallfelgen",
  "Massagesitze",
  "Navigationssystem",
  "Panoramadach",
  "Scheckheftgepflegt",
  "Servolenkung",
  "Speicherfunktion Sitze",
  "Start-Stopp-System",
  "Traktionskontrolle",
  "Wegfahrsperre",
] as const;

export const EQUIPMENT_FEATURES_COL3 = [
  "Ambiente-Beleuchtung",
  "Berganfahrassistent",
  "Bordcomputer",
  "Digitales Cockpit",
  "Elektrische Außenspiegel",
  "ESP",
  "Ganzjahresreifen",
  "Getönte Scheiben",
  "Kollisionsvermeidung",
  "Lichtsensor",
  "Müdigkeitserkennung",
  "Nebelscheinwerfer",
  "Regensensor",
  "Schiebedach",
  "Sitzheizung",
  "Sprachsteuerung",
  "Totwinkelassistent",
  "USB",
  "Zentralverriegelung",
] as const;

export const ALL_EQUIPMENT_FEATURES = [
  ...EQUIPMENT_FEATURES_COL1,
  ...EQUIPMENT_FEATURES_COL2,
  ...EQUIPMENT_FEATURES_COL3,
] as const;

export type EquipmentFeature = (typeof ALL_EQUIPMENT_FEATURES)[number];

export function parseYearFromFirstRegistration(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.match(/^\d{1,2}\/(\d{4})$/);
  return match ? parseInt(match[1], 10) : null;
}

export function formatFirstRegistration(month: string, year: string): string | null {
  const m = month.trim();
  const y = year.trim();
  if (!m || !y) return null;
  const monthNum = parseInt(m, 10);
  const yearNum = parseInt(y, 10);
  if (monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
    return null;
  }
  return `${String(monthNum).padStart(2, "0")}/${yearNum}`;
}

export function splitFirstRegistration(value: string | null | undefined): { month: string; year: string } {
  if (!value) return { month: "", year: "" };
  const match = value.match(/^(\d{1,2})\/(\d{4})$/);
  if (!match) return { month: "", year: "" };
  return { month: match[1], year: match[2] };
}
