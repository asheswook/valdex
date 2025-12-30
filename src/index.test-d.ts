import { expectType, expectNotType } from 'tsd';
import { validate, Optional, Nullable, InferType } from './index';

/**
 * Basic Type Inference Tests
 */

// Primitive types
{
    const schema = { name: String, age: Number, active: Boolean };
    type Schema = InferType<typeof schema>;

    expectType<{ name: string; age: number; active: boolean }>({} as Schema);
}

/**
 * Optional Type Inference Tests
 */

// Optional primitive - should not be never
{
    const schema = { field: Optional(String) };
    type Schema = InferType<typeof schema>;
    type FieldType = Schema['field'];

    expectType<string | undefined>({} as FieldType);
    expectNotType<never>({} as FieldType);
}

// Optional object - THE BUG CASE: should not be never
{
    const schema = {
        status: String,
        error: Optional({
            name: String,
            message: String,
        }),
    };
    type Schema = InferType<typeof schema>;
    type ErrorType = Schema['error'];

    // This was the bug: error was inferred as never
    expectNotType<never>({} as ErrorType);
    expectType<{ name: string; message: string } | undefined>({} as ErrorType);
}

// Optional array - should not be never
{
    const schema = { items: Optional([String]) };
    type Schema = InferType<typeof schema>;
    type ItemsType = Schema['items'];

    expectType<string[] | undefined>({} as ItemsType);
    expectNotType<never>({} as ItemsType);
}

/**
 * Nullable Type Inference Tests
 */

// Nullable primitive
{
    const schema = { field: Nullable(String) };
    type Schema = InferType<typeof schema>;
    type FieldType = Schema['field'];

    expectType<string | null>({} as FieldType);
    expectNotType<never>({} as FieldType);
}

// Nullable object - should not be never
{
    const schema = {
        data: Nullable({
            id: Number,
            value: String,
        }),
    };
    type Schema = InferType<typeof schema>;
    type DataType = Schema['data'];

    expectNotType<never>({} as DataType);
    expectType<{ id: number; value: string } | null>({} as DataType);
}

// Nullable array
{
    const schema = { items: Nullable([Number]) };
    type Schema = InferType<typeof schema>;
    type ItemsType = Schema['items'];

    expectType<number[] | null>({} as ItemsType);
    expectNotType<never>({} as ItemsType);
}

/**
 * Combined Optional & Nullable Tests
 */

// Optional(Nullable()) primitive
{
    const schema = { field: Optional(Nullable(String)) };
    type Schema = InferType<typeof schema>;
    type FieldType = Schema['field'];

    expectType<string | null | undefined>({} as FieldType);
    expectNotType<never>({} as FieldType);
}

// Optional(Nullable()) object
{
    const schema = {
        config: Optional(Nullable({
            enabled: Boolean,
            value: Number,
        })),
    };
    type Schema = InferType<typeof schema>;
    type ConfigType = Schema['config'];

    expectNotType<never>({} as ConfigType);
    expectType<{ enabled: boolean; value: number } | null | undefined>({} as ConfigType);
}

// Optional(Nullable()) array
{
    const schema = { tags: Optional(Nullable([String])) };
    type Schema = InferType<typeof schema>;
    type TagsType = Schema['tags'];

    expectType<string[] | null | undefined>({} as TagsType);
    expectNotType<never>({} as TagsType);
}

/**
 * Nested Structure Tests
 */

// Deeply nested Optional object
{
    const schema = {
        user: Optional({
            profile: {
                settings: Optional({
                    theme: String,
                }),
            },
        }),
    };
    type Schema = InferType<typeof schema>;
    type UserType = Schema['user'];

    expectNotType<never>({} as UserType);
}

// Array of objects with Optional fields
{
    const schema = {
        items: [{
            id: Number,
            label: Optional(String),
        }],
    };
    type Schema = InferType<typeof schema>;
    type ItemType = Schema['items'][number];

    expectType<{ id: number; label: string | undefined }>({} as ItemType);
    expectNotType<never>({} as ItemType);
}

/**
 * validate() Type Narrowing Tests
 */

// After validate(), types should be correctly narrowed
{
    const schema = {
        status: String,
        error: Optional({
            code: Number,
            message: String,
        }),
    };

    const data: unknown = { status: 'ok' };
    validate(data, schema);

    // After validation, data should have correct types
    expectType<string>(data.status);
    expectType<{ code: number; message: string } | undefined>(data.error);
}
