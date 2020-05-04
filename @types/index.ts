/**
 * Type used to omit props from interface
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
