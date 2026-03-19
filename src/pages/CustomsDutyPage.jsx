import { useState } from 'react';
import FormGroup from '../components/FormGroup';

/**
 * Ставки ввізного мита залежно від віку авто.
 * (орієнтовно, для фізичних осіб)
 */
function getDutyRate(ageYears) {
  if (ageYears < 5)  return 0.10; // 10%
  if (ageYears < 7)  return 0.15; // 15%
  return 0.20;                    // 20%
}

export default function CustomsDutyPage() {
  const [price, setPrice]   = useState('');   // митна вартість авто, USD
  const [year,  setYear]    = useState('');   // рік випуску
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');

  const currentYear = new Date().getFullYear();

  function handleCalculate(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const priceNum = parseFloat(price);
    const yearNum  = parseInt(year, 10);

    if (!priceNum || priceNum <= 0) {
      setError('Введи коректну митну вартість авто.');
      return;
    }
    if (!yearNum || yearNum < 1980 || yearNum > currentYear) {
      setError(`Введи рік випуску від 1980 до ${currentYear}.`);
      return;
    }

    const ageYears   = currentYear - yearNum;
    const dutyRate   = getDutyRate(ageYears);
    const dutyAmount = priceNum * dutyRate;

    setResult({ priceNum, ageYears, dutyRate, dutyAmount });
  }

  function handleReset() {
    setPrice('');
    setYear('');
    setResult(null);
    setError('');
  }

  return (
    <main className="page-content">
      <h1>📋 Калькулятор ввізного мита</h1>
      <p>
        Ввізне мито нараховується у відсотках від митної вартості авто.
        Ставка залежить від терміну експлуатації.
      </p>

      <div className="card">
        <form onSubmit={handleCalculate}>
          <FormGroup
            label="Митна вартість авто (USD)"
            hint="Вартість авто за митною декларацією або оцінкою митниці"
          >
            <input
              type="number"
              min="1"
              step="100"
              placeholder="наприклад: 10000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormGroup>

          <FormGroup
            label="Рік випуску авто"
            hint="Вказаний у технічному паспорті"
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
              <span className="label">Митна вартість</span>
              <span className="value">${result.priceNum.toLocaleString('uk-UA')}</span>
            </div>
            <div className="result-row">
              <span className="label">Вік авто</span>
              <span className="value">{result.ageYears} {result.ageYears === 1 ? 'рік' : 'років'}</span>
            </div>
            <div className="result-row">
              <span className="label">Ставка мита</span>
              <span className="value">{(result.dutyRate * 100).toFixed(0)}%</span>
            </div>

            <div className="result-total">
              <span>💳 Сума мита</span>
              <span>${result.dutyAmount.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Пояснення */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>ℹ️ Як нараховується мито?</h3>
        <table className="info-table">
          <thead>
            <tr>
              <th>Вік авто</th>
              <th>Ставка мита</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>До 5 років</td><td>10%</td></tr>
            <tr><td>5–7 років</td><td>15%</td></tr>
            <tr><td>Понад 7 років</td><td>20%</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
