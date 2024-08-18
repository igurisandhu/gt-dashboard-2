import { NotificationType } from '@app/components/common/BaseNotification/BaseNotification';
import { Priority } from '@app//constants/enums/priorities';
import visa from '@app/assets/images/card-issuers/visa.png';
import mastercard from '@app/assets/images/card-issuers/mastercard.png';
import maestro from '@app/assets/images/card-issuers/maestro.png';
import { CurrencyTypeEnum, Severity } from '@app/interfaces/interfaces';
import { BaseBadgeProps } from '@app/components/common/BaseBadge/BaseBadge';
import { currencies } from '@app/constants/config/currencies';
import L, { LatLngExpression } from 'leaflet';

export const camelize = (string: string): string => {
  return string
    .split(' ')
    .map((word, index) => (index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)))
    .join('');
};

export const getCurrencyPrice = (price: number | string, currency: CurrencyTypeEnum, isIcon = true): string => {
  const currencySymbol = currencies[currency][isIcon ? 'icon' : 'text'];

  return isIcon ? `${currencySymbol}${price}` : `${price} ${currencySymbol}`;
};

type MarkArea = {
  xAxis: number;
};

export const getMarkAreaData = (data: string[] | number[]): MarkArea[][] =>
  data.map((el, index) => [
    {
      xAxis: 2 * index,
    },
    {
      xAxis: 2 * index + 1,
    },
  ]);

export const capitalize = (word: string): string => `${word[0].toUpperCase()}${word.slice(1)}`;

export const hexToRGB = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};

export const getDifference = (value: number, prevValue: number): string | null =>
  prevValue !== 0 ? `${((Math.abs(value - prevValue) / prevValue) * 100).toFixed(0)}%` : '100%';

export const normalizeProp = (prop: string | number | [number, number]): string =>
  typeof prop === 'number' ? `${prop}px` : (Array.isArray(prop) && `${prop[0]}px ${prop[1]}px`) || prop.toString();

export const defineColorByPriority = (priority: Priority): string => {
  switch (priority) {
    case Priority.INFO:
      return 'var(--primary-color)';
    case Priority.LOW:
      return 'var(--success-color)';
    case Priority.MEDIUM:
      return 'var(--warning-color)';
    case Priority.HIGH:
      return 'var(--error-color)';
    default:
      return 'var(--success-color)';
  }
};

export const defineColorBySeverity = (severity: NotificationType | undefined, rgb = false): string => {
  const postfix = rgb ? 'rgb-color' : 'color';
  switch (severity) {
    case 'error':
    case 'warning':
    case 'success':
      return `var(--${severity}-${postfix})`;
    case 'info':
    default:
      return `var(--primary-${postfix})`;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeBy = (a: any[], b: any[], key: string): any[] =>
  a.filter((elem) => !b.find((subElem) => subElem[key] === elem[key])).concat(b);

export const getSmoothRandom = (factor: number, start: number): number => {
  const halfEnvelope = 1 / factor / 2;
  const max = Math.min(1, start + halfEnvelope);
  const min = Math.max(0, start - halfEnvelope);

  return Math.random() * (max - min) + min;
};

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error('Non valid HEX color');
  }
};

export const formatNumberWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const msToH = (ms: number): number => Math.floor(ms / 3600000);

export const hToMS = (h: number): number => h * 3600000;

export const getPaymentCardTypeIcon = (type: string): string | null => {
  switch (type) {
    case 'visa':
      return visa;
    case 'mastercard':
      return mastercard;
    case 'maestro':
      return maestro;
    case 'amex':
      return 'amex';
    case 'discover':
      return 'discover';
    case 'diners':
      return 'diners';
    case 'jcb':
      return 'jcb';
    case 'unionpay':
      return 'unionpay';
    default:
      return null;
  }
};

export const mapBadgeStatus = (status: BaseBadgeProps['status']): Severity => {
  if (!status || status === 'default' || status === 'processing') {
    return 'info';
  }

  return status;
};

