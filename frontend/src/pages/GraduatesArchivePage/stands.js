// Размеры и координаты в исходных пикселях Figma. Каждый стенд масштабируется целиком.
const regularSlots = (columns, rows, top, step) =>
  Array.from({ length: columns * rows }, (_, index) => ({
    x: 24 + (index % columns) * 138,
    y: top + Math.floor(index / columns) * step + (step === 175 && Math.floor(index / columns) === 1 ? 1 : 0),
    width: 120,
    height: 164,
  }));

const narrowSlots = () => [
  ...regularSlots(3, 4, 199, 175),
  ...Array.from({ length: 6 }, (_, index) => ({
    x: 24 + (index % 3) * 138,
    y: 902 + Math.floor(index / 3) * 186,
    width: 120,
    height: 174,
    tallOutline: index % 3 === 2,
  })),
];

// Для заполнения добавьте photo: { title, image: { image_url, object_position } }
// в нужный элемент slots. Порядок ячеек — слева направо, сверху вниз.
export const stands = [
  {
    id: 'research', nodeId: '1:6', width: 720,
    title: 'Научно-исследовательская работа', titleTop: 23,
    lines: ['НАУЧНО-', 'ИССЛЕДОВАТЕЛЬСКАЯ', 'РАБОТА'],
    slots: [
      ...regularSlots(5, 4, 234, 190),
      ...[24, 208, 392].map((x) => ({ x, y: 994, width: 166, height: 244 })),
      { x: 576, y: 994, width: 120, height: 174 },
    ],
  },
  {
    id: 'faculty', nodeId: '3:26', width: 582,
    title: 'Структура факультета кибернетики', titleTop: 9,
    lines: ['СТРУКТУРА', 'ФАКУЛЬТЕТА', 'КИБЕРНЕТИКИ'],
    slots: [
      ...regularSlots(4, 4, 199, 175),
      { x: 24, y: 902, width: 258, height: 360 },
      { x: 300, y: 902, width: 120, height: 174 },
      { x: 438, y: 902, width: 120, height: 174 },
      { x: 300, y: 1088, width: 120, height: 174, tallOutline: true },
      { x: 438, y: 1088, width: 120, height: 174, tallOutline: true },
    ],
  },
  {
    id: 'olympic', nodeId: '3:108', width: 720,
    title: 'Олимпийские надежды', titleTop: 60,
    lines: ['ОЛИМПИЙСКИЕ', 'НАДЕЖДЫ'],
    slots: [
      ...regularSlots(5, 4, 234, 190),
      { x: 24, y: 994, width: 190, height: 258 },
      { x: 232, y: 994, width: 189, height: 258 },
      { x: 439, y: 994, width: 120, height: 174 },
      { x: 577, y: 994, width: 120, height: 174 },
    ],
  },
  ...['3:171', '4:235', '4:293'].map((nodeId, index) => ({
    id: `graduates-${index + 1}`, nodeId, width: 444,
    title: `Наши выпускники — стенд ${index + 1}`, titleTop: 30,
    lines: ['НАШИ', 'ВЫПУСКНИКИ'], slots: narrowSlots(),
  })),
  ...['4:351', '4:467'].map((nodeId, index) => ({
    id: `founders-${index + 1}`, nodeId, width: 444,
    title: `Основатели факультета — стенд ${index + 1}`, titleTop: 30,
    lines: ['ОСНОВАТЕЛИ', 'ФАКУЛЬТЕТА'], slots: narrowSlots(),
  })),
];
