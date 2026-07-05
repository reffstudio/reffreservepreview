export function BackgroundTicker() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 translate-y-1/2 select-none"
    >
      <img
        src="/reff-reserve-icon.png"
        alt=""
        className="h-[50vh] max-h-[420px] w-[80vw] max-w-none object-contain opacity-[0.06] md:w-[42vw]"
        style={{ animation: "slow-spin 40s linear infinite" }}
      />
    </div>
  )
}
