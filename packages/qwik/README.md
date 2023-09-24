# QSONForms

## Usage

### Install
```bash
  npm install qsonforms
```

### Usage

#### Define Data
```typescript
  const schema = {
    type: "object",
    properties: {
      first_name: {
        type: "string"
      },
      last_name: {
        type: "string"
      }
    }
  }

  const formData = useSignal({ first_name: "Aliyss", last_name: "Snow" })

  const uiSchema = createUiSchema(...);
```

#### Create Form
```typescript
  const [userForm, { QSONForm }] = useQSONForm(schema, {
    loader: formData,
    uiSchema: uiSchema
  });

  return <QSONForm />
```

## Caveats

### Typesafety
Typesafety is not really given. Theoretically it could quickly implemented with json-schema-to-ts, however when currently using it I get "type instantiation to deep" or something like that. I assume after cleaning out unnecessary stuff this could work.

Of course the whole validation is to be based on json-schema with Ajv, so that would generally result to the same output anyways if one is not statically creating forms, in which case it may make more sense to use Modular Forms anyways.

### Validation
Validation works by passing a validation function to ``useQSONForm``. It must return an ajv ErrorObject or an empty array.
