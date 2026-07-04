"use client";

import {
	createContext,
	useContext,
	type ReactNode,
	type RefObject,
} from "react";
import {
	useScroll,
	useSpring,
	useTransform,
	type UseScrollOptions,
} from "motion/react";

const SectionScrollContainerContext =
	createContext<RefObject<HTMLElement | null> | null>(null);

/** Sticky stack pin offsets — shared by features/blog stack blocks. */
export const STACK_CARD_TOP_BASE = 88;
export const STACK_CARD_TOP_STEP = 28;

/** Spring follow for scroll-linked card motion — soft settle, no bounce. */
export const stackCardScrollSpring = {
	stiffness: 120,
	damping: 34,
	mass: 0.28,
	restDelta: 0.0008,
} as const;

export function SectionScrollContainerProvider({
	containerRef,
	children,
}: {
	containerRef: RefObject<HTMLElement | null>;
	children: ReactNode;
}) {
	return (
		<SectionScrollContainerContext.Provider value={containerRef}>
			{children}
		</SectionScrollContainerContext.Provider>
	);
}

/** useScroll with optional preview scrollport (Nusaiba block preview). Falls back to document scroll. */
export function useSectionScroll(options: UseScrollOptions = {}) {
	const containerRef = useContext(SectionScrollContainerContext);

	return useScroll({
		...options,
		...(containerRef ? { container: containerRef } : {}),
	});
}

/** Smooth sticky-stack transforms (y, scale, blur) for scroll-linked cards. */
export function useStackCardScrollMotion(
	target: RefObject<HTMLElement | null>,
	reduceMotion: boolean,
) {
	const { scrollYProgress } = useSectionScroll({
		target,
		offset: ["start 0.97", "start 0.36"],
	});

	const smoothProgress = useSpring(scrollYProgress, stackCardScrollSpring);
	const progress = reduceMotion ? scrollYProgress : smoothProgress;

	const y = useTransform(progress, [0, 0.55, 1], [52, 10, 0]);
	const scale = useTransform(progress, [0, 0.45, 1], [0.982, 0.992, 1]);
	const filter = useTransform(progress, [0, 0.7, 1], ["blur(3px)", "blur(1px)", "blur(0px)"]);

	return { y, scale, filter };
}
