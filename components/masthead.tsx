import { PriceLine } from "@/components/price-line";

type MastheadProps = {
  volume?: number;
  issue?: number;
  date?: string;
};

export function Masthead({
  volume = 4,
  issue = 9,
  date = "Tuesday, October 13, 2026"
}: MastheadProps) {
  return (
    <header className="masthead">
      <div className="masthead-rule" />
      <h1>The Gefe Gazette</h1>
      <p className="motto">All The Fake Football News That's Fit To Print</p>
      <div className="masthead-rule double" />
      <div className="dateline">
        <span>Volume {toRoman(volume)}</span>
        <span>{date}</span>
        <span>Issue {issue}</span>
      </div>
      <PriceLine />
      <div className="masthead-rule" />
    </header>
  );
}

function toRoman(value: number) {
  const entries: Array<[number, string]> = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let result = "";
  let remaining = value;

  for (const [amount, numeral] of entries) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }
  return result;
}
