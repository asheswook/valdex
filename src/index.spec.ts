import { validate, Optional, Nullable, RuntimeTypeError } from './index';

describe('validate', () => {
    describe('primitive types', () => {
        describe('Number', () => {
            it('should validate positive number', () => {
                expect(() => validate({ a: 1 }, { a: Number })).not.toThrow();
            });

            it('should validate negative number', () => {
                expect(() => validate({ a: -42 }, { a: Number })).not.toThrow();
            });

            it('should validate zero', () => {
                expect(() => validate({ a: 0 }, { a: Number })).not.toThrow();
            });

            it('should validate float', () => {
                expect(() => validate({ a: 3.14159 }, { a: Number })).not.toThrow();
            });

            it('should validate Infinity', () => {
                expect(() => validate({ a: Infinity }, { a: Number })).not.toThrow();
            });

            it('should validate -Infinity', () => {
                expect(() => validate({ a: -Infinity }, { a: Number })).not.toThrow();
            });

            it('should reject NaN', () => {
                expect(() => validate({ a: NaN }, { a: Number })).toThrow(RuntimeTypeError);
            });

            it('should reject string', () => {
                expect(() => validate({ a: '123' }, { a: Number })).toThrow(RuntimeTypeError);
            });

            it('should reject boolean', () => {
                expect(() => validate({ a: true }, { a: Number })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: Number })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: Number })).toThrow(RuntimeTypeError);
            });
        });

        describe('String', () => {
            it('should validate non-empty string', () => {
                expect(() => validate({ a: 'hello' }, { a: String })).not.toThrow();
            });

            it('should validate empty string', () => {
                expect(() => validate({ a: '' }, { a: String })).not.toThrow();
            });

            it('should validate string with whitespace', () => {
                expect(() => validate({ a: '   ' }, { a: String })).not.toThrow();
            });

            it('should validate string with unicode', () => {
                expect(() => validate({ a: '한글🎉' }, { a: String })).not.toThrow();
            });

            it('should reject number', () => {
                expect(() => validate({ a: 123 }, { a: String })).toThrow(RuntimeTypeError);
            });

            it('should reject boolean', () => {
                expect(() => validate({ a: false }, { a: String })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: String })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: String })).toThrow(RuntimeTypeError);
            });

            it('should reject object', () => {
                expect(() => validate({ a: {} }, { a: String })).toThrow(RuntimeTypeError);
            });
        });

        describe('Boolean', () => {
            it('should validate true', () => {
                expect(() => validate({ a: true }, { a: Boolean })).not.toThrow();
            });

            it('should validate false', () => {
                expect(() => validate({ a: false }, { a: Boolean })).not.toThrow();
            });

            it('should reject number 0', () => {
                expect(() => validate({ a: 0 }, { a: Boolean })).toThrow(RuntimeTypeError);
            });

            it('should reject number 1', () => {
                expect(() => validate({ a: 1 }, { a: Boolean })).toThrow(RuntimeTypeError);
            });

            it('should reject string', () => {
                expect(() => validate({ a: 'true' }, { a: Boolean })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: Boolean })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: Boolean })).toThrow(RuntimeTypeError);
            });
        });

        describe('Date', () => {
            it('should validate valid Date object', () => {
                expect(() => validate({ a: new Date() }, { a: Date })).not.toThrow();
            });

            it('should validate Date from timestamp', () => {
                expect(() => validate({ a: new Date(0) }, { a: Date })).not.toThrow();
            });

            it('should validate Date from ISO string', () => {
                expect(() => validate({ a: new Date('2024-01-01T00:00:00.000Z') }, { a: Date })).not.toThrow();
            });

            it('should reject invalid Date', () => {
                expect(() => validate({ a: new Date('invalid') }, { a: Date })).toThrow(RuntimeTypeError);
            });

            it('should reject date string', () => {
                expect(() => validate({ a: '2024-01-01' }, { a: Date })).toThrow(RuntimeTypeError);
            });

            it('should reject timestamp number', () => {
                expect(() => validate({ a: 1704067200000 }, { a: Date })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: Date })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: Date })).toThrow(RuntimeTypeError);
            });
        });

        describe('Array', () => {
            it('should validate empty array', () => {
                expect(() => validate({ a: [] }, { a: Array })).not.toThrow();
            });

            it('should validate array with elements', () => {
                expect(() => validate({ a: [1, 2, 3] }, { a: Array })).not.toThrow();
            });

            it('should validate array with mixed types', () => {
                expect(() => validate({ a: [1, 'two', true] }, { a: Array })).not.toThrow();
            });

            it('should reject object', () => {
                expect(() => validate({ a: {} }, { a: Array })).toThrow(RuntimeTypeError);
            });

            it('should reject string', () => {
                expect(() => validate({ a: 'array' }, { a: Array })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: Array })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: Array })).toThrow(RuntimeTypeError);
            });
        });

        describe('Object', () => {
            it('should validate empty object', () => {
                expect(() => validate({ a: {} }, { a: Object })).not.toThrow();
            });

            it('should validate object with properties', () => {
                expect(() => validate({ a: { foo: 'bar' } }, { a: Object })).not.toThrow();
            });

            it('should validate nested object', () => {
                expect(() => validate({ a: { nested: { deep: true } } }, { a: Object })).not.toThrow();
            });

            it('should reject array', () => {
                expect(() => validate({ a: [] }, { a: Object })).toThrow(RuntimeTypeError);
            });

            it('should reject Date', () => {
                expect(() => validate({ a: new Date() }, { a: Object })).toThrow(RuntimeTypeError);
            });

            it('should reject null', () => {
                expect(() => validate({ a: null }, { a: Object })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined', () => {
                expect(() => validate({ a: undefined }, { a: Object })).toThrow(RuntimeTypeError);
            });

            it('should reject primitive string', () => {
                expect(() => validate({ a: 'object' }, { a: Object })).toThrow(RuntimeTypeError);
            });

            it('should reject number', () => {
                expect(() => validate({ a: 42 }, { a: Object })).toThrow(RuntimeTypeError);
            });
        });
    });

    describe('nested objects', () => {
        it('should validate nested objects', () => {
            const data = { user: { profile: { name: 'John' } } };
            expect(() => validate(data, {
                user: { profile: { name: String } }
            })).not.toThrow();
        });

        it('should validate deeply nested objects (4 levels)', () => {
            const data = { a: { b: { c: { d: 'deep' } } } };
            expect(() => validate(data, {
                a: { b: { c: { d: String } } }
            })).not.toThrow();
        });

        it('should validate nested object with multiple fields', () => {
            const data = {
                user: {
                    name: 'John',
                    age: 30,
                    active: true
                }
            };
            expect(() => validate(data, {
                user: {
                    name: String,
                    age: Number,
                    active: Boolean
                }
            })).not.toThrow();
        });

        it('should reject when nested field has wrong type', () => {
            const data = { user: { profile: { name: 123 } } };
            expect(() => validate(data, {
                user: { profile: { name: String } }
            })).toThrow(RuntimeTypeError);
        });

        it('should reject when nested object is missing', () => {
            const data = { user: {} };
            expect(() => validate(data, {
                user: { profile: { name: String } }
            })).toThrow(RuntimeTypeError);
        });

        it('should reject when nested object is null', () => {
            const data = { user: { profile: null } };
            expect(() => validate(data, {
                user: { profile: { name: String } }
            })).toThrow(RuntimeTypeError);
        });

        it('should ignore extra fields not in schema', () => {
            const data = {
                user: { name: 'John', extra: 'ignored', another: 123 }
            };
            expect(() => validate(data, {
                user: { name: String }
            })).not.toThrow();
        });
    });

    describe('arrays', () => {
        describe('array schema [Type]', () => {
            it('should validate empty array', () => {
                expect(() => validate({ items: [] }, { items: [String] })).not.toThrow();
            });

            it('should validate array of strings', () => {
                expect(() => validate({ tags: ['a', 'b', 'c'] }, { tags: [String] })).not.toThrow();
            });

            it('should validate array of numbers', () => {
                expect(() => validate({ nums: [1, 2, 3] }, { nums: [Number] })).not.toThrow();
            });

            it('should validate array of booleans', () => {
                expect(() => validate({ flags: [true, false, true] }, { flags: [Boolean] })).not.toThrow();
            });

            it('should validate array of dates', () => {
                expect(() => validate({ dates: [new Date(), new Date()] }, { dates: [Date] })).not.toThrow();
            });

            it('should reject when array element has wrong type', () => {
                expect(() => validate({ tags: ['a', 123, 'c'] }, { tags: [String] })).toThrow(RuntimeTypeError);
            });

            it('should reject when array contains null', () => {
                expect(() => validate({ nums: [1, null, 3] }, { nums: [Number] })).toThrow(RuntimeTypeError);
            });

            it('should reject when array contains undefined', () => {
                expect(() => validate({ nums: [1, undefined, 3] }, { nums: [Number] })).toThrow(RuntimeTypeError);
            });

            it('should reject when field is not an array', () => {
                expect(() => validate({ items: 'not array' }, { items: [String] })).toThrow(RuntimeTypeError);
            });

            it('should reject when field is object instead of array', () => {
                expect(() => validate({ items: { 0: 'a' } }, { items: [String] })).toThrow(RuntimeTypeError);
            });
        });

        describe('array of objects', () => {
            it('should validate array of objects', () => {
                const data = { items: [{ id: 1 }, { id: 2 }] };
                expect(() => validate(data, { items: [{ id: Number }] })).not.toThrow();
            });

            it('should validate empty array of objects', () => {
                const data = { items: [] };
                expect(() => validate(data, { items: [{ id: Number }] })).not.toThrow();
            });

            it('should validate array of complex objects', () => {
                const data = {
                    users: [
                        { id: 1, name: 'Alice', active: true },
                        { id: 2, name: 'Bob', active: false }
                    ]
                };
                expect(() => validate(data, {
                    users: [{
                        id: Number,
                        name: String,
                        active: Boolean
                    }]
                })).not.toThrow();
            });

            it('should reject when object in array has wrong field type', () => {
                const data = { items: [{ id: 1 }, { id: 'two' }] };
                expect(() => validate(data, { items: [{ id: Number }] })).toThrow(RuntimeTypeError);
            });

            it('should reject when object in array is missing required field', () => {
                const data = { items: [{ id: 1 }, { name: 'no id' }] };
                expect(() => validate(data, { items: [{ id: Number }] })).toThrow(RuntimeTypeError);
            });

            it('should reject when array element is not an object', () => {
                const data = { items: [{ id: 1 }, 'not object'] };
                expect(() => validate(data, { items: [{ id: Number }] })).toThrow(RuntimeTypeError);
            });

            it('should reject when array element is null', () => {
                const data = { items: [{ id: 1 }, null] };
                expect(() => validate(data, { items: [{ id: Number }] })).toThrow(RuntimeTypeError);
            });
        });

        describe('nested arrays in objects', () => {
            it('should validate object containing multiple arrays', () => {
                const data = {
                    tags: ['a', 'b'],
                    scores: [1, 2, 3]
                };
                expect(() => validate(data, {
                    tags: [String],
                    scores: [Number]
                })).not.toThrow();
            });

            it('should validate deeply nested array in object', () => {
                const data = {
                    user: {
                        profile: {
                            tags: ['developer', 'designer']
                        }
                    }
                };
                expect(() => validate(data, {
                    user: {
                        profile: {
                            tags: [String]
                        }
                    }
                })).not.toThrow();
            });

            it('should validate array of objects with nested objects', () => {
                const data = {
                    items: [
                        { id: 1, meta: { score: 100 } },
                        { id: 2, meta: { score: 200 } }
                    ]
                };
                expect(() => validate(data, {
                    items: [{
                        id: Number,
                        meta: { score: Number }
                    }]
                })).not.toThrow();
            });

            it('should validate array of objects with nested arrays', () => {
                const data = {
                    categories: [
                        { name: 'A', items: ['a1', 'a2'] },
                        { name: 'B', items: ['b1', 'b2', 'b3'] }
                    ]
                };
                expect(() => validate(data, {
                    categories: [{
                        name: String,
                        items: [String]
                    }]
                })).not.toThrow();
            });
        });
    });

    describe('Optional modifier', () => {
        describe('Optional primitives', () => {
            it('should allow missing field for Optional String', () => {
                const data = { required: 'hello' };
                expect(() => validate(data, {
                    required: String,
                    optional: Optional(String)
                })).not.toThrow();
            });

            it('should allow undefined for Optional Number', () => {
                const data = { num: undefined };
                expect(() => validate(data, { num: Optional(Number) })).not.toThrow();
            });

            it('should allow undefined for Optional Boolean', () => {
                const data = { flag: undefined };
                expect(() => validate(data, { flag: Optional(Boolean) })).not.toThrow();
            });

            it('should allow undefined for Optional Date', () => {
                const data = { date: undefined };
                expect(() => validate(data, { date: Optional(Date) })).not.toThrow();
            });

            it('should validate when Optional field is present with correct type', () => {
                const data = { optional: 'hello' };
                expect(() => validate(data, { optional: Optional(String) })).not.toThrow();
            });

            it('should reject wrong type even if Optional', () => {
                const data = { optional: 123 };
                expect(() => validate(data, { optional: Optional(String) })).toThrow(RuntimeTypeError);
            });

            it('should reject null for Optional (not Nullable)', () => {
                const data = { optional: null };
                expect(() => validate(data, { optional: Optional(String) })).toThrow(RuntimeTypeError);
            });
        });

        describe('Optional objects', () => {
            it('should allow missing field for Optional object', () => {
                const data = { required: 'hello' };
                expect(() => validate(data, {
                    required: String,
                    optional: Optional({ id: Number })
                })).not.toThrow();
            });

            it('should allow undefined for Optional object', () => {
                const data = { obj: undefined };
                expect(() => validate(data, { obj: Optional({ id: Number }) })).not.toThrow();
            });

            it('should validate when Optional object is present', () => {
                const data = { obj: { id: 123 } };
                expect(() => validate(data, { obj: Optional({ id: Number }) })).not.toThrow();
            });

            it('should validate Optional object with multiple fields', () => {
                const data = { user: { name: 'John', age: 30 } };
                expect(() => validate(data, {
                    user: Optional({ name: String, age: Number })
                })).not.toThrow();
            });

            it('should reject Optional object with wrong field type', () => {
                const data = { obj: { id: 'not a number' } };
                expect(() => validate(data, { obj: Optional({ id: Number }) })).toThrow(RuntimeTypeError);
            });

            it('should reject Optional object missing required nested field', () => {
                const data = { obj: { other: 'value' } };
                expect(() => validate(data, { obj: Optional({ id: Number }) })).toThrow(RuntimeTypeError);
            });
        });

        describe('Optional arrays', () => {
            it('should allow missing field for Optional array', () => {
                const data = {};
                expect(() => validate(data, { items: Optional([String]) })).not.toThrow();
            });

            it('should allow undefined for Optional array', () => {
                const data = { items: undefined };
                expect(() => validate(data, { items: Optional([String]) })).not.toThrow();
            });

            it('should validate when Optional array is present', () => {
                const data = { items: ['a', 'b'] };
                expect(() => validate(data, { items: Optional([String]) })).not.toThrow();
            });

            it('should validate empty Optional array', () => {
                const data = { items: [] };
                expect(() => validate(data, { items: Optional([String]) })).not.toThrow();
            });

            it('should validate Optional array of objects', () => {
                const data = { items: [{ id: 1 }, { id: 2 }] };
                expect(() => validate(data, { items: Optional([{ id: Number }]) })).not.toThrow();
            });

            it('should reject Optional array with wrong element type', () => {
                const data = { items: ['a', 123] };
                expect(() => validate(data, { items: Optional([String]) })).toThrow(RuntimeTypeError);
            });
        });
    });

    describe('Nullable modifier', () => {
        describe('Nullable primitives', () => {
            it('should allow null for Nullable String', () => {
                const data = { nullable: null };
                expect(() => validate(data, { nullable: Nullable(String) })).not.toThrow();
            });

            it('should allow null for Nullable Number', () => {
                const data = { nullable: null };
                expect(() => validate(data, { nullable: Nullable(Number) })).not.toThrow();
            });

            it('should allow null for Nullable Boolean', () => {
                const data = { nullable: null };
                expect(() => validate(data, { nullable: Nullable(Boolean) })).not.toThrow();
            });

            it('should allow null for Nullable Date', () => {
                const data = { nullable: null };
                expect(() => validate(data, { nullable: Nullable(Date) })).not.toThrow();
            });

            it('should validate when Nullable field has a value', () => {
                const data = { nullable: 'hello' };
                expect(() => validate(data, { nullable: Nullable(String) })).not.toThrow();
            });

            it('should reject wrong type even if Nullable', () => {
                const data = { nullable: 123 };
                expect(() => validate(data, { nullable: Nullable(String) })).toThrow(RuntimeTypeError);
            });

            it('should reject undefined for Nullable (not Optional)', () => {
                const data = { nullable: undefined };
                expect(() => validate(data, { nullable: Nullable(String) })).toThrow(RuntimeTypeError);
            });

            it('should reject missing field for Nullable (not Optional)', () => {
                const data = {};
                expect(() => validate(data, { nullable: Nullable(String) })).toThrow(RuntimeTypeError);
            });
        });

        describe('Nullable objects', () => {
            it('should allow null for Nullable object', () => {
                const data = { nullable: null };
                expect(() => validate(data, { nullable: Nullable({ id: Number }) })).not.toThrow();
            });

            it('should validate when Nullable object has a value', () => {
                const data = { nullable: { id: 123 } };
                expect(() => validate(data, { nullable: Nullable({ id: Number }) })).not.toThrow();
            });

            it('should reject Nullable object with wrong field type', () => {
                const data = { nullable: { id: 'not a number' } };
                expect(() => validate(data, { nullable: Nullable({ id: Number }) })).toThrow(RuntimeTypeError);
            });
        });

        describe('Nullable arrays', () => {
            it('should allow null for Nullable array', () => {
                const data = { items: null };
                expect(() => validate(data, { items: Nullable([String]) })).not.toThrow();
            });

            it('should validate when Nullable array has a value', () => {
                const data = { items: ['a', 'b'] };
                expect(() => validate(data, { items: Nullable([String]) })).not.toThrow();
            });

            it('should reject Nullable array with wrong element type', () => {
                const data = { items: ['a', 123] };
                expect(() => validate(data, { items: Nullable([String]) })).toThrow(RuntimeTypeError);
            });
        });
    });

    describe('Optional and Nullable combined', () => {
        describe('Optional(Nullable())', () => {
            it('should allow undefined for Optional(Nullable())', () => {
                const data = {};
                expect(() => validate(data, { field: Optional(Nullable(String)) })).not.toThrow();
            });

            it('should allow null for Optional(Nullable())', () => {
                const data = { field: null };
                expect(() => validate(data, { field: Optional(Nullable(String)) })).not.toThrow();
            });
        });


        describe('combined with objects', () => {
            it('should allow undefined for Optional(Nullable(Object))', () => {
                const data = {};
                const innerSchema = Nullable({ id: Number } as any);
                const schema = { obj: Optional(innerSchema) };
                expect(() => validate(data, schema)).not.toThrow();
            });

            it('should allow null for Optional(Nullable(Object))', () => {
                const data = { obj: null };
                const innerSchema = Nullable({ id: Number } as any);
                const schema = { obj: Optional(innerSchema) };
                expect(() => validate(data, schema)).not.toThrow();
            });
        });

        describe('combined with arrays', () => {
            it('should allow undefined for Optional(Nullable(Array))', () => {
                const data = {};
                expect(() => validate(data, { items: Optional(Nullable([String])) })).not.toThrow();
            });

            it('should allow null for Optional(Nullable(Array))', () => {
                const data = { items: null };
                expect(() => validate(data, { items: Optional(Nullable([String])) })).not.toThrow();
            });
        });
    });

    describe('Optional field inside array object', () => {
        it('should allow missing Optional field in array element', () => {
            const data = {
                items: [
                    { id: 1, name: 'item1' },
                    { id: 2 }  // name is missing
                ]
            };
            expect(() => validate(data, {
                items: [{
                    id: Number,
                    name: Optional(String)
                }]
            })).not.toThrow();
        });

        it('should allow undefined Optional field in array element', () => {
            const data = {
                items: [
                    { id: 1, name: 'item1' },
                    { id: 2, name: undefined }
                ]
            };
            expect(() => validate(data, {
                items: [{
                    id: Number,
                    name: Optional(String)
                }]
            })).not.toThrow();
        });

        it('should allow Nullable field as null in array element', () => {
            const data = {
                items: [
                    { id: 1, name: 'item1' },
                    { id: 2, name: null }
                ]
            };
            expect(() => validate(data, {
                items: [{
                    id: Number,
                    name: Nullable(String)
                }]
            })).not.toThrow();
        });

        it('should validate nested Optional object inside array', () => {
            const data = {
                items: [
                    { id: 1, meta: { score: 100 } },
                    { id: 2 }  // meta is missing
                ]
            };
            expect(() => validate(data, {
                items: [{
                    id: Number,
                    meta: Optional({ score: Number })
                }]
            })).not.toThrow();
        });

        it('should validate deeply nested Optional field inside array object', () => {
            const data = {
                items: [
                    { id: 1, meta: { score: 100, tag: 'test' } },
                    { id: 2, meta: { score: 200 } }  // tag is missing inside meta
                ]
            };
            expect(() => validate(data, {
                items: [{
                    id: Number,
                    meta: {
                        score: Number,
                        tag: Optional(String)
                    }
                }]
            })).not.toThrow();
        });

        it('should validate Optional field with actual string value in array element', () => {
            const data = {
                items: [
                    { myfield: 'hello' },
                    { myfield: 'world' }
                ]
            };
            expect(() => validate(data, {
                items: [{
                    myfield: Optional(String)
                }]
            })).not.toThrow();
        });

        it('should validate Optional field with empty string value in array element', () => {
            const data = {
                items: [
                    { myfield: '' },
                    { myfield: '' }
                ]
            };
            expect(() => validate(data, {
                items: [{
                    myfield: Optional(String)
                }]
            })).not.toThrow();
        });
    });

    describe('RuntimeTypeError path validation', () => {
        it('should include correct path for top-level field error', () => {
            try {
                validate({ name: 123 }, { name: String });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('name');
            }
        });

        it('should include correct path for nested field error', () => {
            try {
                validate({ user: { profile: { name: 123 } } }, {
                    user: { profile: { name: String } }
                });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('user.profile.name');
            }
        });

        it('should include correct path for array element error', () => {
            try {
                validate({ items: ['a', 123, 'c'] }, { items: [String] });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('items[1]');
            }
        });

        it('should include correct path for object in array error', () => {
            try {
                validate({ items: [{ id: 1 }, { id: 'two' }] }, { items: [{ id: Number }] });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('items[1].id');
            }
        });

        it('should include correct path for deeply nested array object error', () => {
            try {
                validate({
                    users: [{
                        profile: {
                            settings: { theme: 123 }
                        }
                    }]
                }, {
                    users: [{
                        profile: {
                            settings: { theme: String }
                        }
                    }]
                });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('users[0].profile.settings.theme');
            }
        });

        it('should include expected and actual type in error message', () => {
            try {
                validate({ count: 'not a number' }, { count: Number });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                const message = (e as Error).message;
                expect(message).toContain('Number');
                expect(message).toContain('String');
            }
        });

        it('should include actual value in error message', () => {
            try {
                validate({ name: 12345 }, { name: String });
                fail('Expected to throw');
            } catch (e) {
                expect(e).toBeInstanceOf(RuntimeTypeError);
                expect((e as Error).message).toContain('12345');
            }
        });
    });

    describe('complex real-world scenarios', () => {
        it('should validate API response schema', () => {
            const apiResponse = {
                success: true,
                data: {
                    users: [
                        { id: 1, name: 'Alice', email: 'alice@example.com', createdAt: new Date() },
                        { id: 2, name: 'Bob', email: 'bob@example.com', createdAt: new Date() }
                    ],
                    pagination: {
                        page: 1,
                        perPage: 10,
                        total: 2
                    }
                }
            };
            expect(() => validate(apiResponse, {
                success: Boolean,
                data: {
                    users: [{
                        id: Number,
                        name: String,
                        email: String,
                        createdAt: Date
                    }],
                    pagination: {
                        page: Number,
                        perPage: Number,
                        total: Number
                    }
                }
            })).not.toThrow();
        });

        it('should validate form data with optional fields', () => {
            const formData = {
                username: 'johndoe',
                email: 'john@example.com',
                age: 25,
                bio: undefined,
                website: null
            };
            expect(() => validate(formData, {
                username: String,
                email: String,
                age: Number,
                bio: Optional(String),
                website: Nullable(String)
            })).not.toThrow();
        });

        it('should validate nested config object', () => {
            const config = {
                app: {
                    name: 'MyApp',
                    version: '1.0.0',
                    debug: false
                },
                database: {
                    host: 'localhost',
                    port: 5432,
                    ssl: true
                },
                features: ['auth', 'analytics', 'notifications']
            };
            expect(() => validate(config, {
                app: {
                    name: String,
                    version: String,
                    debug: Boolean
                },
                database: {
                    host: String,
                    port: Number,
                    ssl: Boolean
                },
                features: [String]
            })).not.toThrow();
        });

        it('should validate e-commerce order schema', () => {
            const order = {
                orderId: 'ORD-12345',
                customer: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com'
                },
                items: [
                    { productId: 101, name: 'Widget', quantity: 2, price: 29.99 },
                    { productId: 102, name: 'Gadget', quantity: 1, price: 49.99 }
                ],
                shipping: {
                    address: {
                        street: '123 Main St',
                        city: 'Springfield',
                        zipCode: '12345'
                    },
                    method: 'express'
                },
                total: 109.97,
                createdAt: new Date()
            };
            expect(() => validate(order, {
                orderId: String,
                customer: {
                    id: Number,
                    name: String,
                    email: String
                },
                items: [{
                    productId: Number,
                    name: String,
                    quantity: Number,
                    price: Number
                }],
                shipping: {
                    address: {
                        street: String,
                        city: String,
                        zipCode: String
                    },
                    method: String
                },
                total: Number,
                createdAt: Date
            })).not.toThrow();
        });

        it('should validate user profile with all modifier combinations', () => {
            const profile = {
                id: 1,
                username: 'johndoe',
                displayName: null,
                avatar: undefined,
                settings: {
                    theme: 'dark',
                    notifications: true,
                    language: undefined
                },
                tags: ['developer', 'designer'],
                socialLinks: null
            };
            expect(() => validate(profile, {
                id: Number,
                username: String,
                displayName: Nullable(String),
                avatar: Optional(String),
                settings: {
                    theme: String,
                    notifications: Boolean,
                    language: Optional(String)
                },
                tags: [String],
                socialLinks: Nullable([String])
            })).not.toThrow();
        });
    });

    describe('edge cases', () => {
        it('should validate empty schema against any object', () => {
            expect(() => validate({ any: 'data', nested: { value: 123 } }, {})).not.toThrow();
        });

        it('should validate object with numeric string keys', () => {
            const data = { '0': 'first', '1': 'second' };
            expect(() => validate(data, { '0': String, '1': String })).not.toThrow();
        });

        it('should validate object with special characters in keys', () => {
            const data = { 'my-field': 'value', 'another_field': 123 };
            expect(() => validate(data, { 'my-field': String, 'another_field': Number })).not.toThrow();
        });

        it('should validate very long string', () => {
            const longString = 'a'.repeat(10000);
            expect(() => validate({ content: longString }, { content: String })).not.toThrow();
        });

        it('should validate very large number', () => {
            expect(() => validate({ num: Number.MAX_SAFE_INTEGER }, { num: Number })).not.toThrow();
        });

        it('should validate very small number', () => {
            expect(() => validate({ num: Number.MIN_SAFE_INTEGER }, { num: Number })).not.toThrow();
        });

        it('should validate number with decimal precision', () => {
            expect(() => validate({ price: 0.1 + 0.2 }, { price: Number })).not.toThrow();
        });

        it('should validate object with many fields', () => {
            const data: Record<string, number> = {};
            const schema: Record<string, NumberConstructor> = {};
            for (let i = 0; i < 100; i++) {
                data[`field${i}`] = i;
                schema[`field${i}`] = Number;
            }
            expect(() => validate(data, schema)).not.toThrow();
        });

        it('should validate large array', () => {
            const data = { items: Array.from({ length: 1000 }, (_, i) => i) };
            expect(() => validate(data, { items: [Number] })).not.toThrow();
        });

        it('should handle Date at epoch', () => {
            expect(() => validate({ date: new Date(0) }, { date: Date })).not.toThrow();
        });

        it('should handle Date far in the future', () => {
            expect(() => validate({ date: new Date('2099-12-31') }, { date: Date })).not.toThrow();
        });

        it('should reject Symbol as value', () => {
            const data = { field: Symbol('test') };
            expect(() => validate(data, { field: String })).toThrow();
        });

        it('should reject BigInt as Number', () => {
            const data = { num: BigInt(123) };
            expect(() => validate(data, { num: Number })).toThrow(RuntimeTypeError);
        });
    });

    describe('multiple fields validation', () => {
        it('should validate all fields and fail on first error', () => {
            const data = { a: 'valid', b: 123, c: 'also valid' };
            expect(() => validate(data, { a: String, b: String, c: String })).toThrow(RuntimeTypeError);
        });

        it('should validate multiple required fields', () => {
            const data = { a: 'str', b: 123, c: true, d: new Date() };
            expect(() => validate(data, {
                a: String,
                b: Number,
                c: Boolean,
                d: Date
            })).not.toThrow();
        });

        it('should validate mix of required and optional fields', () => {
            const data = { required1: 'value', required2: 42 };
            expect(() => validate(data, {
                required1: String,
                required2: Number,
                optional1: Optional(String),
                optional2: Optional(Number)
            })).not.toThrow();
        });

        it('should validate mix of required, optional and nullable fields', () => {
            const data = {
                required: 'value',
                optionalMissing: undefined,
                nullableWithNull: null,
                nullableWithValue: 'present'
            };
            expect(() => validate(data, {
                required: String,
                optionalMissing: Optional(String),
                nullableWithNull: Nullable(String),
                nullableWithValue: Nullable(String)
            })).not.toThrow();
        });
    });

    describe('type coercion prevention', () => {
        it('should not coerce string "123" to number', () => {
            expect(() => validate({ num: '123' }, { num: Number })).toThrow(RuntimeTypeError);
        });

        it('should not coerce number 1 to boolean true', () => {
            expect(() => validate({ flag: 1 }, { flag: Boolean })).toThrow(RuntimeTypeError);
        });

        it('should not coerce number 0 to boolean false', () => {
            expect(() => validate({ flag: 0 }, { flag: Boolean })).toThrow(RuntimeTypeError);
        });

        it('should not coerce empty string to boolean false', () => {
            expect(() => validate({ flag: '' }, { flag: Boolean })).toThrow(RuntimeTypeError);
        });

        it('should not coerce string "true" to boolean', () => {
            expect(() => validate({ flag: 'true' }, { flag: Boolean })).toThrow(RuntimeTypeError);
        });

        it('should not coerce string "false" to boolean', () => {
            expect(() => validate({ flag: 'false' }, { flag: Boolean })).toThrow(RuntimeTypeError);
        });

        it('should not coerce date string to Date', () => {
            expect(() => validate({ date: '2024-01-01' }, { date: Date })).toThrow(RuntimeTypeError);
        });

        it('should not coerce timestamp to Date', () => {
            expect(() => validate({ date: Date.now() }, { date: Date })).toThrow(RuntimeTypeError);
        });
    });
});
