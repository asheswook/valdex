type OptionalMarker = { __optional: true };
type NullableMarker = { __nullable: true };
type MarkerKeys = '__optional' | '__nullable' | '__type';

type ArraySchema = [PrimitiveType | Expression];

type Expression = {
    [key: string | number]: PrimitiveType | Expression | ArraySchema | (PrimitiveType & OptionalMarker) | (PrimitiveType & NullableMarker) | (PrimitiveType & OptionalMarker & NullableMarker) | (Expression & OptionalMarker) | (Expression & NullableMarker) | (Expression & OptionalMarker & NullableMarker) | (ArraySchema & OptionalMarker) | (ArraySchema & NullableMarker) | (ArraySchema & OptionalMarker & NullableMarker) | true
}

type PrimitiveType = NumberConstructor | StringConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | DateConstructor;

type InferPrimitiveType<T> =
    T extends NumberConstructor ? number :
        T extends StringConstructor ? string :
            T extends BooleanConstructor ? boolean :
                T extends ArrayConstructor ? any[] :
                    T extends ObjectConstructor ? object :
                        T extends DateConstructor ? Date :
                            never;

type InferType<T> =
    T extends PrimitiveType & OptionalMarker & NullableMarker
        ? InferPrimitiveType<T> | undefined | null
        : T extends PrimitiveType & OptionalMarker
            ? InferPrimitiveType<T> | undefined
            : T extends PrimitiveType & NullableMarker
                ? InferPrimitiveType<T> | null
                : T extends PrimitiveType
                    ? InferPrimitiveType<T>
                    : T extends ArraySchema & OptionalMarker & NullableMarker
                        ? (T extends [infer U] ? (U extends Expression ? InferType<U>[] : U extends PrimitiveType ? InferPrimitiveType<U>[] : never) : never) | undefined | null
                        : T extends ArraySchema & OptionalMarker
                            ? (T extends [infer U] ? (U extends Expression ? InferType<U>[] : U extends PrimitiveType ? InferPrimitiveType<U>[] : never) : never) | undefined
                            : T extends ArraySchema & NullableMarker
                                ? (T extends [infer U] ? (U extends Expression ? InferType<U>[] : U extends PrimitiveType ? InferPrimitiveType<U>[] : never) : never) | null
                                : T extends [infer U]
                                    ? U extends Expression
                                        ? InferType<U>[]
                                        : U extends PrimitiveType
                                            ? InferPrimitiveType<U>[]
                                            : never
                                    : T extends OptionalMarker & NullableMarker
                                        ? { [K in keyof T as K extends MarkerKeys ? never : K]: InferType<T[K]> } | undefined | null
                                        : T extends OptionalMarker
                                            ? { [K in keyof T as K extends MarkerKeys ? never : K]: InferType<T[K]> } | undefined
                                            : T extends NullableMarker
                                                ? { [K in keyof T as K extends MarkerKeys ? never : K]: InferType<T[K]> } | null
                                                : T extends Expression
                                                    ? { [K in keyof T]: InferType<T[K]> }
                                                    : never;

/**
 * Marks a field as optional.
 * Optional fields pass validation even if they are undefined.
 * The type is inferred as T | undefined.
 * @example
 * ```ts
 * validate(data, {
 *     required_field: String,           // string (required)
 *     optional_field: Optional(String), // string | undefined
 *     optional_object: Optional({       // { id: string } | undefined
 *         id: String
 *     }),
 *     optional_array: Optional([String]) // string[] | undefined
 * });
 * ```
 */
export function Optional<T extends PrimitiveType | Expression | ArraySchema>(ctor: T): T & OptionalMarker {
    return {
        ...ctor as any,
        __optional: true,
        __type: ctor
    } as T & OptionalMarker;
}

/**
 * Marks a field as nullable.
 * Nullable fields pass validation even if they are null.
 * The type is inferred as T | null.
 * @example
 * ```ts
 * validate(data, {
 *     required_field: String,           // string (required)
 *     nullable_field: Nullable(String), // string | null
 *     nullable_object: Nullable({       // { id: string } | null
 *         id: String
 *     }),
 *     nullable_array: Nullable([String]) // string[] | null
 * });
 * ```
 */
export function Nullable<T extends PrimitiveType | Expression | ArraySchema>(ctor: T): T & NullableMarker {
    return {
        ...ctor as any,
        __nullable: true,
        __type: ctor
    } as T & NullableMarker;
}

export class RuntimeTypeError extends Error {
    constructor(
        key: string,
        requiredType: string,
        actualType: string,
        actualValue: any,
        message?: string
    ) {
        if (message) message += ": "
        super(`${message || ""}${key} must be ${requiredType}, but got ${actualType}. Actual value: ${actualValue}`);
    }
}

function getTypeName(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'Array';
    if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
    if (typeof value === 'object') return 'Object';

    const type = typeof value;
    return type.charAt(0).toUpperCase() + type.slice(1);
}

