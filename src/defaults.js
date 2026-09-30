/* Starting content. Everything here is editable in the app and saved on the device. */
const r = (id, t) => ({ id, t });
export const DEFAULT_ROUTINES = {
  am: [r('am1', 'Cleanser'), r('am2', 'Moisturizer'), r('am3', 'Sunscreen'), r('am4', 'Brush and floss'), r('am5', 'Deodorant')],
  pm: [r('pm1', 'Cleanser'), r('pm2', 'Moisturizer'), r('pm3', 'Brush and floss')],
  weekly: [r('w1', 'Trim and groom'), r('w2', 'Nails'), r('w3', 'Change towels'), r('w4', 'Wash sheets'), r('w5', 'Clean razor and brush')]
};
export const DEFAULT_STOCK = ['Shampoo', 'Body wash', 'Deodorant', 'Toothpaste', 'Floss', 'Razor blades', 'Sunscreen', 'Moisturizer', 'Cleanser'].map((name, i) => ({ id: 's' + i, name, status: 'ok' }));
/* Typical service intervals; adjust to your owner's manual. mi: miles, mo: months (0 = not used). */
export const DEFAULT_INTERVALS = [
  { id: 'oil', name: 'Oil and filter', mi: 7500, mo: 6 },
  { id: 'rotate', name: 'Tire rotation', mi: 7500, mo: 6 },
  { id: 'cabin', name: 'Cabin air filter', mi: 15000, mo: 12 },
  { id: 'air', name: 'Engine air filter', mi: 20000, mo: 24 },
  { id: 'brake', name: 'Brake inspection', mi: 15000, mo: 12 },
  { id: 'fluid', name: 'Brake fluid', mi: 0, mo: 36 },
  { id: 'wiper', name: 'Wiper blades', mi: 0, mo: 12 },
  { id: 'battery', name: '12V battery check', mi: 0, mo: 36 }
];
export const VEHICLE_FIELDS = [['name', 'Vehicle', 'Year, make, model'], ['plate', 'Plate', ''], ['vin', 'VIN', ''], ['insurer', 'Insurance', 'Company and policy number'], ['lender', 'Loan', 'Lender and account number'], ['tires', 'Tire size and pressure', 'Size and recommended psi'], ['notes', 'Notes', 'Oil type, key code, dealer phone']];
