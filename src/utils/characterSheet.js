/**
 * This file assumes you're dealing with an XML Export of the "Helden Software", v5.5.3
 * Docs: http://forum.helden-software.de
 */

const DEFAULT_ATTRIBUTES = {
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
  const result = {}

  for (const attribute of Object.keys(DEFAULT_ATTRIBUTES)) {
    // Set default. Destructutign here to break reactivity is important,
    // otherwise multiple characters will share the same attributes.
    result[attribute] = { ...DEFAULT_ATTRIBUTES[attribute] }

    // Get attribute value and fill it in
    const xmlEl = xmlDocument.querySelector(`held>eigenschaften eigenschaft[name='${attribute}']`)
    if (!xmlEl) continue

    const val = xmlEl.getAttribute("value")
    const mod = xmlEl.getAttribute("mod")
    result[attribute].value = parseInt(val) + parseInt(mod)
  }
  return result
}

const GROUPS = {
  OTHER: "Gaben und anderes",
  COMBAT: "Kampf",
  PHYSICAL: "Körperlich",
  SOCIAL: "Gesellschaft",
  NATURE: "Natur",
  KNOWLEDGE: "Wissen",
  LANGUAGES: "Sprachen",
  SCRIPTS: "Schriften",
  CRAFTS: "Handwerk",
}

export const talentGroups = {
  [GROUPS.OTHER]: {
    name: GROUPS.OTHER,
    icon: "sym_r_star",
    talents: [],
  },
  [GROUPS.COMBAT]: {
    name: GROUPS.COMBAT,
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
  [GROUPS.PHYSICAL]: {
    name: GROUPS.PHYSICAL,
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
  [GROUPS.SOCIAL]: {
    name: GROUPS.SOCIAL,
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
  [GROUPS.NATURE]: {
    name: GROUPS.NATURE,
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
  [GROUPS.KNOWLEDGE]: {
    name: GROUPS.KNOWLEDGE,
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
  [GROUPS.LANGUAGES]: {
    name: GROUPS.LANGUAGES,
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
  [GROUPS.SCRIPTS]: {
    name: GROUPS.SCRIPTS,
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
  [GROUPS.CRAFTS]: {
    name: GROUPS.CRAFTS,
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
  if (talentName.startsWith("Lesen/Schreiben")) return GROUPS.SCRIPTS
  if (talentName.startsWith("Sprachen kennen")) return GROUPS.LANGUAGES
  const group = flippedTalentGroups[talentName]
  return group ?? GROUPS.OTHER
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

  const baseAttackEl = xmlDocument.querySelector("held>eigenschaften eigenschaft[name='fk']")
  const baseAttack = parseInt(baseAttackEl.getAttribute("value")) + parseInt(baseAttackEl.getAttribute("mod"))

  const allSpecializations = {}
  const specializationEls = xmlDocument.querySelectorAll("held>sf sonderfertigkeit talent")

  for (const specEl of specializationEls) {
    const talentName = specEl.getAttribute("name")
    const spec = specEl.parentNode.querySelector("spezialisierung")
    if (spec) {
      if (!allSpecializations[talentName]) allSpecializations[talentName] = []
      allSpecializations[talentName].push(spec.getAttribute("name"))
    }
  }

  for (const el of talentEls) {
    const name = el.getAttribute("name")
    const attributes = talentRollsToArray(el.getAttribute("probe"))
    const group = getTalentGroup(name)
    const value = parseInt(el.getAttribute("value"))
    const specializations = allSpecializations[name] ?? []

    result[name] = {
      name,
      attributes,
      value,
      group,
      specializations,
      extraRolls: {},
    }

    for (const spec of specializations) {
      result[name].extraRolls[spec] = value + 2
    }

    if (group === GROUPS.COMBAT) {
      const combatEl = xmlDocument.querySelector(`held>kampf kampfwerte[name="${name}"]`)

      if (combatEl) {
        // melee weapon talent, has attack & parry
        const AT = parseInt(combatEl.querySelector("attacke").getAttribute("value"))
        result[name].extraRolls.AT = AT
        const PA = parseInt(combatEl.querySelector("parade").getAttribute("value"))
        result[name].extraRolls.PA = PA

        for (const spec of specializations) {
          result[name].extraRolls["AT " + spec] = AT + 1
          result[name].extraRolls["PA " + spec] = PA + 1
        }
      } else {
        // ranged weapon talent, has only ranged attack
        result[name].extraRolls.FK = baseAttack + value
      }
    }
  }

  return result
}

export function parseCharacter (xmlDocument) {
  const generalData = parseGeneral(xmlDocument)
  const attributes = parseAttributes(xmlDocument)
  const talents = parseTalents(xmlDocument)

  return {
    generalData,
    attributes,
    talents,
  }
}
