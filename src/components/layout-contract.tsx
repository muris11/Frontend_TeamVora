import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlockSpacingMode = "section" | "compact" | "none";
type BlockDividerMode = "none" | "top" | "bottom" | "both";

const shellSpacingClass: Record<BlockSpacingMode, string> = {
	section: "px-4 py-12 md:px-6 md:py-16",
	compact: "px-4 py-8 md:px-6 md:py-12",
	none: "",
};

const sectionDividerClass: Record<BlockDividerMode, string> = {
	none: "",
	top: "border-border border-t",
	bottom: "border-border border-b",
	both: "border-border border-y",
};

export function getSectionShellClass({
	spacingMode = "section",
	dividerMode = "none",
	className,
}: {
	spacingMode?: BlockSpacingMode;
	dividerMode?: BlockDividerMode;
	className?: string;
}) {
	return cn(shellSpacingClass[spacingMode], sectionDividerClass[dividerMode], className);
}

export function SectionShell({
	children,
	className,
	spacingMode = "section",
	dividerMode = "none",
	...props
}: {
	children: ReactNode;
	className?: string;
	spacingMode?: BlockSpacingMode;
	dividerMode?: BlockDividerMode;
} & React.ComponentProps<"section">) {
	return (
		<section className={getSectionShellClass({ spacingMode, dividerMode, className })} {...props}>
			{children}
		</section>
	);
}

export function ContentRail({
	children,
	className,
	maxWidth = "max-w-6xl",
	...props
}: {
	children: ReactNode;
	className?: string;
	maxWidth?: string;
} & React.ComponentProps<"div">) {
	return (
		<div className={cn("mx-auto w-full", maxWidth, className)} {...props}>
			{children}
		</div>
	);
}

export function BleedLayer({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn("w-full", className)}>{children}</div>;
}
