import type { Empire } from "./types";

export const empires: Empire[] = [
  {
    id: "roman-empire",
    name: "Roman Empire",
    startYear: -27,
    endYear: 476,
    capital: "Rome",
    color: "#C0392B",
    description:
      "One of the largest empires in ancient history, the Roman Empire at its height controlled territory spanning from Britain to Mesopotamia. It shaped Western civilization's laws, architecture, language, and governance.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Roman Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-9.5, 36.0],
                [-5.5, 36.0],
                [0.0, 37.5],
                [3.0, 43.0],
                [-1.0, 43.5],
                [3.5, 46.0],
                [7.0, 44.0],
                [12.0, 46.5],
                [16.0, 46.0],
                [19.0, 42.0],
                [23.0, 42.0],
                [26.0, 41.5],
                [29.0, 41.0],
                [33.0, 37.0],
                [36.0, 36.5],
                [36.0, 34.0],
                [35.5, 31.5],
                [32.0, 31.0],
                [25.0, 31.5],
                [11.0, 33.0],
                [10.0, 35.5],
                [2.0, 35.0],
                [-5.0, 34.0],
                [-9.5, 36.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Augustus", reignStart: -27, reignEnd: 14 },
      { name: "Trajan", reignStart: 98, reignEnd: 117 },
      { name: "Hadrian", reignStart: 117, reignEnd: 138 },
      { name: "Marcus Aurelius", reignStart: 161, reignEnd: 180 },
      { name: "Constantine I", reignStart: 306, reignEnd: 337 },
    ],
    events: [
      { year: -27, description: "Augustus becomes first Roman Emperor" },
      { year: 64, description: "Great Fire of Rome" },
      { year: 79, description: "Eruption of Mount Vesuvius destroys Pompeii" },
      {
        year: 117,
        description: "Empire reaches maximum territorial extent under Trajan",
      },
      { year: 313, description: "Edict of Milan legalizes Christianity" },
      { year: 476, description: "Fall of the Western Roman Empire" },
    ],
  },
  {
    id: "maurya-empire",
    name: "Maurya Empire",
    startYear: -322,
    endYear: -185,
    capital: "Pataliputra",
    color: "#E67E22",
    description:
      "The Maurya Empire was the first large-scale empire on the Indian subcontinent, founded by Chandragupta Maurya. Under Emperor Ashoka, it became one of the most prosperous and culturally advanced states of the ancient world.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Maurya Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [66.0, 25.0],
                [68.0, 30.0],
                [72.0, 34.0],
                [76.0, 35.0],
                [80.0, 32.0],
                [85.0, 28.0],
                [90.0, 26.0],
                [92.0, 22.0],
                [88.0, 18.0],
                [84.0, 15.0],
                [80.0, 12.0],
                [76.0, 10.0],
                [73.0, 15.0],
                [70.0, 20.0],
                [66.0, 25.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Chandragupta Maurya", reignStart: -322, reignEnd: -298 },
      { name: "Bindusara", reignStart: -298, reignEnd: -272 },
      { name: "Ashoka the Great", reignStart: -268, reignEnd: -232 },
    ],
    events: [
      {
        year: -322,
        description: "Chandragupta Maurya founds the Maurya Empire",
      },
      {
        year: -305,
        description: "Seleucid-Mauryan War ends with Maurya victory",
      },
      {
        year: -261,
        description:
          "Kalinga War fought by Ashoka; leads to embrace of Buddhism",
      },
      { year: -250, description: "Third Buddhist Council held at Pataliputra" },
    ],
  },
  {
    id: "han-dynasty",
    name: "Han Dynasty",
    startYear: -206,
    endYear: 220,
    capital: "Chang'an / Luoyang",
    color: "#2ECC71",
    description:
      "The Han Dynasty was one of the longest-ruling dynasties in Chinese history, considered a golden age of Chinese civilization. It established the Silk Road, advanced paper-making, and expanded China's borders significantly.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Han Dynasty" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [98.0, 25.0],
                [98.0, 30.0],
                [100.0, 35.0],
                [105.0, 40.0],
                [110.0, 42.0],
                [117.0, 42.0],
                [122.0, 40.0],
                [124.0, 35.0],
                [122.0, 30.0],
                [120.0, 25.0],
                [115.0, 22.0],
                [110.0, 20.0],
                [105.0, 22.0],
                [100.0, 23.0],
                [98.0, 25.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Emperor Gaozu (Liu Bang)", reignStart: -206, reignEnd: -195 },
      { name: "Emperor Wu", reignStart: -141, reignEnd: -87 },
      { name: "Emperor Guangwu", reignStart: 25, reignEnd: 57 },
    ],
    events: [
      { year: -206, description: "Liu Bang founds the Han Dynasty" },
      { year: -138, description: "Zhang Qian's missions open the Silk Road" },
      {
        year: -104,
        description:
          "Grand Historian Sima Qian begins Records of the Grand Historian",
      },
      { year: 105, description: "Cai Lun improves paper-making process" },
      {
        year: 220,
        description: "Fall of the Han Dynasty; Three Kingdoms period begins",
      },
    ],
  },
  {
    id: "achaemenid-empire",
    name: "Achaemenid Empire",
    startYear: -550,
    endYear: -330,
    capital: "Persepolis",
    color: "#9B59B6",
    description:
      "The Achaemenid (First Persian) Empire was the largest empire the ancient world had seen, stretching from Egypt and Thrace to the Indus Valley. Founded by Cyrus the Great, it pioneered religious tolerance and administrative governance.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Achaemenid Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.0, 37.0],
                [28.0, 41.0],
                [33.0, 42.0],
                [40.0, 40.0],
                [48.0, 38.0],
                [55.0, 38.0],
                [62.0, 37.0],
                [68.0, 34.0],
                [70.0, 30.0],
                [66.0, 25.0],
                [60.0, 25.0],
                [55.0, 27.0],
                [50.0, 30.0],
                [45.0, 30.0],
                [40.0, 28.0],
                [36.0, 31.0],
                [32.0, 31.0],
                [28.0, 31.0],
                [25.0, 31.5],
                [26.0, 37.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Cyrus the Great", reignStart: -559, reignEnd: -530 },
      { name: "Darius I", reignStart: -522, reignEnd: -486 },
      { name: "Xerxes I", reignStart: -486, reignEnd: -465 },
    ],
    events: [
      { year: -550, description: "Cyrus the Great conquers the Median Empire" },
      { year: -539, description: "Conquest of Babylon; Cyrus Cylinder issued" },
      {
        year: -490,
        description: "Battle of Marathon — Persian defeat by Athens",
      },
      {
        year: -480,
        description: "Battle of Thermopylae; Xerxes invades Greece",
      },
      { year: -330, description: "Alexander the Great conquers the empire" },
    ],
  },
  {
    id: "mughal-empire",
    name: "Mughal Empire",
    startYear: 1526,
    endYear: 1857,
    capital: "Agra / Delhi",
    color: "#1ABC9C",
    description:
      "The Mughal Empire ruled much of the Indian subcontinent for over three centuries. Known for its remarkable architecture (Taj Mahal), administrative systems, and cultural synthesis of Persian and Indian traditions.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Mughal Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [66.0, 26.0],
                [67.0, 30.0],
                [70.0, 34.0],
                [74.0, 36.0],
                [78.0, 34.0],
                [82.0, 30.0],
                [86.0, 27.0],
                [90.0, 24.0],
                [88.0, 22.0],
                [84.0, 18.0],
                [80.0, 15.0],
                [76.0, 14.0],
                [73.0, 16.0],
                [70.0, 20.0],
                [68.0, 24.0],
                [66.0, 26.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Babur", reignStart: 1526, reignEnd: 1530 },
      { name: "Akbar the Great", reignStart: 1556, reignEnd: 1605 },
      { name: "Shah Jahan", reignStart: 1628, reignEnd: 1658 },
      { name: "Aurangzeb", reignStart: 1658, reignEnd: 1707 },
    ],
    events: [
      {
        year: 1526,
        description: "First Battle of Panipat — Babur founds Mughal Empire",
      },
      {
        year: 1556,
        description: "Akbar begins reign; era of religious tolerance",
      },
      { year: 1632, description: "Construction of the Taj Mahal begins" },
      { year: 1739, description: "Nadir Shah's invasion; sack of Delhi" },
      { year: 1857, description: "Indian Rebellion; end of Mughal Empire" },
    ],
  },
  // ─────────────── Indian subcontinent (additional) ───────────────
  {
    id: "gupta-empire",
    name: "Gupta Empire",
    startYear: 319,
    endYear: 550,
    capital: "Pataliputra",
    color: "#F1C40F",
    description:
      "The Gupta Empire is regarded as the Golden Age of India. It unified much of the Indian subcontinent, fostered advances in mathematics, astronomy, medicine, and Sanskrit literature, and saw the flowering of Hindu and Buddhist art.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Gupta Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [68.0, 24.0],
                [72.0, 28.0],
                [78.0, 30.0],
                [88.0, 26.0],
                [92.0, 22.0],
                [90.0, 20.0],
                [85.0, 21.0],
                [82.0, 24.0],
                [78.0, 23.0],
                [75.0, 21.0],
                [72.0, 22.0],
                [68.0, 24.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Chandragupta I", reignStart: 319, reignEnd: 335 },
      { name: "Samudragupta", reignStart: 335, reignEnd: 375 },
      { name: "Chandragupta II", reignStart: 375, reignEnd: 415 },
      { name: "Kumaragupta I", reignStart: 415, reignEnd: 455 },
    ],
    events: [
      { year: 319, description: "Chandragupta I founds the Gupta Empire" },
      { year: 375, description: "Chandragupta II expands empire to western coast" },
      { year: 405, description: "Chinese pilgrim Faxian visits India" },
      { year: 455, description: "Skandagupta repels Huna invasions" },
      { year: 550, description: "Gupta Empire fragments; end of classical era" },
    ],
  },
  {
    id: "chola-dynasty",
    name: "Chola Dynasty",
    startYear: 848,
    endYear: 1279,
    capital: "Thanjavur / Gangaikonda Cholapuram",
    color: "#3498DB",
    description:
      "The Chola Dynasty was a Tamil empire of southern India and one of the longest-ruling dynasties. At its peak it controlled South India, Sri Lanka, and maritime Southeast Asia, with a powerful navy and lasting contributions to temple architecture and administration.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Chola Dynasty" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [76.0, 18.0],
                [78.0, 16.0],
                [80.0, 10.0],
                [81.0, 8.5],
                [79.5, 8.0],
                [78.0, 9.0],
                [77.0, 12.0],
                [76.0, 15.0],
                [76.0, 18.0],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: { name: "Chola Sri Lanka" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.5, 9.8],
                [81.0, 9.5],
                [81.8, 6.0],
                [80.0, 5.5],
                [79.5, 9.8],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Vijayalaya Chola", reignStart: 848, reignEnd: 871 },
      { name: "Rajaraja I", reignStart: 985, reignEnd: 1014 },
      { name: "Rajendra I", reignStart: 1014, reignEnd: 1044 },
      { name: "Kulottunga I", reignStart: 1070, reignEnd: 1122 },
    ],
    events: [
      { year: 848, description: "Vijayalaya Chola captures Thanjavur; Chola revival" },
      { year: 1010, description: "Rajaraja I completes Brihadeeswarar Temple" },
      { year: 1025, description: "Rajendra I's naval expedition to Srivijaya" },
      { year: 1279, description: "Last Chola ruler defeated; Pandya takeover" },
    ],
  },
  {
    id: "delhi-sultanate",
    name: "Delhi Sultanate",
    startYear: 1206,
    endYear: 1526,
    capital: "Delhi",
    color: "#8E44AD",
    description:
      "The Delhi Sultanate was a Muslim empire based in Delhi that ruled over large parts of the Indian subcontinent for over three centuries. It established Persianate culture, Indo-Islamic architecture, and administrative practices that influenced later Mughal rule.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Delhi Sultanate" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [68.0, 24.0],
                [71.0, 30.0],
                [78.0, 31.0],
                [88.0, 26.0],
                [90.0, 22.0],
                [86.0, 21.0],
                [80.0, 22.0],
                [75.0, 24.0],
                [70.0, 23.0],
                [68.0, 24.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Qutb al-Din Aibak", reignStart: 1206, reignEnd: 1210 },
      { name: "Iltutmish", reignStart: 1211, reignEnd: 1236 },
      { name: "Ala ud-Din Khalji", reignStart: 1296, reignEnd: 1316 },
      { name: "Muhammad bin Tughluq", reignStart: 1325, reignEnd: 1351 },
    ],
    events: [
      { year: 1206, description: "Qutb al-Din Aibak establishes Delhi Sultanate" },
      { year: 1220, description: "Qutb Minar complex completed in Delhi" },
      { year: 1311, description: "Ala ud-Din Khalji's expansion to the Deccan" },
      { year: 1526, description: "First Battle of Panipat; Mughals end Sultanate" },
    ],
  },
  {
    id: "vijayanagara-empire",
    name: "Vijayanagara Empire",
    startYear: 1336,
    endYear: 1646,
    capital: "Vijayanagara (Hampi)",
    color: "#C0392B",
    description:
      "The Vijayanagara Empire was a South Indian empire based in the Deccan. It resisted Delhi Sultanate expansion, fostered Hindu culture and architecture, and became one of the largest and wealthiest states in the medieval world until its defeat at Talikota.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Vijayanagara Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [74.0, 20.0],
                [76.0, 18.0],
                [79.0, 16.0],
                [82.0, 14.0],
                [82.0, 11.0],
                [80.0, 10.0],
                [77.0, 12.0],
                [75.0, 15.0],
                [74.0, 18.0],
                [74.0, 20.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Harihara I", reignStart: 1336, reignEnd: 1356 },
      { name: "Bukka Raya I", reignStart: 1356, reignEnd: 1377 },
      { name: "Krishnadevaraya", reignStart: 1509, reignEnd: 1529 },
      { name: "Aliya Rama Raya", reignStart: 1542, reignEnd: 1565 },
    ],
    events: [
      { year: 1336, description: "Harihara and Bukka found Vijayanagara Empire" },
      { year: 1509, description: "Krishnadevaraya's reign; empire at zenith" },
      { year: 1565, description: "Battle of Talikota; decisive defeat" },
      { year: 1646, description: "Last Vijayanagara rulers overthrown" },
    ],
  },
  {
    id: "maratha-empire",
    name: "Maratha Empire",
    startYear: 1674,
    endYear: 1818,
    capital: "Raigad / Satara / Pune",
    color: "#E74C3C",
    description:
      "The Maratha Empire was a Hindu confederacy that rose from Maharashtra and came to dominate much of India in the 18th century, challenging Mughal authority. It was eventually subdued by the British in three Anglo-Maratha Wars.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Maratha Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [72.0, 22.0],
                [74.0, 21.0],
                [78.0, 22.0],
                [82.0, 21.0],
                [84.0, 19.0],
                [82.0, 16.0],
                [78.0, 15.0],
                [75.0, 17.0],
                [72.0, 19.0],
                [72.0, 22.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Shivaji", reignStart: 1674, reignEnd: 1680 },
      { name: "Shahu I", reignStart: 1707, reignEnd: 1749 },
      { name: "Peshwa Baji Rao I", reignStart: 1720, reignEnd: 1740 },
      { name: "Peshwa Madhav Rao I", reignStart: 1761, reignEnd: 1772 },
    ],
    events: [
      { year: 1674, description: "Shivaji crowned Chhatrapati; Maratha Empire founded" },
      { year: 1737, description: "Marathas sack Delhi; peak expansion" },
      { year: 1761, description: "Third Battle of Panipat; Maratha defeat" },
      { year: 1818, description: "Third Anglo-Maratha War; British paramountcy" },
    ],
  },
  {
    id: "byzantine-empire",
    name: "Byzantine Empire",
    startYear: 330,
    endYear: 1453,
    capital: "Constantinople",
    color: "#8E44AD",
    era: "medieval",
    description:
      "The Byzantine Empire was the Eastern Roman continuation after the fall of the West. Centered on Constantinople, it preserved Greco-Roman culture, Christianity, and law for a millennium and influenced medieval Europe and the Islamic world.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Byzantine Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [14.0, 37.0],
                [16.0, 41.0],
                [19.0, 42.0],
                [23.0, 41.0],
                [27.0, 42.0],
                [30.0, 41.0],
                [33.0, 37.0],
                [36.0, 36.0],
                [36.0, 32.0],
                [34.0, 30.0],
                [32.0, 28.0],
                [30.0, 30.0],
                [28.0, 32.0],
                [25.0, 31.0],
                [22.0, 31.0],
                [18.0, 33.0],
                [15.0, 32.0],
                [13.0, 34.0],
                [11.0, 36.0],
                [12.0, 38.0],
                [14.0, 37.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Justinian I", reignStart: 527, reignEnd: 565 },
      { name: "Heraclius", reignStart: 610, reignEnd: 641 },
      { name: "Basil II", reignStart: 976, reignEnd: 1025 },
    ],
    events: [
      { year: 330, description: "Constantinople founded as new capital" },
      { year: 527, description: "Justinian I begins reign; reconquests in the West" },
      { year: 1453, description: "Fall of Constantinople to the Ottomans" },
    ],
  },
  {
    id: "mongol-empire",
    name: "Mongol Empire",
    startYear: 1206,
    endYear: 1368,
    capital: "Karakorum",
    color: "#D35400",
    era: "medieval",
    description:
      "The Mongol Empire was the largest contiguous land empire in history. Under Genghis Khan and his successors it stretched from Eastern Europe to the Sea of Japan, enabling trade and cultural exchange across Eurasia.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Mongol Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [20.0, 48.0],
                [40.0, 50.0],
                [55.0, 50.0],
                [70.0, 48.0],
                [90.0, 48.0],
                [110.0, 46.0],
                [125.0, 42.0],
                [125.0, 35.0],
                [105.0, 32.0],
                [85.0, 34.0],
                [70.0, 36.0],
                [55.0, 38.0],
                [45.0, 42.0],
                [32.0, 45.0],
                [20.0, 48.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Genghis Khan", reignStart: 1206, reignEnd: 1227 },
      { name: "Ögedei Khan", reignStart: 1229, reignEnd: 1241 },
      { name: "Kublai Khan", reignStart: 1260, reignEnd: 1294 },
    ],
    events: [
      { year: 1206, description: "Genghis Khan unites the Mongol tribes" },
      { year: 1260, description: "Kublai Khan becomes Great Khan; Yuan Dynasty in China" },
      { year: 1368, description: "Mongol Yuan falls; empire fragments" },
    ],
  },
  {
    id: "ottoman-empire",
    name: "Ottoman Empire",
    startYear: 1299,
    endYear: 1922,
    capital: "Constantinople (Istanbul)",
    color: "#16A085",
    era: "earlyModern",
    description:
      "The Ottoman Empire was a multi-ethnic state that spanned Southeast Europe, Anatolia, the Levant, and North Africa for over six centuries. It was a major power in the Mediterranean and a bridge between East and West.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Ottoman Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.0, 42.0],
                [29.0, 41.0],
                [33.0, 38.0],
                [36.0, 36.0],
                [36.0, 32.0],
                [35.0, 28.0],
                [33.0, 26.0],
                [30.0, 28.0],
                [32.0, 22.0],
                [29.0, 20.0],
                [26.0, 24.0],
                [24.0, 30.0],
                [21.0, 32.0],
                [18.0, 36.0],
                [17.0, 41.0],
                [21.0, 43.0],
                [26.0, 42.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Mehmed II", reignStart: 1451, reignEnd: 1481 },
      { name: "Suleiman the Magnificent", reignStart: 1520, reignEnd: 1566 },
    ],
    events: [
      { year: 1299, description: "Osman I founds the Ottoman state" },
      { year: 1453, description: "Conquest of Constantinople" },
      { year: 1922, description: "Abolition of the Ottoman Sultanate" },
    ],
  },
  {
    id: "abbasid-caliphate",
    name: "Abbasid Caliphate",
    startYear: 750,
    endYear: 1258,
    capital: "Baghdad",
    color: "#2980B9",
    era: "medieval",
    description:
      "The Abbasid Caliphate was the third Islamic caliphate. Its capital Baghdad became a center of learning, science, and culture during the Islamic Golden Age, and the empire stretched from the Maghreb to Central Asia.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Abbasid Caliphate" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [28.0, 38.0],
                [42.0, 38.0],
                [52.0, 36.0],
                [60.0, 32.0],
                [58.0, 26.0],
                [50.0, 25.0],
                [42.0, 27.0],
                [36.0, 26.0],
                [32.0, 25.0],
                [30.0, 28.0],
                [26.0, 30.0],
                [22.0, 29.0],
                [18.0, 31.0],
                [16.0, 34.0],
                [20.0, 36.0],
                [28.0, 38.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Harun al-Rashid", reignStart: 786, reignEnd: 809 },
      { name: "al-Ma'mun", reignStart: 813, reignEnd: 833 },
    ],
    events: [
      { year: 750, description: "Abbasid Revolution overthrows Umayyads" },
      { year: 762, description: "Baghdad founded as capital" },
      { year: 1258, description: "Siege of Baghdad; fall of the caliphate" },
    ],
  },
  // ─────────────── 500 BCE – 1 CE (ancient Mediterranean & Asia) ───────────────
  {
    id: "roman-republic",
    name: "Roman Republic",
    startYear: -509,
    endYear: -27,
    capital: "Rome",
    color: "#922B21",
    era: "ancient",
    description:
      "The Roman Republic was the era of ancient Rome before the empire. It expanded from central Italy to control the Mediterranean, with a senate and elected magistrates. Civil wars and the rise of Augustus ended the republic.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Roman Republic" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-5.0, 36.0],
                [2.0, 37.0],
                [8.0, 41.0],
                [12.0, 44.0],
                [14.0, 45.0],
                [12.0, 43.0],
                [10.0, 41.0],
                [6.0, 40.0],
                [2.0, 38.0],
                [-2.0, 37.0],
                [-5.0, 36.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Julius Caesar", reignStart: -49, reignEnd: -44 },
      { name: "Augustus (Octavian)", reignStart: -27, reignEnd: 14 },
    ],
    events: [
      { year: -509, description: "Traditional founding of the Republic" },
      { year: -27, description: "Augustus establishes the Roman Empire" },
    ],
  },
  {
    id: "carthaginian-empire",
    name: "Carthaginian Empire",
    startYear: -650,
    endYear: -146,
    capital: "Carthage",
    color: "#B9770E",
    era: "ancient",
    description:
      "Carthage was a Phoenician-derived power in North Africa that dominated the western Mediterranean. Its conflicts with Rome in the Punic Wars ended with the destruction of Carthage in 146 BCE.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Carthaginian Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-6.0, 36.0],
                [10.0, 37.0],
                [14.0, 38.0],
                [12.0, 41.0],
                [9.0, 43.0],
                [4.0, 41.0],
                [0.0, 38.0],
                [-4.0, 36.0],
                [-6.0, 36.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Hannibal Barca", reignStart: -247, reignEnd: -183 },
    ],
    events: [
      { year: -264, description: "First Punic War begins" },
      { year: -218, description: "Hannibal crosses the Alps" },
      { year: -146, description: "Carthage destroyed by Rome" },
    ],
  },
  {
    id: "nanda-empire",
    name: "Nanda Empire",
    startYear: -345,
    endYear: -322,
    capital: "Pataliputra",
    color: "#6E2C00",
    era: "ancient",
    description:
      "The Nanda Empire ruled much of northern India before the Mauryas. Its wealth and army were noted in Greek sources; Chandragupta Maurya overthrew the last Nanda ruler to found the Maurya Empire.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Nanda Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [80.0, 22.0],
                [86.0, 26.0],
                [90.0, 25.0],
                [90.0, 22.0],
                [86.0, 20.0],
                [82.0, 20.0],
                [78.0, 24.0],
                [80.0, 22.0],
              ],
            ],
          },
        },
      ],
    },
    events: [
      { year: -322, description: "Chandragupta Maurya overthrows Nandas" },
    ],
  },
  {
    id: "macedonian-empire",
    name: "Macedonian Empire",
    startYear: -336,
    endYear: -323,
    capital: "Pella",
    color: "#1A5276",
    era: "ancient",
    description:
      "Under Alexander the Great, Macedon conquered the Persian Empire and reached India, creating one of the largest empires of antiquity. It fragmented into the Hellenistic kingdoms after Alexander's death.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Macedonian Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [20.0, 40.0],
                [28.0, 42.0],
                [40.0, 40.0],
                [55.0, 36.0],
                [68.0, 32.0],
                [75.0, 30.0],
                [78.0, 27.0],
                [72.0, 25.0],
                [58.0, 28.0],
                [42.0, 30.0],
                [28.0, 32.0],
                [22.0, 36.0],
                [20.0, 40.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Philip II", reignStart: -359, reignEnd: -336 },
      { name: "Alexander the Great", reignStart: -336, reignEnd: -323 },
    ],
    events: [
      { year: -336, description: "Alexander becomes king" },
      { year: -323, description: "Death of Alexander; empire divides" },
    ],
  },
  {
    id: "seleucid-empire",
    name: "Seleucid Empire",
    startYear: -312,
    endYear: -63,
    capital: "Antioch / Seleucia",
    color: "#7D3C98",
    era: "ancient",
    description:
      "The Seleucid Empire was the largest of the Hellenistic successor states. It ruled Mesopotamia, Iran, Syria, and parts of Anatolia until Roman and Parthian expansion reduced and ended it.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Seleucid Empire" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [26.0, 37.0],
                [38.0, 38.0],
                [52.0, 36.0],
                [60.0, 33.0],
                [62.0, 30.0],
                [58.0, 27.0],
                [48.0, 26.0],
                [38.0, 28.0],
                [32.0, 30.0],
                [28.0, 33.0],
                [26.0, 37.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Seleucus I", reignStart: -305, reignEnd: -281 },
      { name: "Antiochus III", reignStart: -222, reignEnd: -187 },
    ],
    events: [
      { year: -312, description: "Seleucus I establishes Seleucid rule" },
      { year: -63, description: "Roman annexation of Syria" },
    ],
  },
  {
    id: "ptolemaic-kingdom",
    name: "Ptolemaic Kingdom",
    startYear: -305,
    endYear: -30,
    capital: "Alexandria",
    color: "#F4D03F",
    era: "ancient",
    description:
      "The Ptolemaic kingdom ruled Egypt and at times Cyprus, the Levant, and parts of the Aegean. It was the last major Hellenistic state to fall to Rome, with Cleopatra's defeat at Actium.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Ptolemaic Kingdom" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [24.0, 32.0],
                [36.0, 32.0],
                [36.0, 35.0],
                [34.0, 37.0],
                [32.0, 35.0],
                [30.0, 31.0],
                [26.0, 29.0],
                [24.0, 32.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Ptolemy I", reignStart: -305, reignEnd: -283 },
      { name: "Cleopatra VII", reignStart: -51, reignEnd: -30 },
    ],
    events: [
      { year: -305, description: "Ptolemy I founds Ptolemaic dynasty" },
      { year: -30, description: "Egypt annexed by Rome" },
    ],
  },
  {
    id: "qin-dynasty",
    name: "Qin Dynasty",
    startYear: -221,
    endYear: -206,
    capital: "Xianyang",
    color: "#17202A",
    era: "ancient",
    description:
      "The Qin dynasty was the first to unify China under a single emperor. It standardized script, weights, and the Great Wall but fell quickly to rebellion; the Han dynasty succeeded it.",
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Qin Dynasty" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [100.0, 42.0],
                [115.0, 42.0],
                [118.0, 35.0],
                [116.0, 28.0],
                [108.0, 26.0],
                [100.0, 28.0],
                [98.0, 32.0],
                [100.0, 38.0],
                [100.0, 42.0],
              ],
            ],
          },
        },
      ],
    },
    rulers: [
      { name: "Qin Shi Huang", reignStart: -221, reignEnd: -210 },
    ],
    events: [
      { year: -221, description: "Qin unifies China; First Emperor" },
      { year: -206, description: "Fall of Qin; Han dynasty founded" },
    ],
  },
];

export function getEmpireById(id: string): Empire | undefined {
  return empires.find((e) => e.id === id);
}
