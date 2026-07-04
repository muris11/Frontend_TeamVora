export const motionSpring = {
	default: { type: "spring" as const, stiffness: 380, damping: 28 },
	soft: { type: "spring" as const, stiffness: 300, damping: 32 },
	snappy: { type: "spring" as const, stiffness: 420, damping: 22 },
	visual: { type: "spring" as const, stiffness: 380, damping: 24 },
} as const;

export const motionDuration = {
	fast: 0.2,
	base: 0.5,
	slow: 0.8,
} as const;

export const motionStagger = {
	item: 0.06,
	group: 0.08,
} as const;

export const motionViewport = {
	once: true,
	margin: "-10%",
} as const;

export const motionScale = {
	hover: 1.02,
	press: 0.98,
} as const;

/** Default spring — use in marketing sections and landing UI. */
export const defaultSpring = motionSpring.default;
