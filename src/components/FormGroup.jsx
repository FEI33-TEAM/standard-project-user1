/**
 * FormGroup — перевикористовуваний компонент поля форми.
 *
 * Props:
 *   label   — текст мітки
 *   hint    — підказка під полем (необов'язково)
 *   children — саме поле вводу
 */
export default function FormGroup({ label, hint, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
