class AssertionError extends Error {
	name = "AssertionError";
}

export function assertIsDefined<T>(x: T): asserts x is NonNullable<T> {
	if (x == null) {
		throw new AssertionError(`Expected 'x' to be defined, but received ${x}`);
	}
}
