import { useState } from 'react';
import FormGroup from '../components/FormGroup';

/**
 * Ставки акцизного податку на автомобілі (євро за 1 куб. см двигуна).
 * Джерело: Податковий кодекс України, ст. 215.
 * Дані орієнтовні — перевіряй актуальні ставки.
 *
 * Структура: { maxCc, ratePerCc, ageLabel }
 *   maxCc      — верхня межа об'єму (куб. см)
 *   ratePerCc  — базова ставка €/куб.см (для авто до 5 років)
 *   ageBonus   — множник для авто 5–7 р. та 7+ р.
 */
const EXCISE_RATES = [
  { label: 'до 1000 куб. см',       maxCc: 1000,  ratePerCc: 0.109 },
  { label: '1001–1500 куб. см',     maxCc: 1500,  ratePerCc: 0.217 },
  { label: '1501–1800 куб. см',     maxCc: 1800,  ratePerCc: 0.267 },
  { label: '1801–2500 куб. см',     maxCc: 2500,  ratePerCc: 0.267 },
  { label: '2501–3500 куб. см',     maxCc: 3500,  ratePerCc: 0.267 },
  { label: 'понад 3500 куб. см',    maxCc: Infinity, ratePerCc: 2.209 },
];

/**
 * Повертає ставку акцизу (€/куб.см) залежно від об'єму та віку авто.
 * Для авто 5–7 р. ставка збільшується на 50%, 7+ р. — на 100%.
 */
function getExciseRate(cc, ageYears) {
  const bracket    = EXCISE_RATES.find((r) => cc <= r.maxCc) ?? EXCISE_RATES.at(-1);
  let   baseRate   = bracket.ratePerCc;

  if (ageYears >= 7)       baseRate *= 2.0;
  else if (ageYears >= 5)  baseRate *= 1.5;

  return baseRate;
}

const EUR_TO_UAH = 42; // орієнтовний курс

export default function ExciseTaxPage() {
  const [cc,       setCc]      = useState('');
  const [year,     setYear]    = useState('');
  const [eurRate,  setEurRate] = useState(String(EUR_TO_UAH));
  const [result,   setResult]  = useState(null);
  const [error,    setError]   = useState('');

  const currentYear = new Date().getFullYear();

  function handleCalculate(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const ccNum      = parseInt(cc, 10);
    const yearNum    = parseInt(year, 10);
    const eurRateNum = parseFloat(eurRate);

    if (!ccNum || ccNum < 50 || ccNum > 10000) {
      setError('Введи об\'єм двигуна від 50 до 10 000 куб. см.');
      return;
    }
    if (!yearNum || yearNum < 1980 || yearNum > currentYear) {
      setError(`Введи рік випуску від 1980 до ${currentYear}.`);
      return;
    }
    if (!eurRateNum || eurRateNum <= 0) {
      setError('Введи коректний курс євро.');
      return;
    }

    const ageYears    = currentYear - yearNum;
    const ratePerCc   = getExciseRate(ccNum, ageYears);
    const exciseEur   = ccNum * ratePerCc;
    const exciseUah   = exciseEur * eurRateNum;

    setResult({ ccNum, ageYears, ratePerCc, exciseEur, exciseUah, eurRateNum });
  }

  function handleReset() {
    setCc('');
    setYear('');
    setEurRate(String(EUR_TO_UAH));
    setResult(null);
    setError('');
  }

  return (
    <main className="page-content">
      <h1>💰 Калькулятор акцизного податку</h1>
      <p>
        Акцизний податок розраховується за об&apos;ємом двигуна (куб. см). Ставка у євро,
        тому враховується курс НБУ на день митного оформлення.
      </p>

      <div className="card">
        <form onSubmit={handleCalculate}>
          <FormGroup
            label="Об'єм двигуна (куб. см)"
            hint="Вказано в техпаспорті або специфікації авто"
          >
            <input
              type="number"
              min="50"
              max="10000"
              step="1"
              placeholder="наприклад: 1600"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </FormGroup>

          <FormGroup
            label="Рік випуску авто"
            hint="Впливає на ставку акцизу"
          >
            <input
              type="number"
              min="1980"
              max={currentYear}
              placeholder={`наприклад: ${currentYear - 5}`}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </FormGroup>

          <FormGroup
            label="Курс євро (грн за 1 €)"
            hint="Актуальний курс НБУ"
          >
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="42"
              value={eurRate}
              onChange={(e) => setEurRate(e.target.value)}
            />
          </FormGroup>

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
            <h3>📊 Результат розрахунку</h3>
            <div className="result-row">
              <span className="label">Об&apos;єм двигуна</span>
              <span className="value">{result.ccNum} куб. см</span>
            </div>
            <div className="result-row">
              <span className="label">Вік авто</span>
              <span className="value">{result.ageYears} років</span>
            </div>
            <div className="result-row">
              <span className="label">Ставка акцизу</span>
              <span className="value">€{result.ratePerCc.toFixed(3)} / куб. см</span>
            </div>
            <div className="result-row">
              <span className="label">Акциз у євро</span>
              <span className="value">€{result.exciseEur.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="result-total">
              <span>💳 Акциз у гривнях</span>
              <span>₴{result.exciseUah.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Таблиця ставок */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>ℹ️ Таблиця ставок акцизу (базові, для авто до 5 років)</h3>
        <table className="info-table">
          <thead>
            <tr>
              <th>Об&apos;єм двигуна</th>
              <th>Ставка (€/куб.см)</th>
            </tr>
          </thead>
          <tbody>
            {EXCISE_RATES.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>€{r.ratePerCc.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '.8rem', color: 'var(--text)', marginTop: '.5rem' }}>
          Для авто 5–7 р. ставка ×1.5, для авто 7+ р. — ×2.
        </p>
      </div>
    </main>
  );
}
