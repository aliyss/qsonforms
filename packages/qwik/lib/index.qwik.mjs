import { noSerialize, componentQrl, inlinedQrl, _jsxC, _jsxQ, _fnSignal, Slot, _IMMUTABLE, _jsxS, _restProps, useTaskQrl, useLexicalScope, useVisibleTaskQrl, _jsxBranch, _wrapProp, useStylesQrl, useStore, implicit$FirstArg } from "@builder.io/qwik";
import { Fragment } from "@builder.io/qwik/jsx-runtime";
import get from "lodash-es/get";
import range from "lodash-es/range";
import { isServer } from "@builder.io/qwik/build";
function getOptions(arg1, arg2) {
  return (typeof arg1 !== "string" && !Array.isArray(arg1) ? arg1 : arg2) || {};
}
function isFieldDirty(startValue, currentValue) {
  const toValue = (item) => item instanceof Blob ? item.size : item;
  return Array.isArray(startValue) && Array.isArray(currentValue) ? startValue.map(toValue).join() !== currentValue.map(toValue).join() : startValue instanceof Date && currentValue instanceof Date ? startValue.getTime() !== currentValue.getTime() : Number.isNaN(startValue) && Number.isNaN(currentValue) ? false : startValue !== currentValue;
}
function getFieldAndArrayStores(form) {
  return [
    ...Object.values(form.internal.fields)
  ];
}
function updateFormDirty(form, dirty) {
  form.dirty = dirty || getFieldAndArrayStores(form).some((fieldOrFieldArray) => fieldOrFieldArray.active && fieldOrFieldArray.dirty);
}
function updateFieldDirty(form, field) {
  const dirty = isFieldDirty(
    // Actually Key of
    field.internal.startValue,
    field.value
  );
  if (dirty !== field.dirty) {
    field.dirty = dirty;
    updateFormDirty(form, dirty);
  }
}
function validateIfRequired(form, fieldOrFieldArray, name, { on: modes, shouldFocus = false }) {
  if (modes.includes((form.internal.validateOn === "submit" ? form.submitted : fieldOrFieldArray.error) ? form.internal.revalidateOn : form.internal.validateOn))
    validate(form, name, {
      shouldFocus
    });
}
function getFieldStore(form, name) {
  return form.internal.fields[name];
}
function getInitialFieldStore(name, { value, initialValue, error, isUniqueEnum } = {
  value: void 0,
  initialValue: void 0,
  error: [],
  isUniqueEnum: void 0
}) {
  const dirty = isFieldDirty(initialValue, value);
  return {
    internal: {
      initialValue,
      startValue: initialValue,
      validate: [],
      transform: [],
      elements: [],
      consumers: []
    },
    name,
    isUniqueEnum,
    value,
    error,
    active: false,
    touched: dirty,
    dirty
  };
}
function initializeFieldStore(form, name) {
  if (!getFieldStore(form, name))
    form.internal.fields[name] = getInitialFieldStore(name);
  return getFieldStore(form, name);
}
function getFieldNames(form, shouldValid = true) {
  const fieldNames = Object.keys(form.internal.fields);
  return fieldNames;
}
function getFilteredNames(form, arg2, shouldValid) {
  const allFieldNames = getFieldNames(form, shouldValid);
  if (typeof arg2 === "string" || Array.isArray(arg2))
    return (typeof arg2 === "string" ? [
      arg2
    ] : arg2).reduce((tuple, name) => {
      const [fieldNames] = tuple;
      fieldNames.add(name);
      return tuple;
    }, [
      /* @__PURE__ */ new Set()
    ]).map((set) => [
      ...set
    ]);
  return [
    allFieldNames
  ];
}
function getPathValue(path, object) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}
let counter = 0;
function getUniqueId() {
  return counter++;
}
function getInitialStores({ loader, action }) {
  function getActionValue(name) {
    return action?.value?.values && getPathValue(name, action.value.values);
  }
  const createInitialStores = (stores, data, prevPath) => Object.entries(data).reduce((stores2, [path, value]) => {
    const compoundPath = prevPath ? `${prevPath}.${path}` : path;
    if (!value || typeof value !== "object" || Array.isArray(value) || value instanceof Date)
      stores2[0][compoundPath] = getInitialFieldStore(
        compoundPath,
        // @ts-ignore
        {
          initialValue: value,
          value: getActionValue(compoundPath) ?? value
        }
      );
    if (value && typeof value === "object")
      createInitialStores(stores2, value, compoundPath);
    return stores2;
  }, stores);
  return createInitialStores([
    {}
  ], loader.value);
}
function setErrorResponse(form, formErrors, { duration }) {
  setResponse(form, {
    status: "error",
    message: formErrors
  }, {
    duration
  });
}
function updateFormInvalid(form, invalid) {
  form.invalid = invalid || getFieldAndArrayStores(form).some((fieldOrFieldArray) => fieldOrFieldArray.active && fieldOrFieldArray.error);
}
function updateFormState(form) {
  let touched = false, dirty = false, invalid = false;
  for (const fieldOrFieldArray of getFieldAndArrayStores(form)) {
    if (fieldOrFieldArray.active) {
      if (fieldOrFieldArray.touched)
        touched = true;
      if (fieldOrFieldArray.dirty)
        dirty = true;
      if (fieldOrFieldArray.error)
        invalid = true;
    }
    if (touched && dirty && invalid)
      break;
  }
  form.touched = touched;
  form.dirty = dirty;
  form.invalid = invalid;
}
async function handleFieldEvent(form, field, name, event, element, validationModes, inputValue) {
  if (inputValue !== void 0 && inputValue !== null)
    field.value = inputValue;
  if (form.emptyIsUndefined && field.value === "")
    field.value = void 0;
  for (const transformation of field.internal.transform)
    field.value = await transformation(field.value, event, element);
  field.touched = true;
  form.touched = true;
  updateFieldDirty(form, field);
  validateIfRequired(form, field, name, {
    on: validationModes
  });
}
function getElementInput(element, field, type) {
  const { checked, files, options, value, valueAsDate, valueAsNumber } = element;
  return !type || type === "string" ? value : type === "string[]" ? options ? [
    ...options
  ].filter((e) => e.selected && !e.disabled).map((e) => e.value) : checked ? [
    ...field.value || [],
    value
  ] : (field.value || []).filter((v) => v !== value) : type === "number" ? Number.isNaN(valueAsNumber) ? void 0 : valueAsNumber : type === "integer" ? valueAsNumber : type === "boolean" ? checked : type === "File" && files ? noSerialize(files[0]) : type === "File[]" && files ? [
    ...files
  ].map((file) => noSerialize(file)) : type === "Date" && valueAsDate ? valueAsDate : field.value;
}
function getValues(form, arg2, arg3) {
  const { shouldActive = true, shouldTouched = false, shouldDirty = false, shouldValid = false } = getOptions(arg2, arg3);
  return getFilteredNames(form, arg2)[0].reduce((values, name) => {
    const field = getFieldStore(form, name);
    if ((!shouldActive || field.active) && (!shouldTouched || field.touched) && (!shouldDirty || field.dirty) && (!shouldValid || !field.error) && (!field.isUniqueEnum || field.isUniqueEnum && field.value))
      (typeof arg2 === "string" ? name.replace(`${arg2}.`, "") : name).split(".").reduce((object, key, index, keys) => {
        if (field.isUniqueEnum && Array.isArray(object))
          key = object.length;
        return object[key] = index === keys.length - 1 ? field.value === "" && form.emptyIsUndefined ? void 0 : field.value : typeof object[key] === "object" && object[key] || (isNaN(+keys[index + 1]) ? {} : []);
      }, values);
    return values;
  }, typeof arg2 === "string" ? [] : {});
}
function getValue$2(form, name, { shouldActive = true, shouldTouched = false, shouldDirty = false, shouldValid = false } = {}) {
  const field = getFieldStore(form, name);
  if (field && (!shouldActive || field.active) && (!shouldTouched || field.touched) && (!shouldDirty || field.dirty) && (!shouldValid || !field.error))
    return field.value;
  return void 0;
}
function setValue(form, name, value, { shouldTouched = true, shouldDirty = true, shouldValidate = true, shouldFocus = true } = {}) {
  const field = initializeFieldStore(form, name);
  field.value = value;
  if (shouldTouched) {
    field.touched = true;
    form.touched = true;
  }
  if (shouldDirty)
    updateFieldDirty(form, field);
  if (shouldValidate)
    validateIfRequired(form, field, name, {
      on: [
        "touched",
        "input"
      ],
      shouldFocus
    });
}
function focus(form, name) {
  getFieldStore(form, name)?.internal.elements[0]?.focus();
}
function setResponse(form, response, { duration } = {}) {
  form.response = response;
  if (duration)
    setTimeout(() => {
      if (form.response === response)
        form.response = {};
    }, duration);
}
async function validate(form, arg2, arg3) {
  const [fieldNames] = getFilteredNames(form, arg2);
  const { shouldActive = true, shouldFocus = true } = getOptions(arg2, arg3);
  const validator = getUniqueId();
  form.internal.validators.push(validator);
  form.validating = true;
  const formErrors = form.internal.validate ? await form.internal.validate(getValues(form, {
    shouldActive
  })) : [];
  let valid = typeof arg2 !== "string" && !Array.isArray(arg2) ? !formErrors?.length : true;
  if (!formErrors)
    return true;
  const fieldPaths = formErrors.reduce((result, item) => {
    let fieldSchemaPath = item.instancePath;
    if (item.keyword === "required")
      fieldSchemaPath = `${item.instancePath}/${item.params.missingProperty}`;
    const fieldPath = fieldSchemaPath.replace(/\//g, ".").slice(1);
    if (!result[fieldPath])
      result[fieldPath] = [];
    result[fieldPath].push(item);
    if (shouldActive) {
      const field = getFieldStore(form, fieldPath);
      if (field.active)
        field.error = result[fieldPath];
    }
    return result;
  }, {});
  const [errorFields] = await Promise.all([
    // Validate each field in list
    Promise.all(fieldNames.map(async (name) => {
      const field = getFieldStore(form, name);
      if (!shouldActive || field.active) {
        let fieldError = false;
        if (fieldPaths[name]) {
          field.error = fieldPaths[name];
          fieldError = true;
        } else
          field.error = [];
        if (fieldError)
          valid = false;
        return fieldError ? name : null;
      }
    }))
  ]);
  setErrorResponse(form, formErrors, {
    shouldActive
  });
  if (shouldFocus) {
    const name = errorFields.find((name2) => name2);
    if (name)
      focus(form, name);
  }
  updateFormInvalid(form, !valid);
  form.internal.validators.splice(form.internal.validators.indexOf(validator), 1);
  if (!form.internal.validators.length)
    form.validating = false;
  return valid;
}
function reset(form, arg2, arg3) {
  const [fieldNames] = getFilteredNames(form, arg2, false);
  const resetSingleField = typeof arg2 === "string" && fieldNames.length === 1;
  const resetEntireForm = !resetSingleField && !Array.isArray(arg2);
  const options = getOptions(arg2, arg3);
  const { initialValue, initialValues, keepResponse = false, keepSubmitCount = false, keepSubmitted = false, keepValues = false, keepDirtyValues = false, keepErrors = false, keepTouched = false, keepDirty = false } = options;
  fieldNames.forEach((name) => {
    const field = getFieldStore(form, name);
    if (resetSingleField ? "initialValue" in options : initialValues)
      field.internal.initialValue = resetSingleField ? initialValue : getPathValue(name, initialValues);
    const keepDirtyValue = keepDirtyValues && field.dirty;
    if (!keepValues && !keepDirtyValue) {
      field.internal.startValue = field.internal.initialValue;
      field.value = field.internal.initialValue;
      field.internal.elements.forEach((element) => {
        if (element.type === "file")
          element.value = "";
      });
    }
    if (!keepTouched)
      field.touched = false;
    if (!keepDirty && !keepValues && !keepDirtyValue)
      field.dirty = false;
    if (!keepErrors)
      field.error = [];
  });
  if (resetEntireForm) {
    if (!keepResponse)
      form.response = {};
    if (!keepSubmitCount)
      form.submitCount = 0;
    if (!keepSubmitted)
      form.submitted = false;
  }
  updateFormState(form);
}
let TemplateType;
(function(TemplateType2) {
  TemplateType2["VERTICAL_LAYOUT"] = "VerticalLayout";
  TemplateType2["HORIZONTAL_LAYOUT"] = "HorizontalLayout";
  TemplateType2["ARRAY"] = "Array";
  TemplateType2["CONTROL"] = "Control";
})(TemplateType || (TemplateType = {}));
let AdditionalTemplateType;
(function(AdditionalTemplateType2) {
  AdditionalTemplateType2["BUTTON"] = "Button";
  AdditionalTemplateType2["ERROR"] = "Error";
  AdditionalTemplateType2["FIELD"] = "Field";
  AdditionalTemplateType2["ARRAY_ITEM"] = "ArrayItem";
})(AdditionalTemplateType || (AdditionalTemplateType = {}));
let WidgetType;
(function(WidgetType2) {
  WidgetType2["CONTROL"] = "Control";
})(WidgetType || (WidgetType = {}));
const DefaultVertical = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => `form-vertical ${p0.layout["ui:class"] || "form-vertical-default"}`, [
        props
      ], '`form-vertical ${p0.layout["ui:class"]||"form-vertical-default"}`')
    }, /* @__PURE__ */ _jsxC(Slot, null, 3, "cd_0"), 1, null)
  }, 1, "cd_1");
}, "DefaultVertical_component_UY9oBhsK8n8"));
const DefaultHorizontal = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => `form-horizontal ${p0.layout["ui:class"] || "form-horizontal-default"}`, [
        props
      ], '`form-horizontal ${p0.layout["ui:class"]||"form-horizontal-default"}`')
    }, /* @__PURE__ */ _jsxC(Slot, null, 3, "ze_0"), 1, null)
  }, 1, "ze_1");
}, "DefaultHorizontal_component_UG9M04fl0Zs"));
const DefaultControl = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => `form-control ${p0.layout["ui:class"] || "form-control-default"}`, [
        props
      ], '`form-control ${p0.layout["ui:class"]||"form-control-default"}`')
    }, [
      /* @__PURE__ */ _jsxC(Slot, {
        name: "title",
        [_IMMUTABLE]: {
          name: _IMMUTABLE
        }
      }, 3, "Tj_0"),
      /* @__PURE__ */ _jsxC(Slot, null, 3, "Tj_1"),
      /* @__PURE__ */ _jsxC(Slot, {
        name: "errors",
        [_IMMUTABLE]: {
          name: _IMMUTABLE
        }
      }, 3, "Tj_2")
    ], 1, null)
  }, 1, "Tj_3");
}, "DefaultControl_component_6ykl2XdCces"));
const DefaultControlWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`')
    }, "Error no Widget found.", 3, null)
  }, 3, "O9_0");
}, "DefaultControlWidget_component_6y2CbsAOhVI"));
const DefaultStringWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("input", {
      ...props.additionalProps
    }, {
      class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      value: _fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_1");
}, "DefaultStringWidget_component_Pk5JOD6cApc"));
const DefaultSelectWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("select", {
      ...props.additionalProps,
      children: [
        /* @__PURE__ */ _jsxQ("option", null, {
          disabled: true,
          selected: _fnSignal((p0) => !p0.field.value || !p0.additionalProps.selectOptions?.includes(p0.field.value), [
            props
          ], "!p0.field.value||!p0.additionalProps.selectOptions?.includes(p0.field.value)"),
          value: void 0
        }, !props.additionalProps.selectOptions?.includes(props.field.value) ? props.field.value : "-- select an option --", 1, null),
        props.additionalProps.selectOptions?.map((v, i) => {
          return /* @__PURE__ */ _jsxQ("option", {
            selected: v === props.field.value,
            value: v
          }, null, v, 1, i);
        })
      ]
    }, {
      class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      value: _fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_2");
}, "DefaultSelectWidget_component_R00hlyZIuKE"));
const DefaultUniqueItemEnumWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  const checkboxValue = !!props.field.value;
  const props1 = _restProps(props.additionalProps, [
    "onInput$"
  ]);
  const onInput = /* @__PURE__ */ inlinedQrl((event, element) => {
    const [checkboxValue2, props2] = useLexicalScope();
    if (!checkboxValue2)
      props2.field.value = props2.field.internal.startValue;
    else
      props2.field.value = void 0;
    props2.additionalProps.onInput$(event, element);
  }, "DefaultUniqueItemEnumWidget_component_onInput_8cnEa1aFeOE", [
    checkboxValue,
    props
  ]);
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => p0.layout["ui:class"] || "default-uniqueitem-enum-widget", [
        props
      ], 'p0.layout["ui:class"]||"default-uniqueitem-enum-widget"')
    }, [
      /* @__PURE__ */ _jsxS("input", {
        checked: checkboxValue,
        ...props1,
        onInput$: onInput
      }, {
        class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
          props
        ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
        type: "checkbox",
        value: _fnSignal((p0) => p0.field.value, [
          props
        ], "p0.field.value")
      }, 0, null),
      _fnSignal((p0) => p0.field.internal.startValue, [
        props
      ], "p0.field.internal.startValue")
    ], 1, null)
  }, 1, "O9_4");
}, "DefaultUniqueItemEnumWidget_component_CkNLTERFdTI"));
const DefaultBooleanWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  useTaskQrl(/* @__PURE__ */ inlinedQrl(() => {
    const [props2] = useLexicalScope();
    if (!props2.field.value)
      props2.field.value = false;
  }, "DefaultBooleanWidget_component_useTask_3DYSsYzXF3k", [
    props
  ]));
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("input", {
      ...props.additionalProps
    }, {
      checked: _fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value"),
      class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      type: "checkbox",
      value: _fnSignal((p0) => p0.field.value ? "on" : "off", [
        props
      ], 'p0.field.value?"on":"off"')
    }, 0, null)
  }, 1, "O9_5");
}, "DefaultBooleanWidget_component_gxYt1twyeJo"));
const DefaultNumberWidget = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  const props1 = _restProps(props.additionalProps, [
    "onInput$"
  ]);
  const onInput = /* @__PURE__ */ inlinedQrl((event, element) => {
    const [props2] = useLexicalScope();
    const { valueAsNumber } = element;
    if (isNaN(valueAsNumber)) {
      props2.field.value = void 0;
      element.value = "";
    }
    props2.additionalProps.onInput$(event, element);
  }, "DefaultNumberWidget_component_onInput_Q5lt73ZszUo", [
    props
  ]);
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("input", {
      ...props1,
      onInput$: onInput
    }, {
      class: _fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      type: "number",
      value: _fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_6");
}, "DefaultNumberWidget_component_iwjisttKp2E"));
const DefaultArray = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      class: _fnSignal((p0) => `form-array ${p0.layout["ui:class"] || "form-array-default"}`, [
        props
      ], '`form-array ${p0.layout["ui:class"]||"form-array-default"}`')
    }, [
      /* @__PURE__ */ _jsxC(Slot, {
        name: "title",
        [_IMMUTABLE]: {
          name: _IMMUTABLE
        }
      }, 3, "CN_0"),
      /* @__PURE__ */ _jsxC(Slot, null, 3, "CN_1"),
      /* @__PURE__ */ _jsxC(Slot, {
        name: "add-button",
        [_IMMUTABLE]: {
          name: _IMMUTABLE
        }
      }, 3, "CN_2")
    ], 1, null)
  }, 1, "CN_3");
}, "DefaultArray_component_R4SqZX2sFjE"));
const DefaultButton = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("button", {
      ...props.props,
      children: /* @__PURE__ */ _jsxC(Slot, null, 3, "g2_0")
    }, null, 0, null)
  }, 1, "g2_1");
}, "DefaultButton_component_0Mp2z3Gj9kY"));
const DefaultSubmitButton = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxS("button", {
      ...props.props,
      children: /* @__PURE__ */ _jsxC(Slot, null, 3, "g2_2")
    }, null, 0, null)
  }, 1, "g2_3");
}, "DefaultSubmitButton_component_WEj093eVgUs"));
const DefaultError = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxQ("div", null, {
      style: "color: red;"
    }, props.errors && props.errors.length > 0 ? props.errors[0].message : /* @__PURE__ */ _jsxC(Fragment, null, 3, "jB_0"), 1, null)
  }, 1, "jB_1");
}, "DefaultError_component_r0fcZemJgRY"));
const DefaultTitle = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  const title = props.layout["ui:title"] || props.subSchema.title;
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: title ? /* @__PURE__ */ _jsxQ("span", null, null, `${title}${props.required ? "*" : ""}`, 1, "jB_2") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "jB_3")
  }, 1, "jB_4");
}, "DefaultTitle_component_fVzTY795bE0"));
const DefaultArrayTitle = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  const title = props.layout["ui:title"] || props.subSchema.title;
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: title ? /* @__PURE__ */ _jsxQ("span", null, null, `${title}${props.required ? "*" : ""}`, 1, "jB_5") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "jB_6")
  }, 1, "jB_7");
}, "DefaultArrayTitle_component_twDX2tPurgg"));
const DefaultArrayItem = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  const title = props.isUniqueEnum ? "" : (props.layout["ui:title"] || props.subSchema.title) + ` - ${props.itemPath.split(".")[props.itemPath.split(".").length - 1]}`;
  return /* @__PURE__ */ _jsxQ("div", null, {
    class: _fnSignal((p0) => `form-array-item ${p0.isUniqueEnum ? "form-uniqueitem-enum-array-item" : ""}`, [
      props
    ], '`form-array-item ${p0.isUniqueEnum?"form-uniqueitem-enum-array-item":""}`')
  }, [
    /* @__PURE__ */ _jsxC(Fragment, {
      children: title ? /* @__PURE__ */ _jsxQ("span", null, null, `${title}`, 1, "jB_8") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "jB_9")
    }, 1, "jB_10"),
    /* @__PURE__ */ _jsxC(Slot, null, 3, "jB_11"),
    /* @__PURE__ */ _jsxC(Slot, {
      name: "remove-button",
      [_IMMUTABLE]: {
        name: _IMMUTABLE
      }
    }, 3, "jB_12")
  ], 1, "jB_13");
}, "DefaultArrayItem_component_xcRPx64OzmI"));
const defaultTemplates = {
  [TemplateType.VERTICAL_LAYOUT]: {
    defaultVertical: DefaultVertical
  },
  [TemplateType.HORIZONTAL_LAYOUT]: {
    defaultHorizontal: DefaultHorizontal
  },
  [TemplateType.ARRAY]: {
    defaultArray: DefaultArray
  },
  [TemplateType.CONTROL]: {
    defaultControl: DefaultControl
  }
};
const defaultAdditionals = {
  [AdditionalTemplateType.BUTTON]: {
    addButton: DefaultButton,
    removeButton: DefaultButton,
    moveUpButton: DefaultButton,
    moveDownButton: DefaultButton,
    submitButton: DefaultSubmitButton
  },
  [AdditionalTemplateType.ERROR]: {
    defaultError: DefaultError
  },
  [AdditionalTemplateType.FIELD]: {
    defaultTitle: DefaultTitle,
    defaultArrayTitle: DefaultArrayTitle
  },
  [AdditionalTemplateType.ARRAY_ITEM]: {
    defaultArrayItem: DefaultArrayItem
  }
};
const defaultWidgets = {
  [TemplateType.CONTROL]: {
    defaultControl: DefaultControlWidget,
    string: DefaultStringWidget,
    boolean: DefaultBooleanWidget,
    number: DefaultNumberWidget,
    integer: DefaultNumberWidget,
    enum: DefaultSelectWidget,
    uniqueItemEnum: DefaultUniqueItemEnumWidget
  }
};
const getKeyValue = (key) => (obj) => obj[key];
function getTemplate(type, templates, template) {
  if (!template && type === TemplateType.VERTICAL_LAYOUT)
    template = "defaultVertical";
  else if (!template && type === TemplateType.HORIZONTAL_LAYOUT)
    template = "defaultHorizontal";
  else if (!template && type === TemplateType.ARRAY)
    template = "defaultArray";
  else if (!template && type === TemplateType.CONTROL)
    template = "defaultControl";
  if (templates[type]) {
    const defaultTemplate = templates[type];
    if (defaultTemplate) {
      const templateData = getKeyValue(template)(defaultTemplate);
      if (templateData)
        return templateData;
    }
  }
  if (defaultTemplates[type]) {
    const defaultTemplate = defaultTemplates[type];
    if (defaultTemplate) {
      const templateData = getKeyValue(template)(defaultTemplate);
      if (templateData)
        return templateData;
    }
  }
  throw new Error(`GetTemplate: Template ${template} is invalid.`);
}
function getWidget({ type, widgets, widget }) {
  if (!widget)
    widget = "defaultControl";
  if (widgets[type]) {
    const defaultWidget = widgets[type];
    if (defaultWidget) {
      const templateData = getKeyValue(widget)(defaultWidget);
      if (templateData)
        return templateData;
    }
  }
  if (defaultWidgets[type]) {
    const defaultWidget = defaultWidgets[type];
    if (defaultWidget) {
      const templateData = getKeyValue(widget)(defaultWidget);
      if (templateData)
        return templateData;
    }
  }
  throw new Error(`GetWidget: Widget ${widget} is invalid.`);
}
function getAdditionalTemplate(type, additionals, template) {
  if (additionals[type]) {
    const defaultAdditional = additionals[type];
    const templateData = getKeyValue(template)(defaultAdditional);
    if (templateData)
      return templateData;
  }
  if (defaultAdditionals[type]) {
    const defaultAdditional = defaultAdditionals[type];
    const templateData = getKeyValue(template)(defaultAdditional);
    if (templateData)
      return templateData;
  }
  throw new Error(`GetAdditionalTemplate: AdditionalTemplate ${template.toString()} is invalid.`);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var objectProto$6 = Object.prototype;
function isPrototype$2(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$6;
  return value === proto;
}
var _isPrototype = isPrototype$2;
function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var _overArg = overArg$1;
var overArg = _overArg;
var nativeKeys$1 = overArg(Object.keys, Object);
var _nativeKeys = nativeKeys$1;
var isPrototype$1 = _isPrototype, nativeKeys = _nativeKeys;
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function baseKeys$1(object) {
  if (!isPrototype$1(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$4.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var _baseKeys = baseKeys$1;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$7 = freeGlobal || freeSelf || Function("return this")();
var _root = root$7;
var root$6 = _root;
var Symbol$3 = root$6.Symbol;
var _Symbol = Symbol$3;
var Symbol$2 = _Symbol;
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
var nativeObjectToString$1 = objectProto$4.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto$3 = Object.prototype;
var nativeObjectToString = objectProto$3.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag$4(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$4;
function isObject$2(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$2;
var baseGetTag$3 = _baseGetTag, isObject$1 = isObject_1;
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction$2(value) {
  if (!isObject$1(value)) {
    return false;
  }
  var tag = baseGetTag$3(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_1 = isFunction$2;
var root$5 = _root;
var coreJsData$1 = root$5["__core-js_shared__"];
var _coreJsData = coreJsData$1;
var coreJsData = _coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked$1(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var _isMasked = isMasked$1;
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var _toSource = toSource$2;
var isFunction$1 = isFunction_1, isMasked = _isMasked, isObject = isObject_1, toSource$1 = _toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative$1(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource$1(value));
}
var _baseIsNative = baseIsNative$1;
function getValue$1(object, key) {
  return object == null ? void 0 : object[key];
}
var _getValue = getValue$1;
var baseIsNative = _baseIsNative, getValue = _getValue;
function getNative$5(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var _getNative = getNative$5;
var getNative$4 = _getNative, root$4 = _root;
var DataView$1 = getNative$4(root$4, "DataView");
var _DataView = DataView$1;
var getNative$3 = _getNative, root$3 = _root;
var Map$1 = getNative$3(root$3, "Map");
var _Map = Map$1;
var getNative$2 = _getNative, root$2 = _root;
var Promise$2 = getNative$2(root$2, "Promise");
var _Promise = Promise$2;
var getNative$1 = _getNative, root$1 = _root;
var Set$2 = getNative$1(root$1, "Set");
var _Set = Set$2;
var getNative = _getNative, root = _root;
var WeakMap$1 = getNative(root, "WeakMap");
var _WeakMap = WeakMap$1;
var DataView = _DataView, Map = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap = _WeakMap, baseGetTag$2 = _baseGetTag, toSource = _toSource;
var mapTag$2 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$2 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
var dataViewTag$1 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap);
var getTag$1 = baseGetTag$2;
if (DataView && getTag$1(new DataView(new ArrayBuffer(1))) != dataViewTag$1 || Map && getTag$1(new Map()) != mapTag$2 || Promise$1 && getTag$1(Promise$1.resolve()) != promiseTag || Set$1 && getTag$1(new Set$1()) != setTag$2 || WeakMap && getTag$1(new WeakMap()) != weakMapTag$1) {
  getTag$1 = function(value) {
    var result = baseGetTag$2(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$1;
        case mapCtorString:
          return mapTag$2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$2;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    }
    return result;
  };
}
var _getTag = getTag$1;
function isObjectLike$3(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$3;
var baseGetTag$1 = _baseGetTag, isObjectLike$2 = isObjectLike_1;
var argsTag$1 = "[object Arguments]";
function baseIsArguments$1(value) {
  return isObjectLike$2(value) && baseGetTag$1(value) == argsTag$1;
}
var _baseIsArguments = baseIsArguments$1;
var baseIsArguments = _baseIsArguments, isObjectLike$1 = isObjectLike_1;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;
var isArguments$1 = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike$1(value) && hasOwnProperty$1.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_1 = isArguments$1;
var isArray$1 = Array.isArray;
var isArray_1 = isArray$1;
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength$2(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
var isLength_1 = isLength$2;
var isFunction = isFunction_1, isLength$1 = isLength_1;
function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction(value);
}
var isArrayLike_1 = isArrayLike$1;
var isBuffer$1 = { exports: {} };
function stubFalse() {
  return false;
}
var stubFalse_1 = stubFalse;
isBuffer$1.exports;
(function(module, exports) {
  var root2 = _root, stubFalse2 = stubFalse_1;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root2.Buffer : void 0;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
  var isBuffer2 = nativeIsBuffer || stubFalse2;
  module.exports = isBuffer2;
})(isBuffer$1, isBuffer$1.exports);
var isBufferExports = isBuffer$1.exports;
var baseGetTag = _baseGetTag, isLength = isLength_1, isObjectLike = isObjectLike_1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$1 = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray$1(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
var _baseIsTypedArray = baseIsTypedArray$1;
function baseUnary$1(func) {
  return function(value) {
    return func(value);
  };
}
var _baseUnary = baseUnary$1;
var _nodeUtil = { exports: {} };
_nodeUtil.exports;
(function(module, exports) {
  var freeGlobal2 = _freeGlobal;
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil2 = function() {
    try {
      var types = freeModule && freeModule.require && freeModule.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  module.exports = nodeUtil2;
})(_nodeUtil, _nodeUtil.exports);
var _nodeUtilExports = _nodeUtil.exports;
var baseIsTypedArray = _baseIsTypedArray, baseUnary = _baseUnary, nodeUtil = _nodeUtilExports;
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray_1 = isTypedArray$1;
var baseKeys = _baseKeys, getTag = _getTag, isArguments = isArguments_1, isArray = isArray_1, isArrayLike = isArrayLike_1, isBuffer = isBufferExports, isPrototype = _isPrototype, isTypedArray = isTypedArray_1;
var mapTag = "[object Map]", setTag = "[object Set]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_1 = isEmpty;
const isEmpty$1 = /* @__PURE__ */ getDefaultExportFromCjs(isEmpty_1);
const decode = (pointerSegment) => pointerSegment?.replace(/~1/g, "/").replace(/~0/, "~");
const toDataPathSegments = (schemaPath) => {
  const s = schemaPath.replace(/(anyOf|allOf|oneOf)\/[\d]\//g, "").replace(/(then|else)\//g, "");
  const segments = s.split("/");
  const decodedSegments = segments.map(decode);
  const startFromRoot = decodedSegments[0] === "#" || decodedSegments[0] === "";
  const startIndex = startFromRoot ? 2 : 1;
  return range(startIndex, decodedSegments.length, 2).map((idx) => decodedSegments[idx]);
};
const isObjectSchema = (schema) => {
  return schema.properties !== void 0;
};
const isArraySchema = (schema) => {
  return schema.type === "array" && schema.items !== void 0;
};
const resolveData = (instance, dataPathSegments) => {
  if (dataPathSegments.length <= 0)
    return instance;
  return dataPathSegments.reduce((curInstance, decodedSegment) => {
    if (!curInstance || !Object.prototype.hasOwnProperty.call(curInstance, decodedSegment))
      return void 0;
    return curInstance[decodedSegment];
  }, instance);
};
const findAllRefs = (schema, result = {}, resolveTuples = false) => {
  if (schema && typeof schema !== "boolean" && isObjectSchema(schema))
    Object.keys(schema.properties || {}).forEach((key) => findAllRefs(schema.properties[key], result));
  if (schema && typeof schema !== "boolean" && isArraySchema(schema)) {
    if (Array.isArray(schema.items)) {
      if (resolveTuples) {
        const items = schema.items;
        items.forEach((child) => findAllRefs(child, result));
      }
    } else
      findAllRefs(schema.items, result);
  }
  if (schema && typeof schema !== "boolean" && Array.isArray(schema.anyOf)) {
    const anyOf = schema.anyOf;
    anyOf.forEach((child) => findAllRefs(child, result));
  }
  if (schema && typeof schema !== "boolean" && schema.$ref !== void 0)
    result[schema.$ref] = schema;
  return result;
};
const invalidSegment = (pathSegment) => pathSegment === "#" || pathSegment === void 0 || pathSegment === "";
const resolveSchema = (schema, schemaPath, rootSchema) => {
  const segments = schemaPath?.split("/").map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema);
};
const resolveSchemaWithSegments = (schema, pathSegments, rootSchema) => {
  if (isEmpty$1(schema))
    return void 0;
  if (schema.$ref)
    schema = resolveSchema(rootSchema, schema.$ref, rootSchema);
  if (!pathSegments || pathSegments.length === 0)
    return schema;
  const [segment, ...remainingSegments] = pathSegments;
  if (invalidSegment(segment))
    return resolveSchemaWithSegments(schema, remainingSegments, rootSchema);
  const singleSegmentResolveSchema = get(schema, segment);
  const resolvedSchema = resolveSchemaWithSegments(singleSegmentResolveSchema, remainingSegments, rootSchema);
  if (resolvedSchema)
    return resolvedSchema;
  if (segment === "properties" || segment === "items") {
    let alternativeResolveResult = void 0;
    const subSchemas = [].concat(
      // @ts-ignore
      schema.oneOf ?? [],
      schema.allOf ?? [],
      schema.anyOf ?? [],
      schema.then ?? [],
      schema.else ?? []
    );
    for (const subSchema of subSchemas) {
      alternativeResolveResult = resolveSchemaWithSegments(subSchema, [
        segment,
        ...remainingSegments
      ], rootSchema);
      if (alternativeResolveResult)
        break;
    }
    return alternativeResolveResult;
  }
  return void 0;
};
const Lifecycle = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  useVisibleTaskQrl(/* @__PURE__ */ inlinedQrl(({ cleanup }) => {
    const [props2] = useLexicalScope();
    if ("value" in props2.store)
      props2.store.internal.transform = props2.transform ? Array.isArray(props2.transform) ? props2.transform : [
        props2.transform
      ] : [];
    const consumer = getUniqueId();
    props2.store.internal.consumers.push(consumer);
    if (!props2.store.active) {
      props2.store.active = true;
      updateFormState(props2.of);
    }
    cleanup(() => setTimeout(() => {
      if (!props2.store) {
        updateFormState(props2.of);
        return;
      }
      props2.store.internal.consumers.splice(props2.store.internal.consumers.indexOf(consumer), 1);
      if (!props2.keepActive && !props2.store.internal.consumers.length) {
        props2.store.active = false;
        if (!props2.keepState)
          reset(props2.of, props2.store.name);
        else
          updateFormState(props2.of);
      }
      if ("value" in props2.store)
        props2.store.internal.elements = props2.store.internal.elements.filter((element) => element.isConnected);
    }, 15));
  }, "Lifecycle_component_useVisibleTask_08XMALK5jK4", [
    props
  ]));
  return /* @__PURE__ */ _jsxC(Slot, null, 3, "ek_0");
}, "Lifecycle_component_7Yt6SfMVUsM"));
function Field({ children, name, type, ...props }) {
  const { of: form } = props;
  const field = getFieldStore(form, name);
  if (props.default && (!field.internal.initialValue || !field.internal.startValue) && field.value === void 0)
    field.value = props.default;
  return /* @__PURE__ */ _jsxC(Lifecycle, {
    store: field,
    ...props,
    children: children(field, {
      name,
      autoFocus: isServer && !!field.error,
      ref: /* @__PURE__ */ inlinedQrl((element) => {
        const [field2] = useLexicalScope();
        field2.internal.elements.push(element);
      }, "Field_Lifecycle_children_XBSB0sncUiY", [
        field
      ]),
      onInput$: /* @__PURE__ */ inlinedQrl((event, element) => {
        const [field2, form2, name2, type2] = useLexicalScope();
        handleFieldEvent(form2, field2, name2, event, element, [
          "touched",
          "input"
        ], getElementInput(element, field2, type2));
      }, "Field_Lifecycle_children_1_AJxNrRoj0fw", [
        field,
        form,
        name,
        type
      ]),
      onChange$: /* @__PURE__ */ inlinedQrl((event, element) => {
        const [field2, form2, name2] = useLexicalScope();
        handleFieldEvent(form2, field2, name2, event, element, [
          "change"
        ]);
      }, "Field_Lifecycle_children_2_xhp4tpKYHBI", [
        field,
        form,
        name
      ]),
      onBlur$: /* @__PURE__ */ inlinedQrl((event, element) => {
        const [field2, form2, name2] = useLexicalScope();
        handleFieldEvent(form2, field2, name2, event, element, [
          "touched",
          "blur"
        ]);
      }, "Field_Lifecycle_children_3_4hW3SXjjbY4", [
        field,
        form,
        name
      ]),
      min: props.min,
      max: props.max,
      step: props.step,
      selectOptions: props.selectOptions,
      required: props.required,
      disabled: props.disabled || form.disabled
    })
  }, 0, name);
}
const ControlTemplateMaker = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  _jsxBranch();
  let layoutScope = props.layout.scope;
  let newOverrideScope = props.overrideScope;
  if (props.itemScope) {
    layoutScope = layoutScope.replace(/\{scope\}/g, props.itemScope);
    if (newOverrideScope && props.layout.scope.includes("{scope}"))
      newOverrideScope = props.layout.scope.replace(/\{scope\}\/?/g, newOverrideScope);
  }
  const parentSchema = resolveSchema(props.formData.schema, layoutScope.split("/").slice(0, -2).join("/"), props.formData.schema) || (newOverrideScope ? resolveSchema(props.formData.schema, newOverrideScope.split("/").slice(0, -2).join("/"), props.formData.schema) : {});
  const subSchema = resolveSchema(props.formData.schema, layoutScope, props.formData.schema) || (newOverrideScope ? resolveSchema(props.formData.schema, newOverrideScope, props.formData.schema) : {});
  if (!subSchema)
    return /* @__PURE__ */ _jsxC(Fragment, {
      children: "No valid Schema found"
    }, 3, "2l_0");
  const dataPath = toDataPathSegments(layoutScope);
  const FormTemplate = getTemplate(props.layout.type, props.formData.uiSchema.templates, props.layout["ui:template"]);
  const ErrorTemplate = getAdditionalTemplate(AdditionalTemplateType.ERROR, props.formData.uiSchema.templates, "defaultError");
  const TitleTemplate = getAdditionalTemplate(AdditionalTemplateType.FIELD, props.formData.uiSchema.templates, "defaultTitle");
  const schemaType = (() => {
    if (parentSchema?.uniqueItems && subSchema.enum)
      return "uniqueItemEnum";
    if (subSchema.enum)
      return "enum";
    if (Array.isArray(subSchema.type))
      return subSchema.type[0];
    return subSchema.type;
  })();
  const widget = (field, props1) => {
    const FormWidget = getWidget({
      type: props.layout.type,
      widgets: props.formData.uiSchema.widgets,
      widget: props.layout["ui:widget"] || schemaType
    });
    return /* @__PURE__ */ _jsxC(FormWidget, {
      get layout() {
        return props.layout;
      },
      additionalProps: props1,
      field,
      subSchema,
      [_IMMUTABLE]: {
        layout: _fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 3, "2l_1");
  };
  useTaskQrl(/* @__PURE__ */ inlinedQrl(() => {
    const [dataPath2, props2] = useLexicalScope();
    if (!props2.formData.internal.fields[dataPath2.join(".")])
      props2.formData.internal.fields[dataPath2.join(".")] = getInitialFieldStore(dataPath2.join("."));
  }, "ControlTemplateMaker_component_useTask_kTWfUL1dnQM", [
    dataPath,
    props
  ]));
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxC(Field, {
      name: dataPath.join("."),
      get of() {
        return props.formData;
      },
      type: schemaType,
      get selectOptions() {
        return subSchema.enum;
      },
      get min() {
        return subSchema.minimum;
      },
      get max() {
        return subSchema.maximum;
      },
      get step() {
        return subSchema.multipleOf;
      },
      get default() {
        return subSchema.default;
      },
      required: parentSchema?.required?.includes(dataPath[dataPath.length - 1]),
      get disabled() {
        return props.layout["ui:disabled"] === true ? true : false;
      },
      children: (field, props1) => /* @__PURE__ */ _jsxBranch(/* @__PURE__ */ _jsxC(Fragment, {
        children: field ? /* @__PURE__ */ _jsxC(FormTemplate, {
          get formDisabled() {
            return props.formData.disabled;
          },
          field,
          get layout() {
            return props.layout;
          },
          children: [
            /* @__PURE__ */ _jsxC(TitleTemplate, {
              "q:slot": "title",
              get layout() {
                return props.layout;
              },
              field,
              required: parentSchema?.required?.includes(dataPath[dataPath.length - 1]),
              subSchema,
              [_IMMUTABLE]: {
                layout: _fnSignal((p0) => p0.layout, [
                  props
                ], "p0.layout"),
                "q:slot": _IMMUTABLE
              }
            }, 3, "2l_2"),
            /* @__PURE__ */ _jsxQ("span", {
              "q:slot": "description"
            }, null, props.layout["ui:description"] || subSchema?.description, 1, null),
            widget(field, props1),
            /* @__PURE__ */ _jsxC(ErrorTemplate, {
              "q:slot": "errors",
              get errors() {
                return field.error;
              },
              get dirty() {
                return field.dirty;
              },
              [_IMMUTABLE]: {
                dirty: _wrapProp(field, "dirty"),
                errors: _wrapProp(field, "error"),
                "q:slot": _IMMUTABLE
              }
            }, 3, "2l_3")
          ],
          subSchema,
          [_IMMUTABLE]: {
            formDisabled: _fnSignal((p0) => p0.formData.disabled, [
              props
            ], "p0.formData.disabled"),
            layout: _fnSignal((p0) => p0.layout, [
              props
            ], "p0.layout")
          }
        }, 1, "2l_4") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "2l_5")
      }, 1, "2l_6")),
      [_IMMUTABLE]: {
        default: _wrapProp(subSchema, "default"),
        disabled: _fnSignal((p0) => p0.layout["ui:disabled"] === true ? true : false, [
          props
        ], 'p0.layout["ui:disabled"]===true?true:false'),
        max: _wrapProp(subSchema, "maximum"),
        min: _wrapProp(subSchema, "minimum"),
        of: _fnSignal((p0) => p0.formData, [
          props
        ], "p0.formData"),
        selectOptions: _wrapProp(subSchema, "enum"),
        step: _wrapProp(subSchema, "multipleOf")
      }
    }, 3, "2l_7")
  }, 1, "2l_8");
}, "ControlTemplateMaker_component_gL3RUfrE0Yw"));
const defaultClasses = ".form-vertical-default {\n  display: flex;\n  flex-direction: column;\n}\n\n.form-horizontal-default {\n  display: flex;\n  flex-direction: row;\n}\n\n.form-control-default {\n  padding: 6px;\n}\n\n.form-control-widget-default {\n  display: flex;\n  flex-direction: column;\n  padding: 4px;\n}\n\n.default-uniqueitem-enum-widget {\n  display: flex;\n  flex-direction: row;\n}\n\n.form-array-item {\n  border-style: solid;\n  border-width: 1px;\n  margin: 8px;\n  padding: 4px;\n}\n\n.form-uniqueitem-enum-array-item {\n  border-style: unset;\n  border-width: unset;\n  margin: unset;\n  padding: unset;\n}\n";
function inferUiSchemaSingle(schema, scope) {
  if (typeof schema === "boolean" || Array.isArray(schema) || !schema)
    return {
      type: TemplateType.CONTROL,
      scope
    };
  switch (schema.type) {
    case "array":
      return {
        type: TemplateType.ARRAY,
        scope
      };
    case "null":
    case "string":
    case "integer":
    case "boolean":
    case "number":
    default:
      return {
        type: TemplateType.CONTROL,
        scope
      };
  }
}
function createUiSchema({ templates, widgets, layout }) {
  return {
    layout,
    widgets,
    templates
  };
}
function shiftAndDelete(obj, index, path) {
  const keys = Object.keys(obj);
  const deleteBeforeKeys = [];
  const filteredKeys = keys.filter((key) => {
    const keySplit = key.split(`${path}.`);
    keySplit.shift();
    const restKeys = keySplit.join(`${path}.`).split(".");
    if (parseInt(restKeys[0]) === index)
      deleteBeforeKeys.push(key);
    return key.startsWith(`${path}.`) && parseInt(restKeys[0]) > index;
  });
  let deleteAfterKeys = [];
  let lastInt = void 0;
  const newObj = keys.reduce((acc, key) => {
    if (filteredKeys.includes(key)) {
      const keySplit = key.split(`${path}.`);
      keySplit.shift();
      const restKeys = keySplit.join(`${path}.`).split(".");
      const firstRestKey = restKeys.shift();
      const newKey = `${path}.` + [
        (parseInt(firstRestKey) - 1).toString(),
        ...restKeys
      ].join(".");
      acc[key] = newKey;
      if (!lastInt || lastInt < firstRestKey) {
        lastInt = firstRestKey;
        deleteAfterKeys = [];
      }
      if (lastInt === firstRestKey)
        deleteAfterKeys.push(key);
    }
    return acc;
  }, {});
  return {
    newObj,
    deleteBeforeKeys,
    deleteAfterKeys
  };
}
const ArrayTemplateMaker = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  _jsxBranch();
  let layoutScope = props.layout.scope;
  let newOverrideScope = props.overrideScope;
  if (props.itemScope) {
    layoutScope = layoutScope.replace(/\{scope\}/g, props.itemScope);
    if (newOverrideScope)
      newOverrideScope = props.layout.scope.replace(/\{scope\}\/?/g, newOverrideScope);
  }
  const subSchema = resolveSchema(props.formData.schema, newOverrideScope || layoutScope, props.formData.schema);
  if (!subSchema)
    return /* @__PURE__ */ _jsxC(Fragment, {
      children: "No Schema found for array."
    }, 3, "92_0");
  const dataPath = toDataPathSegments(layoutScope);
  const FormTemplate = getTemplate(props.layout.type, props.formData.uiSchema.templates, props.layout["ui:template"]);
  const addItem = /* @__PURE__ */ inlinedQrl(() => {
    const [dataPath2, props2] = useLexicalScope();
    const newItemPath = dataPath2.join(".");
    if (!props2.formData.internal.fields[newItemPath])
      props2.formData.internal.fields[newItemPath] = getInitialFieldStore(dataPath2.join("."));
    if (!props2.formData.internal.fields[newItemPath].value)
      props2.formData.internal.fields[newItemPath].value = [];
    props2.formData.internal.fields[newItemPath].value.push(void 0);
  }, "ArrayTemplateMaker_component_addItem_Foc1VYIcn6Q", [
    dataPath,
    props
  ]);
  const removeItem = /* @__PURE__ */ inlinedQrl((i) => {
    const [dataPath2, props2] = useLexicalScope();
    const newItemPath = dataPath2.join(".");
    const { newObj, deleteBeforeKeys, deleteAfterKeys } = shiftAndDelete(props2.formData.internal.fields, i, newItemPath);
    const safeKeys = [];
    Object.entries(newObj).forEach(([k, v]) => {
      if (props2.formData.internal.fields[v])
        props2.formData.internal.fields[v].value = props2.formData.internal.fields[k]?.value;
      else {
        props2.formData.internal.fields[v] = props2.formData.internal.fields[k];
        props2.formData.internal.fields[v].name = v;
      }
      safeKeys.push(v);
    });
    deleteBeforeKeys.filter((v) => !safeKeys.includes(v)).forEach((v) => {
      delete props2.formData.internal.fields[v];
    });
    if (deleteAfterKeys.length <= 0) {
      const path = [
        ...dataPath2,
        i
      ].join(".");
      const keys = Object.keys(props2.formData.internal.fields);
      keys.forEach((key) => {
        if (key.startsWith(`${path}`))
          delete props2.formData.internal.fields[key];
      });
    } else
      deleteAfterKeys.forEach((v) => {
        delete props2.formData.internal.fields[v];
      });
    props2.formData.internal.fields[newItemPath]?.value.splice(i, 1);
  }, "ArrayTemplateMaker_component_removeItem_OTI0xQOnwaM", [
    dataPath,
    props
  ]);
  const testUniqueEnum = subSchema.uniqueItems && subSchema.items && typeof subSchema.items !== "boolean" && !Array.isArray(subSchema.items) ? noSerialize(subSchema.items.enum) : void 0;
  const defaultSubSchema = subSchema.default;
  useTaskQrl(/* @__PURE__ */ inlinedQrl(() => {
    const [dataPath2, defaultSubSchema2, props2, testUniqueEnum2] = useLexicalScope();
    if (!props2.formData.internal.fields[dataPath2.join(".")]) {
      props2.formData.internal.fields[dataPath2.join(".")] = getInitialFieldStore(dataPath2.join("."), {
        value: defaultSubSchema2 ? [
          ...defaultSubSchema2
        ] : void 0,
        initialValue: [],
        error: []
      });
      for (let i = 0; i < (defaultSubSchema2 || []).length; i++) {
        props2.formData.internal.fields[[
          ...dataPath2,
          i
        ].join(".")] = getInitialFieldStore([
          ...dataPath2,
          i
        ].join("."), {
          value: defaultSubSchema2[i],
          initialValue: void 0,
          error: []
        });
        props2.formData.internal.fields[[
          ...dataPath2,
          i
        ].join(".")].internal.startValue = defaultSubSchema2[i];
      }
      props2.formData.internal.fields[[
        ...dataPath2
      ].join(".")].internal.startValue = defaultSubSchema2 ? [
        ...defaultSubSchema2
      ] : void 0;
    }
    if (testUniqueEnum2) {
      for (let i = 0; i < testUniqueEnum2.length; i++) {
        props2.formData.internal.fields[[
          ...dataPath2,
          i
        ].join(".")] = getInitialFieldStore([
          ...dataPath2,
          i
        ].join("."), {
          value: props2.formData.internal.fields[dataPath2.join(".")]?.value.includes(testUniqueEnum2[i]) ? testUniqueEnum2[i] : void 0,
          initialValue: props2.formData.internal.fields[dataPath2.join(".")]?.value.includes(testUniqueEnum2[i]) ? testUniqueEnum2[i] : void 0,
          error: [],
          isUniqueEnum: true
        });
        props2.formData.internal.fields[[
          ...dataPath2,
          i
        ].join(".")].internal.startValue = testUniqueEnum2[i];
      }
      props2.formData.internal.fields[dataPath2.join(".")].value = void 0;
    }
  }, "ArrayTemplateMaker_component_useTask_Csvxd5Rb3s8", [
    dataPath,
    defaultSubSchema,
    props,
    testUniqueEnum
  ]));
  const AddButtonTemplate = getAdditionalTemplate(AdditionalTemplateType.BUTTON, props.formData.uiSchema.templates, "addButton");
  const RemoveButtonTemplate = getAdditionalTemplate(AdditionalTemplateType.BUTTON, props.formData.uiSchema.templates, "removeButton");
  const ArrayItemTemplate = getAdditionalTemplate(AdditionalTemplateType.ARRAY_ITEM, props.formData.uiSchema.templates, "defaultArrayItem");
  const TitleTemplate = getAdditionalTemplate(AdditionalTemplateType.FIELD, props.formData.uiSchema.templates, "defaultArrayTitle");
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: /* @__PURE__ */ _jsxC(FormTemplate, {
      get layout() {
        return props.layout;
      },
      children: [
        props.layout["ui:title"] === false ? /* @__PURE__ */ _jsxC(Fragment, null, 3, "92_1") : /* @__PURE__ */ _jsxC(TitleTemplate, {
          "q:slot": "title",
          get layout() {
            return props.layout;
          },
          required: !!subSchema.minItems,
          subSchema,
          [_IMMUTABLE]: {
            layout: _fnSignal((p0) => p0.layout, [
              props
            ], "p0.layout"),
            "q:slot": _IMMUTABLE
          }
        }, 3, "92_2"),
        (testUniqueEnum || props.formData.internal.fields[dataPath.join(".")]?.value || []).map((_item, i) => /* @__PURE__ */ _jsxBranch(/* @__PURE__ */ _jsxC(ArrayItemTemplate, {
          itemPath: [
            ...dataPath,
            i
          ].join("."),
          get layout() {
            return props.layout;
          },
          children: [
            /* @__PURE__ */ _jsxC(SchemaParser, {
              itemScope: layoutScope + `/items/${i}`,
              layout: {
                ...props.layout["ui:items"] || inferUiSchemaSingle(subSchema?.items, layoutScope + `/items/${i}`)
              },
              overrideScope: (newOverrideScope || layoutScope) + `/items/`,
              get templates() {
                return props.formData.uiSchema.templates;
              },
              get formData() {
                return props.formData;
              },
              [_IMMUTABLE]: {
                formData: _fnSignal((p0) => p0.formData, [
                  props
                ], "p0.formData"),
                templates: _fnSignal((p0) => p0.formData.uiSchema.templates, [
                  props
                ], "p0.formData.uiSchema.templates")
              }
            }, 3, "92_3"),
            !testUniqueEnum ? /* @__PURE__ */ _jsxC(RemoveButtonTemplate, {
              children: "Remove",
              props: {
                type: "button",
                onClick$: /* @__PURE__ */ inlinedQrl(() => {
                  const [i2, removeItem2] = useLexicalScope();
                  return removeItem2(i2);
                }, "ArrayTemplateMaker_component__Fragment_FormTemplate_ArrayItemTemplate_RemoveButtonTemplate_props_080XKdSEXos", [
                  i,
                  removeItem
                ]),
                disabled: props.formData.disabled
              },
              "q:slot": "remove-button",
              [_IMMUTABLE]: {
                "q:slot": _IMMUTABLE
              }
            }, 3, "92_4") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "92_5")
          ],
          isUniqueEnum: !!testUniqueEnum,
          subSchema,
          [_IMMUTABLE]: {
            layout: _fnSignal((p0) => p0.layout, [
              props
            ], "p0.layout")
          }
        }, 1, [
          ...dataPath,
          i
        ].join(".")))),
        !testUniqueEnum ? /* @__PURE__ */ _jsxC(AddButtonTemplate, {
          "q:slot": "add-button",
          get props() {
            return {
              type: "button",
              onClick$: addItem,
              disabled: props.formData.disabled
            };
          },
          children: "Add",
          [_IMMUTABLE]: {
            props: _fnSignal((p0, p1) => ({
              type: "button",
              onClick$: p0,
              disabled: p1.formData.disabled
            }), [
              addItem,
              props
            ], '{type:"button",onClick$:p0,disabled:p1.formData.disabled}'),
            "q:slot": _IMMUTABLE
          }
        }, 3, "92_6") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "92_7")
      ],
      subSchema,
      [_IMMUTABLE]: {
        layout: _fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "92_8")
  }, 1, "92_9");
}, "ArrayTemplateMaker_component_wblFW1RfRCw"));
const SchemaParser = /* @__PURE__ */ componentQrl(/* @__PURE__ */ inlinedQrl((props) => {
  _jsxBranch();
  useStylesQrl(/* @__PURE__ */ inlinedQrl(defaultClasses, "SchemaParser_component_useStyles_1bfC7AAj0Qw"));
  if (props.layout.type === TemplateType.HORIZONTAL_LAYOUT) {
    const Template = getTemplate(props.layout.type, props.templates, props.layout["ui:template"]);
    const items = props.layout.elements.map((x, i) => {
      return /* @__PURE__ */ _jsxC(SchemaParser, {
        layout: x,
        get templates() {
          return props.templates;
        },
        get formData() {
          return props.formData;
        },
        get overrideScope() {
          return props.overrideScope;
        },
        get itemScope() {
          return props.itemScope;
        },
        [_IMMUTABLE]: {
          formData: _fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: _fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          overrideScope: _fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope"),
          templates: _fnSignal((p0) => p0.templates, [
            props
          ], "p0.templates")
        }
      }, 3, i);
    });
    return /* @__PURE__ */ _jsxC(Template, {
      flex: false,
      grid: true,
      get layout() {
        return props.layout;
      },
      children: items,
      [_IMMUTABLE]: {
        flex: _IMMUTABLE,
        grid: _IMMUTABLE,
        layout: _fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "PK_0");
  }
  if (props.layout.type === TemplateType.VERTICAL_LAYOUT) {
    const Template = getTemplate(props.layout.type, props.templates, props.layout["ui:template"]);
    const items = props.layout.elements.map((x, i) => {
      return /* @__PURE__ */ _jsxC(SchemaParser, {
        layout: x,
        get templates() {
          return props.templates;
        },
        get formData() {
          return props.formData;
        },
        get overrideScope() {
          return props.overrideScope;
        },
        get itemScope() {
          return props.itemScope;
        },
        [_IMMUTABLE]: {
          formData: _fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: _fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          overrideScope: _fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope"),
          templates: _fnSignal((p0) => p0.templates, [
            props
          ], "p0.templates")
        }
      }, 3, i);
    });
    return /* @__PURE__ */ _jsxC(Template, {
      grid: true,
      get layout() {
        return props.layout;
      },
      children: items,
      [_IMMUTABLE]: {
        grid: _IMMUTABLE,
        layout: _fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "PK_1");
  }
  if (props.layout.type === TemplateType.ARRAY)
    return /* @__PURE__ */ _jsxC(ArrayTemplateMaker, {
      get layout() {
        return props.layout;
      },
      get formData() {
        return props.formData;
      },
      get overrideScope() {
        return props.overrideScope;
      },
      get itemScope() {
        return props.itemScope;
      },
      [_IMMUTABLE]: {
        formData: _fnSignal((p0) => p0.formData, [
          props
        ], "p0.formData"),
        itemScope: _fnSignal((p0) => p0.itemScope, [
          props
        ], "p0.itemScope"),
        layout: _fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout"),
        overrideScope: _fnSignal((p0) => p0.overrideScope, [
          props
        ], "p0.overrideScope")
      }
    }, 3, "PK_2");
  if (props.layout.type === TemplateType.CONTROL)
    return /* @__PURE__ */ _jsxC(Fragment, {
      children: /* @__PURE__ */ _jsxC(ControlTemplateMaker, {
        get layout() {
          return props.layout;
        },
        get formData() {
          return props.formData;
        },
        get overrideScope() {
          return props.overrideScope;
        },
        get itemScope() {
          return props.itemScope;
        },
        [_IMMUTABLE]: {
          formData: _fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: _fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          layout: _fnSignal((p0) => p0.layout, [
            props
          ], "p0.layout"),
          overrideScope: _fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope")
        }
      }, 3, "PK_3")
    }, 1, "PK_4");
  throw new Error(`SchemaParser: Layout Type is invalid at: ${JSON.stringify(props.layout, null, 4)}`);
}, "SchemaParser_component_FDQ3hr5ltMg"));
function QSONForm({ of: form, action, onSubmit$, responseDuration: duration, keepResponse, shouldActive, shouldTouched, shouldDirty, shouldFocus, children, reloadDocument, ...formProps }) {
  _jsxBranch();
  const { encType } = formProps;
  const options = {
    duration,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldFocus
  };
  const SubmitButtonTemplate = getAdditionalTemplate(AdditionalTemplateType.BUTTON, form.uiSchema.templates, "submitButton");
  return /* @__PURE__ */ _jsxS("form", {
    ...formProps,
    action: action?.actionPath,
    children: [
      /* @__PURE__ */ _jsxC(SchemaParser, {
        get layout() {
          return form.uiSchema.layout;
        },
        get templates() {
          return form.uiSchema.templates;
        },
        formData: form,
        [_IMMUTABLE]: {
          layout: _wrapProp(form.uiSchema, "layout"),
          templates: _wrapProp(form.uiSchema, "templates")
        }
      }, 3, "iB_0"),
      !form.internal.hideSubmitButton ? /* @__PURE__ */ _jsxC(SubmitButtonTemplate, {
        get props() {
          return {
            type: "submit"
          };
        },
        children: "Submit",
        [_IMMUTABLE]: {
          props: _IMMUTABLE
        }
      }, 3, "iB_1") : /* @__PURE__ */ _jsxC(Fragment, null, 3, "iB_2"),
      children
    ],
    onSubmit$: /* @__PURE__ */ inlinedQrl(async (event, element) => {
      const [action2, encType2, form2, keepResponse2, onSubmit$2, options2, reloadDocument2] = useLexicalScope();
      if (!keepResponse2)
        form2.response = {};
      form2.submitCount++;
      form2.submitted = true;
      form2.submitting = true;
      try {
        if (await validate(form2, options2)) {
          const values = getValues(form2, options2);
          const [actionResult] = await Promise.all([
            !reloadDocument2 ? action2?.submit(encType2 ? new FormData(element) : values) : void 0,
            // eslint-disable-next-line qwik/valid-lexical-scope
            onSubmit$2?.(values, event)
          ]);
          if (actionResult?.value) {
            const { errors, response } = actionResult.value;
            if (Object.keys(response).length)
              setResponse(form2, response, options2);
            else
              setErrorResponse(form2, errors, options2);
          }
        }
      } catch (error) {
        if (error.message)
          setResponse(form2, {
            status: "error",
            message: error?.message || "An unknown error has occurred."
          }, options2);
      } finally {
        form2.submitting = false;
      }
    }, "QSONForm_form_onSubmit_l250PQXKND4", [
      action,
      encType,
      form,
      keepResponse,
      onSubmit$,
      options,
      reloadDocument
    ]),
    "preventdefault:submit": !reloadDocument,
    ref: (element) => {
      form.element = element;
    }
  }, {
    method: "post",
    noValidate: true
  }, 0, "iB_3");
}
function useQSONFormStore(schema, { validate: validate2, validateOn = "submit", revalidateOn = "input", hideSubmitButton, ...options }) {
  return useStore(() => {
    const [fields] = getInitialStores(options);
    return {
      internal: {
        fields,
        validate: validate2,
        validators: [],
        validateOn,
        revalidateOn,
        hideSubmitButton
      },
      schema,
      uiSchema: options.uiSchema,
      // FIXME: Set state based on `action`
      emptyIsUndefined: options.emptyIsUndefined,
      element: void 0,
      submitCount: 0,
      submitting: false,
      submitted: false,
      validating: false,
      touched: false,
      dirty: false,
      invalid: false,
      response: options.action?.value?.response || {}
    };
  });
}
function useQSONForm(schema, options) {
  const form = useQSONFormStore(schema, options);
  return [
    form,
    {
      QSONForm: (props) => QSONForm({
        of: form,
        action: options.action,
        ...props
      })
    }
  ];
}
function toCustomQrl(action, { on: mode }) {
  return /* @__PURE__ */ inlinedQrl((value, event, element) => {
    const [action2, mode2] = useLexicalScope();
    return event.type === mode2 ? action2(value, event, element) : value;
  }, "toCustomQrl_F9sJpg7hClg", [
    action,
    mode
  ]);
}
const toCustom$ = implicit$FirstArg(toCustomQrl);
export {
  AdditionalTemplateType,
  QSONForm,
  TemplateType,
  WidgetType,
  createUiSchema,
  decode,
  defaultAdditionals,
  defaultTemplates,
  defaultWidgets,
  findAllRefs,
  focus,
  getAdditionalTemplate,
  getTemplate,
  getValue$2 as getValue,
  getValues,
  getWidget,
  inferUiSchemaSingle,
  reset,
  resolveData,
  resolveSchema,
  setResponse,
  setValue,
  toCustom$,
  toCustomQrl,
  toDataPathSegments,
  useQSONForm,
  useQSONFormStore,
  validate
};
