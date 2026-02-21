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
];

export function getEmpireById(id: string): Empire | undefined {
  return empires.find((e) => e.id === id);
}
