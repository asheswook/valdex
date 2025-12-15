# valdex

Runtime type validation with TypeScript type inference.

## Installation

```bash
npm install valdex
```

## Features

- Runtime type validation for unknown data
- Automatic TypeScript type inference from schema
- Support for nested objects and arrays
- Optional and nullable field modifiers
- Zero dependencies

## Usage

### Basic Validation

```typescript
import { validate } from 'valdex';

const data: unknown = await fetchData();

validate(data, {
    name: String,
    age: Number,
    active: Boolean
});

// TypeScript now knows the exact type of data
data.name   // string
data.age    // number
data.active // boolean
```

### Nested Objects

```typescript
validate(data, {
    user: {
        id: Number,
        profile: {
            name: String,
            email: String
        }
    }
});

data.user.profile.name // string
```

### Arrays

```typescript
validate(data, {
    tags: [String],           // string[]
    items: [{                 // { id: number, name: string }[]
        id: Number,
        name: String
    }]
});

data.tags[0]       // string
data.items[0].id   // number
```

### Optional Fields

Use `Optional()` to allow `undefined` values:

```typescript
import { validate, Optional } from 'valdex';

validate(data, {
    required: String,
    optional: Optional(String),      // string | undefined
    optionalObject: Optional({       // { id: number } | undefined
        id: Number
    }),
    optionalArray: Optional([Number]) // number[] | undefined
});
```

### Nullable Fields

Use `Nullable()` to allow `null` values:

```typescript
import { validate, Nullable } from 'valdex';

validate(data, {
    required: String,
    nullable: Nullable(String),      // string | null
    nullableObject: Nullable({       // { id: number } | null
        id: Number
    })
});
```

### Combining Optional and Nullable

```typescript
import { validate, Optional, Nullable } from 'valdex';

validate(data, {
    field: Optional(Nullable(String)) // string | undefined | null
});
```

## Supported Types

| Constructor | TypeScript Type |
|-------------|-----------------|
| `String`    | `string`        |
| `Number`    | `number`        |
| `Boolean`   | `boolean`       |
| `Array`     | `any[]`         |
| `Object`    | `object`        |

## Error Handling

When validation fails, a `RuntimeTypeError` is thrown:

```typescript
import { validate, RuntimeTypeError } from 'valdex';

try {
    validate(data, { count: Number });
} catch (error) {
    if (error instanceof RuntimeTypeError) {
        console.error(error.message);
        // "count must be Number, but got String. Actual value: hello"
    }
}
```

## How It Works

- Fields not declared in the schema but present in data are ignored
- All declared fields are required by default (no `undefined` or `null`)
- Use `Optional()` to allow `undefined`
- Use `Nullable()` to allow `null`
- `NaN` is not considered a valid `Number`

## License

MIT
