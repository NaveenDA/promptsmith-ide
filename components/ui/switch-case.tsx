import { type ReactNode, Children, isValidElement } from "react";

type CaseProps = {
	value: string;
	children: ReactNode;
	/**
	 * Whether to auto-focus the first focusable element in this case
	 * @default false
	 */
	autoFocus?: boolean;
};

type SwitchCaseProps = {
	value?: string;
	children: ReactNode;
	fallback?: ReactNode;
};

export const Case = ({ children }: CaseProps) => {
	return <>{children}</>;
};

// Type guard to check if an element is a Case component
const isCaseElement = (
	child: unknown,
): child is React.ReactElement<CaseProps> => {
	if (!isValidElement(child)) return false;
	const props = child.props as Partial<CaseProps>;
	return typeof props.value === "string";
};

const SwitchCase = ({ value, children, fallback }: SwitchCaseProps) => {
	// Filter and map valid Case components
	const validChildren = Children.toArray(children).filter(isCaseElement);

	// Find the matching case
	const matchingCase = validChildren.find(
		(child) => child.props.value === value,
	);

	// Handle auto-focus if needed
	if (matchingCase?.props?.autoFocus) {
		setTimeout(() => {
			const focusable = document.querySelector(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			) as HTMLElement;
			focusable?.focus();
		}, 0);
	}

	return matchingCase || fallback || null;
};

export default SwitchCase;
