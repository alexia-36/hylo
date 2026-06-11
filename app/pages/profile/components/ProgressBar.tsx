type Props = {
  value: number;
  max: number;
};

export default function ProgressBar({ value, max }: Props) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
      <div
        className=" h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 transition-all duration-500"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}
