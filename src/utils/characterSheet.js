/**
 * This file assumes you're dealing with an XML Export of the "Helden Software", v5.5.3
 * Docs: http://forum.helden-software.de
 */

const attributes = {
  Mut: { value: 0, short: "MU", name: "Mut" },
  Klugheit: { value: 0, short: "KL", name: "Klugheit" },
  Intuition: { value: 0, short: "IN", name: "Intuition" },
  Charisma: { value: 0, short: "CH", name: "Charisma" },
  Fingerfertigkeit: { value: 0, short: "FF", name: "Fingerfertigkeit" },
  Gewandtheit: { value: 0, short: "GE", name: "Gewandtheit" },
  Konstitution: { value: 0, short: "KO", name: "Konstitution" },
  Körperkraft: { value: 0, short: "KK", name: "Körperkraft" },

  ini: { value: 0, short: "ini", name: "Basis-INI" },
  at: { value: 0, short: "at", name: "Basis-AT" },
  pa: { value: 0, short: "pa", name: "Basis-PA" },
  fk: { value: 0, short: "fk", name: "Basis-FK" },
}

export function parseGeneral (xmlDocument) {
  const heroEl = xmlDocument.querySelector("held")
  const name = heroEl.getAttribute("name")
  const key = heroEl.getAttribute("key")

  const bdayEl = xmlDocument.querySelector("aussehen")
  const day = parseInt(bdayEl.getAttribute("gbtag"))
  const month = parseInt(bdayEl.getAttribute("gbmonat"))
  const year = parseInt(bdayEl.getAttribute("gbjahr"))
  const birthday = { day, month, year }

  const genderEl = xmlDocument.querySelector("geschlecht")
  const gender = genderEl.getAttribute("name")

  const profEl = xmlDocument.querySelector("ausbildung[art='Hauptprofession']")
  const profession = profEl.getAttribute("string")

  return {
    key,
    birthday,
    gender,
    name,
    profession,
  }
}

export function parseAttributes (xmlDocument) {
  const result = { ...attributes }

  for (const attribute of Object.keys(attributes)) {
    const xmlEl = xmlDocument.querySelector(`held>eigenschaften eigenschaft[name='${attribute}']`)
    if (!xmlEl) continue

    const val = xmlEl.getAttribute("value")
    const mod = xmlEl.getAttribute("mod")
    result[attribute].value = parseInt(val) + parseInt(mod)
  }
  return result
}