const TYPE_VALIDATORS = new Map<Function, (value: any) => boolean>([
    [Number, (value) => typeof value === 'number' && !Number.isNaN(value)],
    [String, (value) => typeof value === 'string'],
    [Boolean, (value) => typeof value === 'boolean'],
    [Array, (value) => Array.isArray(value)],
    [Object, (value) => typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)],
    [Date, (value) => value instanceof Date && !Number.isNaN(value.getTime())]
]);

function isValidateExpression(ctor: any): ctor is Expression {
    return typeof ctor === 'object' && !Array.isArray(ctor);
}

function isArraySchema(ctor: any): ctor is [PrimitiveType | Expression] {
    return Array.isArray(ctor) && ctor.length === 1;
}

function isOptional(ctor: any): boolean {
    return ctor.__optional === true;
}

function isNullable(ctor: any): boolean {
    return ctor.__nullable === true;
}

function isBothOptionalAndNullable(ctor: any): boolean {
    return ctor.__optional === true && ctor.__nullable === true;
}

function unwrapOptionalNullable(ctor: any): any {
    while (ctor && typeof ctor === 'object' && !Array.isArray(ctor) && ctor.__type) {
        ctor = ctor.__type;
    }
    return ctor;
}

function assertType(key: string, expectedType: string, value: any, isValid: boolean): void {
    if (!isValid) {
        throw new RuntimeTypeError(key, expectedType, getTypeName(value), value);
    }
}

function validateArrayElement(item: any, schema: any, path: string): void {
    if (isArraySchema(schema)) {
        assertType(path, "Array", item, Array.isArray(item));
        const innerSchema = schema[0];
        const arr = item as any[];
        for (let i = 0; i < arr.length; i++) {
            validateArrayElement(arr[i], innerSchema, `${path}[${i}]`);
        }
    } else if (isValidateExpression(schema)) {
        const objectValidator = TYPE_VALIDATORS.get(Object);
        assertType(path, "Object", item, objectValidator?.(item) ?? false);
        validate(item, schema, path);
    } else if (typeof schema === 'function') {
        const validator = TYPE_VALIDATORS.get(schema);
        if (!validator) {
            throw new Error("Invalid array element expression.");
        }
        assertType(path, schema.name, item, validator(item));
    } else {
        throw new Error("Invalid array element expression.");
    }
}

/**
 * Asserts the type of target according to the expression schema.
 * The expression should be represented using primitive type constructors.
 * Supports nested types and array element type validation.
 *
 * Fields not declared in the expression but present in target are ignored.
 *
 * Fields declared in the expression do not allow undefined or null by default.
 * Wrap with Optional() to allow undefined.
 * Wrap with Nullable() to allow null.
 *
 * @param target - The value to validate
 * @param expression - The schema expression to validate against
 * @throws {RuntimeTypeError} When type mismatch occurs
 * @throws {RuntimeTypeError} When value is undefined or null (unless optional/nullable)
 * @example
 * ```ts
 * const data: unknown = getData();
 *
 * validate(data, {
 *     "a": Boolean,
 *     "b": {
 *         "c": Number,
 *         "d": Optional(String),  // string | undefined
 *         "e": Nullable(String)   // string | null
 *     },
 *     "items": [{
 *         "name": String,
 *         "value": Number
 *     }]
 * });
 *
 * // From this point, data is type-asserted
 * data.a // boolean
 * data.b.c // number
 * data.b.d // string | undefined
 * data.b.e // string | null
 * data.items[0].name // string
 * ```
 */
export function validate<T extends Expression>(
    target: any,
    expression: T,
    path: string = ""
): asserts target is InferType<T> {
    for (const key in expression) {
        if (!Object.prototype.hasOwnProperty.call(expression, key)) continue;

        const ctor = expression[key];
        const value = target[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (isBothOptionalAndNullable(ctor)) {
            if (value === undefined || value === null) {
                continue
            }
        } else if (value === undefined && isOptional(ctor)) {
            continue;
        } else if (value === null && isNullable(ctor)) {
            continue;
        } else {
            assertType(currentPath, "not undefined or null", value, value !== undefined && value !== null);
        }

        const unwrappedCtor = unwrapOptionalNullable(ctor);

        if (isArraySchema(unwrappedCtor)) {
            assertType(currentPath, "Array", value, Array.isArray(value));
            const elementSchema = unwrappedCtor[0];
            const arr = value as any[];

            for (let i = 0; i < arr.length; i++) {
                validateArrayElement(arr[i], elementSchema, `${currentPath}[${i}]`);
            }
            continue;
        }

        if (typeof unwrappedCtor === 'function') {
            const validator = TYPE_VALIDATORS.get(unwrappedCtor);
            if (!validator) {
                throw new Error("Invalid expression. Use 'Number' or 'String' or 'Boolean' or 'Array' or 'Object'.");
            }
            assertType(currentPath, unwrappedCtor.name, value, validator(value));
        } else if (isValidateExpression(unwrappedCtor)) {
            const objectValidator = TYPE_VALIDATORS.get(Object)!;
            assertType(currentPath, "Object", value, objectValidator(value));
            validate(value, unwrappedCtor, currentPath);
        } else {
            throw new Error("Invalid expression. Use 'Number' or 'String' or 'Boolean' or 'Array' or 'Object'.");
        }
    }
}