export const getCurrentLocation = async (): Promise<LatLngExpression> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          resolve([59.333772, 18.0644457]);
        },
      );
    } else {
      resolve([59.333772, 18.0644457]);
      console.error('*** Geolocation not supported ***');
    }
  });
};

export const createNumberLocationSvg = (iconNumber: number) => {
  const checkmk = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: green;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1"><path d="M289.094746 364.975459v-25.595958c0.214894-1.206478 0.478907-2.408863 0.63752-3.622504 1.050935-8.074909 1.736551-16.213263 3.168156-24.218588 16.306384-91.192955 91.073228-164.325579 182.402283-178.485067 7.66047-1.188058 15.382339-1.981121 23.076578-2.957355h25.595958c1.098008 0.208754 2.188852 0.472767 3.295046 0.617054 8.199753 1.062192 16.464997 1.74576 24.592094 3.197831 91.175559 16.302291 164.235528 91.030249 178.447205 182.440146 1.188058 7.644097 1.976004 15.350616 2.950192 23.028483v25.595958c-0.2415 1.708921-0.569982 3.408633-0.713245 5.12574-1.799996 21.36254-6.106068 42.210357-14.263865 62.042032-4.996804 12.144598-11.207249 23.785729-16.778128 35.698037-35.853579 76.665077-71.753207 153.308665-107.494223 230.02593-23.39585 50.221822-46.607504 100.529601-69.721945 150.881382-2.105964 4.587482-4.716418 8.114818-9.345855 10.075473h-5.269004c-2.542916-2.284019-6.045693-4.084015-7.480368-6.928806-13.007245-25.790386-26.044166-51.580772-38.331004-77.720106-33.338293-70.931492-66.2601-142.058436-99.457176-213.057467-16.543791-35.385928-33.007765-70.814836-50.123584-105.924471-10.578939-21.701255-18.642592-44.064588-22.337751-67.932182-1.147126-7.398504-1.909489-14.855336-2.848884-22.285562z m222.129076 134.000923c84.298941-0.450255 146.246829-68.13582 146.669454-146.570193 0.435928-81.133855-65.536622-146.985656-146.574286-147.026588-81.110319-0.040932-147.199527 65.685002-146.862859 146.742108 0.327458 78.636988 62.36335 146.46377 146.767691 146.854673z" fill=""/>
                  <text x="50%" y="36%" text-anchor="middle" dy=".3em" font-size="350" fill="blue" stroke="red" stroke-width="2">1111</text>
                  </svg>`;

  function checkmk_mk(iconNo: number) {
    return checkmk.replace(/1111/g, String(iconNo));
  }

  const createPinIconUrl = (iconIndex: number) => {
    const svgPinUrl = encodeURI('data:image/svg+xml;utf-8,' + checkmk_mk(iconIndex));
    return svgPinUrl;
  };
  return createPinIconUrl(iconNumber);
};

export const createNumberLocationIconLeaflet = (iconIndex: number) => {
  const svgPinIcon = L.icon({
    iconUrl: createNumberLocationSvg(iconIndex),
    iconSize: [50, 50],
    iconAnchor: [24, 41],
    popupAnchor: [0, -22],
  });
  return svgPinIcon;
};

export const createIconLeaflet = (iconUrl: string) => {
  const svgPinIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [50 / 2, 50 / 2],
    popupAnchor: [0, -22],
  });
  return svgPinIcon;
};

export const svgToSvgIconUrl = (svg: string) => {
  const svgPinUrl = encodeURI('data:image/svg+xml;utf-8,' + svg);
  return svgPinUrl;
};

export const createMarkerLeaflet = ({
  latLng,
  icon,
  draggable,
  popupHtml,
}: {
  latLng: LatLngExpression;
  icon: any;
  draggable: boolean;
  popupHtml: string;
}) => {
  return L.marker(latLng, {
    icon: icon,
    draggable,
  }).bindPopup(popupHtml);
};
