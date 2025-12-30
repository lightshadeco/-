
import { TriplePleatState, SFoldState, SquareFeetState, CalculationResult } from '../types';

/**
 * Excel-like ROUND function
 */
export const excelRound = (num: number, decimalPlaces: number = 0): number => {
  const p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
};

/**
 * Excel-like ROUNDUP function
 */
export const excelRoundUp = (num: number, decimalPlaces: number = 0): number => {
  const p = Math.pow(10, decimalPlaces);
  return Math.ceil(num * p) / p;
};

/**
 * Excel-like ISEVEN check logic integrated for hooks
 */
const getHookCount = (width: number, multiplier: number, hookDistance: number, isDouble: boolean): number => {
  if (isDouble) {
    const rawHalf = excelRound((width / 2) * multiplier / hookDistance);
    const halfHooks = rawHalf % 2 === 0 ? rawHalf : rawHalf + 1;
    return halfHooks * 2;
  } else {
    const raw = excelRound(width * multiplier / hookDistance);
    return raw % 2 === 0 ? raw : raw + 1;
  }
};

export const calculateTriplePleat = (state: TriplePleatState): CalculationResult => {
  const { unitPrice, width, height, multiplier, isSeamless, hasShaping, hasHooks, hasTieBack, hasLeadWeight } = state;

  const windowWidthChi = excelRound(width / 30, 1);
  const windowHeightChi = excelRound(height / 30, 1);
  const fabricWidthChi = excelRound(windowWidthChi * multiplier, 1);
  const fabricWidthFu = excelRoundUp(width / 150 * multiplier, 0);

  let fabricPrice = 0;
  let laborPrice = 0;
  let hookPrice = 0;
  let leadPrice = 0;

  if (isSeamless) {
    // 無接縫計價: B6*B2
    fabricPrice = fabricWidthChi * unitPrice;
    // 無接縫厚布工資: B6*70
    laborPrice = fabricWidthChi * 70;
    // 無接縫升級白鐵勾: B6*10
    hookPrice = hasHooks ? fabricWidthChi * 10 : 0;
    // 下襬加鉛條: B6*40
    leadPrice = hasLeadWeight ? fabricWidthChi * 40 : 0;
  } else {
    // 五尺布計價: B7*B9*B2 (幅 * 高尺 * 單價)
    fabricPrice = fabricWidthFu * windowHeightChi * unitPrice;
    // 一般厚布工資: B7*130
    laborPrice = fabricWidthFu * 130;
    // 升級白鐵勾: B7*20
    hookPrice = hasHooks ? fabricWidthFu * 20 : 0;
    leadPrice = 0; // 一般五尺布公式中未提及加鉛條
  }

  const trackPrice = excelRoundUp(windowWidthChi * 66, 0); // M16金屬勾軌道: B8*66
  const shapingPrice = hasShaping ? (fabricWidthFu < 6.25 ? 900 : fabricWidthFu * 160) : 0;
  const tieBackPrice = hasTieBack ? 120 : 0;

  const details = [
    { label: '布料價格', value: fabricPrice },
    { label: '製作工資 (厚布)', value: laborPrice },
    { label: 'M16金屬勾軌道', value: trackPrice },
    { label: '高溫塑形整燙', value: shapingPrice },
    { label: '白鐵勾', value: hookPrice },
    { label: '船型綁帶', value: tieBackPrice },
    { label: '下襬加鉛條', value: leadPrice }
  ];

  const totalPrice = details.reduce((sum, d) => sum + d.value, 0);

  return {
    fabricWidthChi,
    fabricWidthFu,
    totalPrice,
    details
  };
};

export const calculateSFold = (state: SFoldState): CalculationResult => {
  const { unitPrice, width, height, multiplier, hookDistance, isDouble, hasShaping, hasHooks, hasTieBack, hasLeadWeight } = state;

  const hookCount = getHookCount(width, multiplier, hookDistance, isDouble);
  const fabricWidthCm = (hookCount - 1) * hookDistance;
  const fabricWidthChi = excelRound(fabricWidthCm / 30, 1);
  const fabricWidthYards = excelRound(fabricWidthCm / 90, 1);
  const fabricWidthFu = excelRoundUp(fabricWidthCm / 150, 0);
  const windowWidthChi = excelRound(width / 30, 1);

  // 布計價 (一率用尺)
  const fabricPrice = fabricWidthChi * unitPrice;
  // 無接縫蛇行工資 (厚布): H9*90
  const laborPrice = fabricWidthChi * 90;
  // M16金屬勾軌道: H13*100
  const trackPrice = excelRoundUp(windowWidthChi * 100, 0);
  // 高溫塑形: if(H11<6.25,900,H11*160)
  const shapingPrice = hasShaping ? (fabricWidthFu < 6.25 ? 900 : fabricWidthFu * 160) : 0;
  // 升級白鐵勾: H9*10
  const hookPrice = hasHooks ? fabricWidthChi * 10 : 0;
  // 船型綁帶: 120
  const tieBackPrice = hasTieBack ? 120 : 0;
  // 下襬加鉛條: H9*40
  const leadPrice = hasLeadWeight ? fabricWidthChi * 40 : 0;

  const details = [
    { label: '布料價格 (尺計價)', value: fabricPrice },
    { label: '製作工資 (厚布)', value: laborPrice },
    { label: 'M16金屬勾軌道', value: trackPrice },
    { label: '高溫塑形整燙', value: shapingPrice },
    { label: '白鐵勾', value: hookPrice },
    { label: '船型綁帶', value: tieBackPrice },
    { label: '下襬加鉛條', value: leadPrice }
  ];

  const totalPrice = details.reduce((sum, d) => sum + d.value, 0);

  return {
    fabricWidthChi,
    fabricWidthFu,
    fabricWidthYards,
    totalPrice,
    details
  };
};

export const calculateSquareFeet = (state: SquareFeetState): CalculationResult => {
  const { unitPrice, width, height } = state;
  // 才數 = ROUNDUP(J3*J4/900,0)
  const squareFeet = excelRoundUp((width * height) / 900, 0);
  // 價格 = ROUNDUP(J2*J5,0)
  const totalPrice = excelRoundUp(unitPrice * squareFeet, 0);

  return {
    fabricWidthChi: 0,
    fabricWidthFu: 0,
    totalPrice,
    details: [
      { label: `基本才數 (${squareFeet} 才)`, value: totalPrice }
    ]
  };
};
