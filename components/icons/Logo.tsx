export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <img
      src="/images/Rocket-Science-LLC-Logo.svg"
      className={className}
      alt="Rocket Science LLC Logo"
    />
  );
}