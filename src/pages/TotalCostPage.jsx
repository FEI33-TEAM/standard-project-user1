import { useState } from 'react';
import FormGroup from '../components/FormGroup';

/* ── Constants ─────────────────────────────────────────────────────────── */

const VAT_RATE        = 0.20; // 20%
const PENSION_RATE    = 0.03; // 3%
const DEFAULT_EUR_UAH = 42;

/** Ставка ввізного мита (%) від митної вартості */
function getDutyRate(ageYears) {
  if (ageYears < 5) return 0.10;
  if (ageYears < 7) return 0.15;
  return 0.20;
}

/** Ставка акцизу (€/куб.см) з урахуванням віку */
function getExciseRatePerCc(cc, ageYears) {
  const BRACKETS = [
    { maxCc: 1000,     rate: 0.109 },
    { maxCc: 1500,     rate: 0.217 },
    { maxCc: 1800,     rate: 0.267 },
    { maxCc: 2500,     rate: 0.267 },
    { maxCc: 3500,     rate: 0.267 },
    { maxCc: Infinity, rate: 2.209 },
  ];
  const bracket = BRACKETS.find((b) => cc <= b.maxCc) ?? BRACKETS.at(-1);
  let rate = bracket.rate;
  if (ageYears >= 7)      rate *= 2.0;
  else if (ageYears >= 5) rate *= 1.5;
  return rate;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function TotalCostPage() {
  const [price,   setPrice]   = useState('');
  const [cc,      setCc]      = useState('');
  const [year,    setYear]    = useState('');
  const [eurRate, setEurRate] = useState(String(DEFAULT_EUR_UAH));
  const [usdRate, setUsdRate] = useState('39');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  const currentYear = new Date().getFullYear();

  function handleCalculate(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const priceNum   = parseFloat(price);
    const ccNum      = parseInt(cc, 10);
    const yearNum    = parseInt(year, 10);
    const eurRateNum = parseFloat(eurRate);
    const usdRateNum = parseFloat(usdRate);

    if (!priceNum || priceNum <= 0)
      return setError('Введи коректну митну вартість авто.');
    if (!ccNum || ccNum < 50 || ccNum > 10000)
      return setError("Введи об'єм двигуна від 50 до 10 000 куб. см.");
    if (!yearNum || yearNum < 1980 || yearNum > currentYear)
      return setError(`Введи рік випуску від 1980 до ${currentYear}.`);
    if (!eurRateNum || eurRateNum <= 0)
      return setError('Введи коректний курс євро.');
    if (!usdRateNum || usdRateNum <= 0)
      return setError('Введи коректний курс долара.');

    // ── Розрахунки ──────────────────────────────────────────────────────
    const ageYears       = currentYear - yearNum;
    const priceUah       = priceNum * usdRateNum;

    // 1. Мито
    const dutyRate       = getDutyRate(ageYears);
    const dutyUsd        = priceNum * dutyRate;
    const dutyUah        = dutyUsd * usdRateNum;

    // 2. Акциз
    const exciseRatePerCc = getExciseRatePerCc(ccNum, ageYears);
    const exciseEur       = ccNum * exciseRatePerCc;
    const exciseUah       = exciseEur * eurRateNum;

    // 3. ПДВ = 20% × (митна вартість + мито + акциз)
    const vatBase        = priceUah + dutyUah + exciseUah;
    const vatUah         = vatBase * VAT_RATE;

    // 4. Пенсійний фонд = 3% × митна вартість
    const pensionUah     = priceUah * PENSION_RATE;

    // 5. Підсумок
    const totalUah       = dutyUah + exciseUah + vatUah + pensionUah;

    setResult({
      priceNum, priceUah, ageYears,
      dutyRate, dutyUah,
      exciseEur, exciseUah,
      vatUah,
      pensionUah,
      totalUah,
      usdRateNum, eurRateNum,
    });
  }

  function handleReset() {
    setPrice('');
    setCc('');
    setYear('');
    setEurRate(String(DEFAULT_EUR_UAH));
    setUsdRate('39');
    setResult(null);
    setError('');
  }

  const uah = (n) =>
    '₴' + n.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <main className="page-content">
      <h1>🧮 Повний розрахунок вартості розмитнення</h1>
      <p>
        Розрахунок усіх обов&apos;язкових платежів: ввізне мито, акциз, ПДВ та внесок
        до пенсійного фонду.
      </p>

      <div className="card">
        <form onSubmit={handleCalculate}>
          <div className="calculators-grid">
            <div>
              <FormGroup
                label="Митна вартість авто (USD)"
                hint="За оцінкою митниці"
              >
                <input
                  type="number" min="1" step="100"
                  placeholder="10000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormGroup>

              <FormGroup
                label="Об'єм двигуна (куб. см)"
                hint="З техпаспорту"
              >
                <input
                  type="number" min="50" max="10000" step="1"
                  placeholder="1600"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Рік випуску авто">
                <input
                  type="number" min="1980" max={currentYear}
                  placeholder={String(currentYear - 5)}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </FormGroup>
            </div>

            <div>
              <FormGroup
                label="Курс USD → UAH (грн за $1)"
                hint="Актуальний курс НБУ"
              >
                <input
                  type="number" min="1" step="0.01"
                  placeholder="39"
                  value={usdRate}
                  onChange={(e) => setUsdRate(e.target.value)}
                />
              </FormGroup>

              <FormGroup
                label="Курс EUR → UAH (грн за €1)"
                hint="Актуальний курс НБУ"
              >
                <input
                  type="number" min="1" step="0.01"
                  placeholder="42"
                  value={eurRate}
                  onChange={(e) => setEurRate(e.target.value)}
                />
              </FormGroup>
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>⚠️ {error}</p>
          )}

          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary">
              Розрахувати
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Скинути
            </button>
          </div>
        </form>

        {result && (
          <div className="result-box">
            <h3>📊 Деталізований розрахунок</h3>

            <div className="result-row">
              <span className="label">Митна вартість авто</span>
              <span className="value">
                ${result.priceNum.toLocaleString('uk-UA')} ({uah(result.priceUah)})
              </span>
            </div>
            <div className="result-row">
              <span className="label">Вік авто</span>
              <span className="value">{result.ageYears} років</span>
            </div>

            <div className="result-row" style={{ marginTop: '.5rem' }}>
              <span className="label">
                🔹 Ввізне мито ({(result.dutyRate * 100).toFixed(0)}%)
              </span>
              <span className="value">{uah(result.dutyUah)}</span>
            </div>
            <div className="result-row">
              <span className="label">
                🔹 Акцизний податок (€{result.exciseEur.toFixed(2)})
              </span>
              <span className="value">{uah(result.exciseUah)}</span>
            </div>
            <div className="result-row">
              <span className="label">🔹 ПДВ (20%)</span>
              <span className="value">{uah(result.vatUah)}</span>
            </div>
            <div className="result-row">
              <span className="label">🔹 Пенсійний фонд (3%)</span>
              <span className="value">{uah(result.pensionUah)}</span>
            </div>

            <div className="result-total">
              <span>💳 Загальна сума платежів</span>
              <span>{uah(result.totalUah)}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
