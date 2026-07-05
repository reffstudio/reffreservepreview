"use client"

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { Check, ChevronRight, X } from "lucide-react"
import { registerLead } from "@/app/actions"

const KNOB = 48
const PADDING = 4

export function AccessForm() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [maxOffset, setMaxOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [form, setForm] = useState({ name: "", email: "", city: "" })

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setMaxOffset(track.offsetWidth - KNOB - PADDING * 2)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  const startX = useRef(0)
  const startOffset = useRef(0)
  const draggingRef = useRef(false)
  const offsetRef = useRef(0)
  const maxOffsetRef = useRef(0)

  useEffect(() => {
    maxOffsetRef.current = maxOffset
  }, [maxOffset])

  const detach = useRef<() => void>(() => {})

  function handlePointerDown(e: React.PointerEvent) {
    if (open) return
    e.preventDefault()
    draggingRef.current = true
    startX.current = e.clientX
    startOffset.current = offsetRef.current
    setDragging(true)

    function onMove(ev: PointerEvent) {
      if (!draggingRef.current) return
      const delta = ev.clientX - startX.current
      const next = Math.min(Math.max(startOffset.current + delta, 0), maxOffsetRef.current)
      offsetRef.current = next
      setOffset(next)
    }

    function onUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      setDragging(false)
      if (offsetRef.current >= maxOffsetRef.current - 6) {
        offsetRef.current = maxOffsetRef.current
        setOffset(maxOffsetRef.current)
        setOpen(true)
      } else {
        offsetRef.current = 0
        setOffset(0)
      }
      detach.current()
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    detach.current = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }

  useEffect(() => () => detach.current(), [])

  function closeModal() {
    setOpen(false)
    if (!submitted) {
      offsetRef.current = 0
      setOffset(0)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.city.trim()) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await registerLead(formData)

    setLoading(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setSuccessMessage(result.message)
    setSubmitted(true)
  }

  const progress = maxOffset > 0 ? offset / maxOffset : 0

  return (
    <div className="w-full max-w-md">
      {submitted ? (
        <div className="animate-in border-l border-foreground pl-4 duration-1000 fade-in">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            [ Confirmed ]
          </p>
          <p className="mt-2 text-pretty text-base leading-relaxed text-foreground">
            {successMessage === "YOU ARE ALREADY ON THE PRIVATE LIST."
              ? successMessage
              : `You are on the list. Updates will arrive to ${form.email}.`}
          </p>
        </div>
      ) : (
        <>
          {/* Slide to confirm */}
          <div
            ref={trackRef}
            className="relative flex h-14 w-full select-none items-center overflow-hidden rounded-full bg-primary"
            style={{ padding: PADDING }}
          >
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 pl-6 font-mono text-xs font-medium tracking-widest text-primary-foreground uppercase transition-opacity"
              style={{ opacity: 1 - progress * 1.4 }}
            >
              Swipe to receive updates
              <span className="flex items-center" aria-hidden="true">
                <ChevronRight
                  className="h-3.5 w-3.5"
                  style={{ animation: "arrow-flow 1.4s ease-in-out infinite", animationDelay: "0s" }}
                />
                <ChevronRight
                  className="-ml-2 h-3.5 w-3.5 blur-[1px]"
                  style={{ animation: "arrow-flow 1.4s ease-in-out infinite", animationDelay: "0.2s" }}
                />
                <ChevronRight
                  className="-ml-2 h-3.5 w-3.5 blur-[2px]"
                  style={{ animation: "arrow-flow 1.4s ease-in-out infinite", animationDelay: "0.4s" }}
                />
              </span>
            </span>
            <button
              type="button"
              aria-label="Swipe to receive updates"
              onPointerDown={handlePointerDown}
              className="relative z-10 flex items-center justify-center rounded-full bg-primary-foreground text-primary shadow-sm"
              style={{
                width: KNOB,
                height: KNOB,
                transform: `translateX(${offset}px)`,
                transition: dragging ? "none" : "transform 0.3s ease-out",
                cursor: dragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
            >
              <img
                src="/reff-reserve-icon.png"
                alt=""
                className="h-6 w-6"
                style={{ animation: "slow-spin 8s linear infinite" }}
              />
            </button>
          </div>
          <p className="mt-8 text-center font-mono text-xs text-muted-foreground italic">
            *Currently under private development.
          </p>
        </>
      )}

      {/* Mini popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reserve-modal-title"
          onClick={closeModal}
        >
          <div
            className="animate-in relative w-full max-w-sm border border-border bg-card p-8 duration-300 fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-6 w-6" />
                </span>
                <p className="mt-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  [ Confirmed ]
                </p>
                <p className="mt-2 text-pretty text-base leading-relaxed text-foreground">
                  {successMessage === "YOU ARE ALREADY ON THE PRIVATE LIST."
                    ? successMessage
                    : "You are on the list."}
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 h-11 w-full rounded-none border border-foreground bg-primary font-mono text-xs font-medium tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p
                  id="reserve-modal-title"
                  className="font-mono text-xs tracking-widest text-muted-foreground uppercase"
                >
                  [ Receive Updates ]
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                  Join the list
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={loading}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-11 rounded-none border border-input bg-transparent px-3 font-mono text-sm text-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="modal-email" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      Email
                    </label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      required
                      disabled={loading}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="h-11 rounded-none border border-input bg-transparent px-3 font-mono text-sm text-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      disabled={loading}
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      className="h-11 rounded-none border border-input bg-transparent px-3 font-mono text-sm text-foreground focus:border-foreground focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  {error && (
                    <p className="font-mono text-[11px] tracking-widest text-destructive uppercase">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 h-11 rounded-none border border-foreground bg-primary font-mono text-xs font-medium tracking-widest text-primary-foreground uppercase transition-colors hover:bg-transparent hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
                  >
                    {loading ? "PROCESSING..." : "Confirm"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