export const talentGroups = {
  "Gaben und anderes": {
    name: "Gaben und anderes",
    icon: "sym_r_star",
    talents: [],
  },
  Kampf: {
    name: "Kampf",
    icon: "sym_r_swords",
    talents: [
      "Anderthalbhänder",
      "Armbrust",
      "Belagerungswaffen",
      "Blasrohr",
      "Bogen",
      "Diskus",
      "Dolche",
      "Fechtwaffen",
      "Hiebwaffen",
      "Infanteriewaffen",
      "Kettenstäbe",
      "Kettenwaffen",
      "Lanzenreiten",
      "Peitsche",
      "Raufen",
      "Ringen",
      "Säbel",
      "Schleuder",
      "Schwerter",
      "Speere",
      "Stäbe",
      "Wurfbeile",
      "Wurfmesser",
      "Wurfspeere",
      "Zweihandflegel",
      "Zweihandhiebwaffen",
      "Zweihandschwerter/-säbel",
    ],
  },
  Körperlich: {
    name: "Körperlich",
    icon: "sym_r_directions_run",
    talents: [
      "Akrobatik",
      "Athletik",
      "Fliegen",
      "Gaukeleien",
      "Klettern",
      "Körperbeherrschung",
      "Reiten",
      "Schleichen",
      "Schwimmen",
      "Selbstbeherrschung",
      "Sich verstecken",
      "Singen",
      "Sinnenschärfe",
      "Skifahren",
      "Stimmen imitieren",
      "Tanzen",
      "Taschendiebstahl",
      "Zechen",
    ],
  },
  Gesellschaft: {
    name: "Gesellschaft",
    icon: "sym_r_groups",
    talents: [
      "Betören",
      "Etikette",
      "Gassenwissen",
      "Lehren",
      "Menschenkenntnis",
      "Schauspielerei",
      "Schriftlicher Ausdruck",
      "Sich verkleiden",
      "Überreden",
      "Überzeugen",
    ],
  },
  Natur: {
    name: "Natur",
    icon: "sym_r_nature",
    talents: [
      "Fährtensuchen",
      "Fallen stellen",
      "Fesseln/Entfesseln",
      "Fischen/Angeln",
      "Orientierung",
      "Wettervorhersage",
      "Wildnisleben",
    ],
  },
  Wissen: {
    name: "Wissen",
    icon: "sym_r_school",
    talents: [
      "Anatomie",
      "Baukunst",
      "Brett-/Kartenspiel",
      "Geografie",
      "Geschichtswissen",
      "Gesteinskunde",
      "Götter und Kulte",
      "Heraldik",
      "Hüttenkunde",
      "Kriegskunst",
      "Kryptographie",
      "Magiekunde",
      "Mechanik",
      "Pflanzenkunde",
      "Philosophie",
      "Rechnen",
      "Rechtskunde",
      "Sagen und Legenden",
      "Schätzen",
      "Sprachenkunde",
      "Staatskunst",
      "Sternkunde",
      "Tierkunde",
    ],
  },
  Sprachen: {
    name: "Sprachen",
    icon: "sym_r_flag",
    talents: [
    // "Sprachen kennen Alaani",
    // "Sprachen kennen Alt-Imperial/Aureliani",
    // "Sprachen kennen Altes Kemi",
    // "Sprachen kennen Angram",
    // "Sprachen kennen Asdharia",
    // "Sprachen kennen Atak",
    // "Sprachen kennen Bosparano",
    // "Sprachen kennen Drachisch",
    // "Sprachen kennen Ferkina",
    // "Sprachen kennen Füchsisch",
    // "Sprachen kennen Garethi",
    // "Sprachen kennen Goblinisch",
    // "Sprachen kennen Grolmisch",
    // "Sprachen kennen Hjaldingsch",
    // "Sprachen kennen Isdira",
    // "Sprachen kennen Koboldisch",
    // "Sprachen kennen Mahrisch",
    // "Sprachen kennen Mohisch",
    // "Sprachen kennen Molochisch",
    // "Sprachen kennen Neckergesang",
    // "Sprachen kennen Nujuka",
    // "Sprachen kennen Oloarkh",
    // "Sprachen kennen Ologhaijan",
    // "Sprachen kennen Rabensprache",
    // "Sprachen kennen Rissoal",
    // "Sprachen kennen Rogolan",
    // "Sprachen kennen Rssahh",
    // "Sprachen kennen Ruuz",
    // "Sprachen kennen Thorwalsch",
    // "Sprachen kennen Trollisch",
    // "Sprachen kennen Tulamidya",
    // "Sprachen kennen Urtulamidya",
    // "Sprachen kennen Z'Lit",
    // "Sprachen kennen Zelemja",
    // "Sprachen kennen Zhayad",
    // "Sprachen kennen Zhulchammaqra",
    // "Sprachen kennen Zyklopäisch",
    ],
  },
  Schriften: {
    name: "Schriften",
    icon: "sym_r_menu_book",
    talents: [
    // "Lesen/Schreiben (Alt-)Imperiale Zeichen",
    // "Lesen/Schreiben Altes Alaani",
    // "Lesen/Schreiben Altes Amulashtra",
    // "Lesen/Schreiben Altes Kemi",
    // "Lesen/Schreiben Amulashtra",
    // "Lesen/Schreiben Angram",
    // "Lesen/Schreiben Arkanil",
    // "Lesen/Schreiben Chrmk",
    // "Lesen/Schreiben Chuchas",
    // "Lesen/Schreiben Drakhard-Zinken",
    // "Lesen/Schreiben Drakned-Glyphen",
    // "Lesen/Schreiben Geheiligte Glyphen von Unau",
    // "Lesen/Schreiben Gimaril-Glyphen",
    // "Lesen/Schreiben Gjalskisch",
    // "Lesen/Schreiben Hjaldingsche Runen",
    // "Lesen/Schreiben Isdira/Asdharia",
    // "Lesen/Schreiben Kusliker Zeichen",
    // "Lesen/Schreiben Mahrische Glyphen",
    // "Lesen/Schreiben Nanduria",
    // "Lesen/Schreiben Rogolan",
    // "Lesen/Schreiben Trollische Raumbilderschrift",
    // "Lesen/Schreiben Tulamidya",
    // "Lesen/Schreiben Urtulamidya",
    // "Lesen/Schreiben Zhayad",
    ],
  },
  Handwerk: {
    name: "Handwerk",
    icon: "sym_r_build",
    talents: [
      "Abrichten",
      "Ackerbau",
      "Alchimie",
      "Bergbau",
      "Bogenbau",
      "Boote fahren",
      "Brauer",
      "Drucker",
      "Fahrzeug lenken",
      "Falschspiel",
      "Feinmechanik",
      "Feuersteinbearbeitung",
      "Fleischer",
      "Gerber/Kürschner",
      "Glaskunst",
      "Grobschmied",
      "Handel",
      "Hauswirtschaft",
      "Heilkunde: Gift",
      "Heilkunde: Krankheiten",
      "Heilkunde: Seele",
      "Heilkunde: Wunden",
      "Holzbearbeitung",
      "Instrumentenbauer",
      "Kartografie",
      "Kochen",
      "Kristallzucht",
      "Lederarbeiten",
      "Malen/Zeichnen",
      "Maurer",
      "Metallguss",
      "Musizieren",
      "Schlösser knacken",
      "Schnaps brennen",
      "Schneidern",
      "Seefahrt",
      "Seiler",
      "Steinmetz",
      "Steinschneider/Juwelier",
      "Stellmacher",
      "Stoffe färben",
      "Tätowieren",
      "Töpfern",
      "Viehzucht",
      "Webkunst",
      "Winzer",
      "Zimmermann",
    ],
  },
}

export const flippedTalentGroups = Object.fromEntries(
  Object.values(talentGroups)
    .map(({ name, talents }) => talents.map(t => [t, name]))
    .flat(),
)

/**
 * Get the group a talent belongs to
 * @param {String} talentName Name of the talent
 */
export function getTalentGroup (talentName) {
  if (talentName.startsWith("Lesen/Schreiben")) return "Schriften"
  if (talentName.startsWith("Sprachen kennen")) return "Sprachen"
  const group = flippedTalentGroups[talentName]
  return group ?? "Gaben und anderes"
}

function talentRollsToArray (str) {
  if (typeof str !== "string") return []
  return str.trim()
    .replace("(", "")
    .replace(")", "")
    .split("/")
}

export function parseTalents (xmlDocument) {
  const talentEls = xmlDocument.querySelectorAll("held>talentliste talent")

  const result = {}

  for (const el of talentEls) {
    const name = el.getAttribute("name")
    const attributes = talentRollsToArray(el.getAttribute("probe"))
    result[name] = {
      name,
      attributes,
      value: el.getAttribute("value"),
      group: getTalentGroup(name),
    }
  }

  return result
}
