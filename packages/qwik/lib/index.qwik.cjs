"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const qwik = require("@builder.io/qwik");
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const isEmpty = require("lodash/isEmpty");
const get = require("lodash/get");
const lodash = require("lodash");
const build = require("@builder.io/qwik/build");
function getOptions(arg1, arg2) {
  return (typeof arg1 !== "string" && !Array.isArray(arg1) ? arg1 : arg2) || {};
}
function getFieldStore(form, name) {
  return form.internal.fields[name];
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
function isFieldDirty(startValue, currentValue) {
  const toValue = (item) => item instanceof Blob ? item.size : item;
  return Array.isArray(startValue) && Array.isArray(currentValue) ? startValue.map(toValue).join() !== currentValue.map(toValue).join() : startValue instanceof Date && currentValue instanceof Date ? startValue.getTime() !== currentValue.getTime() : Number.isNaN(startValue) && Number.isNaN(currentValue) ? false : startValue !== currentValue;
}
function getInitialFieldStore(name, { value, initialValue, error } = {
  value: void 0,
  initialValue: void 0,
  error: []
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
    value,
    error,
    active: false,
    touched: dirty,
    dirty
  };
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
function getFieldAndArrayStores(form) {
  return [
    ...Object.values(form.internal.fields)
  ];
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
async function handleFieldEvent(form, field, name, event, element, validationModes, inputValue) {
  if (inputValue !== void 0 && inputValue !== null)
    field.value = inputValue;
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
  ] : (field.value || []).filter((v) => v !== value) : type === "number" ? valueAsNumber : type === "boolean" ? checked : type === "File" && files ? qwik.noSerialize(files[0]) : type === "File[]" && files ? [
    ...files
  ].map((file) => qwik.noSerialize(file)) : type === "Date" && valueAsDate ? valueAsDate : field.value;
}
function getValues(form, arg2, arg3) {
  const { shouldActive = true, shouldTouched = false, shouldDirty = false, shouldValid = false } = getOptions(arg2, arg3);
  return getFilteredNames(form, arg2)[0].reduce((values, name) => {
    const field = getFieldStore(form, name);
    if ((!shouldActive || field.active) && (!shouldTouched || field.touched) && (!shouldDirty || field.dirty) && (!shouldValid || !field.error))
      (typeof arg2 === "string" ? name.replace(`${arg2}.`, "") : name).split(".").reduce((object, key, index, keys) => object[key] = index === keys.length - 1 ? field.value : typeof object[key] === "object" && object[key] || (isNaN(+keys[index + 1]) ? {} : []), values);
    return values;
  }, typeof arg2 === "string" ? [] : {});
}
function setResponse(form, response, { duration } = {}) {
  form.response = response;
  if (duration)
    setTimeout(() => {
      if (form.response === response)
        form.response = {};
    }, duration);
}
function focus(form, name) {
  getFieldStore(form, name)?.internal.elements[0]?.focus();
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
exports.TemplateType = void 0;
(function(TemplateType2) {
  TemplateType2["VERTICAL_LAYOUT"] = "VerticalLayout";
  TemplateType2["HORIZONTAL_LAYOUT"] = "HorizontalLayout";
  TemplateType2["ARRAY"] = "Array";
  TemplateType2["CONTROL"] = "Control";
})(exports.TemplateType || (exports.TemplateType = {}));
exports.AdditionalTemplateType = void 0;
(function(AdditionalTemplateType2) {
  AdditionalTemplateType2["BUTTON"] = "Button";
  AdditionalTemplateType2["ERROR"] = "Error";
})(exports.AdditionalTemplateType || (exports.AdditionalTemplateType = {}));
exports.WidgetType = void 0;
(function(WidgetType2) {
  WidgetType2["CONTROL"] = "Control";
})(exports.WidgetType || (exports.WidgetType = {}));
const DefaultVertical = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      class: qwik._fnSignal((p0) => `form-vertical ${p0.layout["ui:class"] || "form-vertical-default"}`, [
        props
      ], '`form-vertical ${p0.layout["ui:class"]||"form-vertical-default"}`')
    }, /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "cd_0"), 1, null)
  }, 1, "cd_1");
}, "DefaultVertical_component_UY9oBhsK8n8"));
const DefaultHorizontal = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      class: qwik._fnSignal((p0) => `form-horizontal ${p0.layout["ui:class"] || "form-horizontal-default"}`, [
        props
      ], '`form-horizontal ${p0.layout["ui:class"]||"form-horizontal-default"}`')
    }, /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "ze_0"), 1, null)
  }, 1, "ze_1");
}, "DefaultHorizontal_component_UG9M04fl0Zs"));
const DefaultControl = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      class: qwik._fnSignal((p0) => `form-control ${p0.layout["ui:class"] || "form-control-default"}`, [
        props
      ], '`form-control ${p0.layout["ui:class"]||"form-control-default"}`')
    }, [
      /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "Tj_0"),
      /* @__PURE__ */ qwik._jsxC(qwik.Slot, {
        name: "errors",
        [qwik._IMMUTABLE]: {
          name: qwik._IMMUTABLE
        }
      }, 3, "Tj_1")
    ], 1, null)
  }, 1, "Tj_2");
}, "DefaultControl_component_6ykl2XdCces"));
const DefaultControlWidget = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      class: qwik._fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`')
    }, "Error no Widget found.", 3, null)
  }, 3, "O9_0");
}, "DefaultControlWidget_component_6y2CbsAOhVI"));
const DefaultStringWidget = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxS("input", {
      ...props.additionalProps
    }, {
      class: qwik._fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      value: qwik._fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_1");
}, "DefaultStringWidget_component_Pk5JOD6cApc"));
const DefaultBooleanWidget = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxS("input", {
      ...props.additionalProps
    }, {
      checked: qwik._fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value"),
      class: qwik._fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      type: "checkbox",
      value: qwik._fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_2");
}, "DefaultBooleanWidget_component_gxYt1twyeJo"));
const DefaultNumberWidget = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxS("input", {
      ...props.additionalProps
    }, {
      class: qwik._fnSignal((p0) => `form-control-widget ${p0.layout["ui:widget:class"] || "form-control-widget-default"}`, [
        props
      ], '`form-control-widget ${p0.layout["ui:widget:class"]||"form-control-widget-default"}`'),
      type: "number",
      value: qwik._fnSignal((p0) => p0.field.value, [
        props
      ], "p0.field.value")
    }, 0, null)
  }, 1, "O9_3");
}, "DefaultNumberWidget_component_iwjisttKp2E"));
const DefaultArray = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      class: qwik._fnSignal((p0) => `form-array ${p0.layout["ui:class"] || "form-array-default"}`, [
        props
      ], '`form-array ${p0.layout["ui:class"]||"form-array-default"}`')
    }, [
      /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "CN_0"),
      /* @__PURE__ */ qwik._jsxC(qwik.Slot, {
        name: "add-button",
        [qwik._IMMUTABLE]: {
          name: qwik._IMMUTABLE
        }
      }, 3, "CN_1")
    ], 1, null)
  }, 1, "CN_2");
}, "DefaultArray_component_R4SqZX2sFjE"));
const DefaultButton = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxS("button", {
      ...props.props,
      children: /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "g2_0")
    }, null, 0, null)
  }, 1, "g2_1");
}, "DefaultButton_component_0Mp2z3Gj9kY"));
const DefaultError = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxQ("div", null, {
      style: "color: red;"
    }, props.errors && props.errors.length > 0 ? props.errors[0].message : /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, null, 3, "jB_0"), 1, null)
  }, 1, "jB_1");
}, "DefaultError_component_r0fcZemJgRY"));
const defaultTemplates = {
  [exports.TemplateType.VERTICAL_LAYOUT]: {
    defaultVertical: DefaultVertical
  },
  [exports.TemplateType.HORIZONTAL_LAYOUT]: {
    defaultHorizontal: DefaultHorizontal
  },
  [exports.TemplateType.ARRAY]: {
    defaultArray: DefaultArray
  },
  [exports.TemplateType.CONTROL]: {
    defaultControl: DefaultControl
  }
};
const defaultAdditionals = {
  [exports.AdditionalTemplateType.BUTTON]: {
    addButton: DefaultButton,
    removeButton: DefaultButton,
    moveUpButton: DefaultButton,
    moveDownButton: DefaultButton
  },
  [exports.AdditionalTemplateType.ERROR]: {
    defaultError: DefaultError
  }
};
const defaultWidgets = {
  [exports.TemplateType.CONTROL]: {
    defaultControl: DefaultControlWidget,
    string: DefaultStringWidget,
    boolean: DefaultBooleanWidget,
    number: DefaultNumberWidget
  }
};
const getKeyValue = (key) => (obj) => obj[key];
function getTemplate(type, templates, template) {
  if (!template && type === exports.TemplateType.VERTICAL_LAYOUT)
    template = "defaultVertical";
  else if (!template && type === exports.TemplateType.HORIZONTAL_LAYOUT)
    template = "defaultHorizontal";
  else if (!template && type === exports.TemplateType.ARRAY)
    template = "defaultArray";
  else if (!template && type === exports.TemplateType.CONTROL)
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
const decode = (pointerSegment) => pointerSegment?.replace(/~1/g, "/").replace(/~0/, "~");
const toDataPathSegments = (schemaPath) => {
  const s = schemaPath.replace(/(anyOf|allOf|oneOf)\/[\d]\//g, "").replace(/(then|else)\//g, "");
  const segments = s.split("/");
  const decodedSegments = segments.map(decode);
  const startFromRoot = decodedSegments[0] === "#" || decodedSegments[0] === "";
  const startIndex = startFromRoot ? 2 : 1;
  return lodash.range(startIndex, decodedSegments.length, 2).map((idx) => decodedSegments[idx]);
};
const invalidSegment = (pathSegment) => pathSegment === "#" || pathSegment === void 0 || pathSegment === "";
const resolveSchema = (schema, schemaPath, rootSchema) => {
  const segments = schemaPath?.split("/").map(decode);
  return resolveSchemaWithSegments(schema, segments, rootSchema);
};
const resolveSchemaWithSegments = (schema, pathSegments, rootSchema) => {
  if (isEmpty(schema))
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
const Lifecycle = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  qwik.useVisibleTaskQrl(/* @__PURE__ */ qwik.inlinedQrl(({ cleanup }) => {
    const [props2] = qwik.useLexicalScope();
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
  return /* @__PURE__ */ qwik._jsxC(qwik.Slot, null, 3, "ek_0");
}, "Lifecycle_component_7Yt6SfMVUsM"));
function Field({ children, name, type, ...props }) {
  const { of: form } = props;
  const field = getFieldStore(form, name);
  return /* @__PURE__ */ qwik._jsxC(Lifecycle, {
    store: field,
    ...props,
    children: children(field, {
      name,
      autoFocus: build.isServer && !!field.error,
      ref: /* @__PURE__ */ qwik.inlinedQrl((element) => {
        const [field2] = qwik.useLexicalScope();
        field2.internal.elements.push(element);
      }, "Field_Lifecycle_children_XBSB0sncUiY", [
        field
      ]),
      onInput$: /* @__PURE__ */ qwik.inlinedQrl((event, element) => {
        const [field2, form2, name2, type2] = qwik.useLexicalScope();
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
      onChange$: /* @__PURE__ */ qwik.inlinedQrl((event, element) => {
        const [field2, form2, name2] = qwik.useLexicalScope();
        handleFieldEvent(form2, field2, name2, event, element, [
          "change"
        ]);
      }, "Field_Lifecycle_children_2_xhp4tpKYHBI", [
        field,
        form,
        name
      ]),
      onBlur$: /* @__PURE__ */ qwik.inlinedQrl((event, element) => {
        const [field2, form2, name2] = qwik.useLexicalScope();
        handleFieldEvent(form2, field2, name2, event, element, [
          "touched",
          "blur"
        ]);
      }, "Field_Lifecycle_children_3_4hW3SXjjbY4", [
        field,
        form,
        name
      ])
    })
  }, 0, name);
}
const ControlTemplateMaker = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  let layoutScope = props.layout.scope;
  let newOverrideScope = props.overrideScope;
  if (props.itemScope) {
    layoutScope = layoutScope.replace(/\{scope\}/g, props.itemScope);
    if (newOverrideScope && props.layout.scope.includes("{scope}"))
      newOverrideScope = props.layout.scope.replace(/\{scope\}\/?/g, newOverrideScope);
  }
  const subSchema = resolveSchema(props.formData.schema, layoutScope, props.formData.schema) || (newOverrideScope ? resolveSchema(props.formData.schema, newOverrideScope, props.formData.schema) : {});
  const dataPath = toDataPathSegments(layoutScope);
  const FormTemplate = getTemplate(props.layout.type, props.formData.uiSchema.templates, props.layout["ui:template"]);
  const ErrorTemplate = getAdditionalTemplate(exports.AdditionalTemplateType.ERROR, props.formData.uiSchema.templates, "defaultError");
  const widget = (field, props1) => {
    const FormWidget = getWidget({
      type: props.layout.type,
      widgets: props.formData.uiSchema.widgets,
      widget: props.layout["ui:widget"] || subSchema?.type
    });
    return /* @__PURE__ */ qwik._jsxC(FormWidget, {
      get layout() {
        return props.layout;
      },
      additionalProps: props1,
      field,
      subSchema,
      [qwik._IMMUTABLE]: {
        layout: qwik._fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 3, "2l_0");
  };
  qwik.useTaskQrl(/* @__PURE__ */ qwik.inlinedQrl(() => {
    const [dataPath2, props2] = qwik.useLexicalScope();
    if (!props2.formData.internal.fields[dataPath2.join(".")])
      props2.formData.internal.fields[dataPath2.join(".")] = getInitialFieldStore(dataPath2.join("."));
  }, "ControlTemplateMaker_component_useTask_kTWfUL1dnQM", [
    dataPath,
    props
  ]));
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxC(Field, {
      name: dataPath.join("."),
      get of() {
        return props.formData;
      },
      children: (field, props1) => /* @__PURE__ */ qwik._jsxC(FormTemplate, {
        field,
        get layout() {
          return props.layout;
        },
        children: [
          widget(field, props1),
          /* @__PURE__ */ qwik._jsxC(ErrorTemplate, {
            "q:slot": "errors",
            get errors() {
              return field.error;
            },
            [qwik._IMMUTABLE]: {
              errors: qwik._wrapProp(field, "error"),
              "q:slot": qwik._IMMUTABLE
            }
          }, 3, "2l_1")
        ],
        subSchema,
        [qwik._IMMUTABLE]: {
          layout: qwik._fnSignal((p0) => p0.layout, [
            props
          ], "p0.layout")
        }
      }, 1, "2l_2"),
      type: subSchema?.type,
      [qwik._IMMUTABLE]: {
        of: qwik._fnSignal((p0) => p0.formData, [
          props
        ], "p0.formData")
      }
    }, 3, "2l_3")
  }, 1, "2l_4");
}, "ControlTemplateMaker_component_gL3RUfrE0Yw"));
const defaultClasses = ".form-vertical-default {\n  display: flex;\n  flex-direction: column;\n}\n\n.form-horizontal-default {\n  display: flex;\n  flex-direction: row;\n}\n\n.form-control-default {\n  padding: 6px;\n}\n\n.form-control-widget-default {\n  padding: 4px;\n}\n";
function inferUiSchemaSingle(schema, scope) {
  if (typeof schema === "boolean" || Array.isArray(schema) || !schema)
    return {
      type: exports.TemplateType.CONTROL,
      scope
    };
  switch (schema.type) {
    case "array":
      return {
        type: exports.TemplateType.ARRAY,
        scope
      };
    case "null":
    case "string":
    case "integer":
    case "boolean":
    case "number":
    default:
      return {
        type: exports.TemplateType.CONTROL,
        scope
      };
  }
}
const ArrayTemplateMaker = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  let layoutScope = props.layout.scope;
  let newOverrideScope = props.overrideScope;
  if (props.itemScope) {
    layoutScope = layoutScope.replace(/\{scope\}/g, props.itemScope);
    if (newOverrideScope)
      newOverrideScope = props.layout.scope.replace(/\{scope\}\/?/g, newOverrideScope);
  }
  const subSchema = resolveSchema(props.formData.schema, newOverrideScope || layoutScope, props.formData.schema);
  const dataPath = toDataPathSegments(layoutScope);
  const FormTemplate = getTemplate(props.layout.type, props.formData.uiSchema.templates, props.layout["ui:template"]);
  const addItem = /* @__PURE__ */ qwik.inlinedQrl(() => {
    const [dataPath2, props2] = qwik.useLexicalScope();
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
  qwik.useTaskQrl(/* @__PURE__ */ qwik.inlinedQrl(() => {
    const [dataPath2, props2] = qwik.useLexicalScope();
    if (!props2.formData.internal.fields[dataPath2.join(".")])
      props2.formData.internal.fields[dataPath2.join(".")] = getInitialFieldStore(dataPath2.join("."));
  }, "ArrayTemplateMaker_component_useTask_Csvxd5Rb3s8", [
    dataPath,
    props
  ]));
  const ButtonTemplate = getAdditionalTemplate(exports.AdditionalTemplateType.BUTTON, props.formData.uiSchema.templates, "addButton");
  return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ qwik._jsxC(FormTemplate, {
      get layout() {
        return props.layout;
      },
      children: [
        (props.formData.internal.fields[dataPath.join(".")]?.value || []).map((_item, i) => /* @__PURE__ */ qwik._jsxC(SchemaParser, {
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
          [qwik._IMMUTABLE]: {
            formData: qwik._fnSignal((p0) => p0.formData, [
              props
            ], "p0.formData"),
            templates: qwik._fnSignal((p0) => p0.formData.uiSchema.templates, [
              props
            ], "p0.formData.uiSchema.templates")
          }
        }, 3, dataPath.join(".") + "-" + i)),
        /* @__PURE__ */ qwik._jsxC(ButtonTemplate, {
          get props() {
            return {
              type: "button",
              onClick$: addItem
            };
          },
          children: "Add",
          [qwik._IMMUTABLE]: {
            props: qwik._fnSignal((p0) => ({
              type: "button",
              onClick$: p0
            }), [
              addItem
            ], '{type:"button",onClick$:p0}')
          }
        }, 3, "92_0")
      ],
      subSchema,
      [qwik._IMMUTABLE]: {
        layout: qwik._fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "92_1")
  }, 1, "92_2");
}, "ArrayTemplateMaker_component_wblFW1RfRCw"));
const SchemaParser = /* @__PURE__ */ qwik.componentQrl(/* @__PURE__ */ qwik.inlinedQrl((props) => {
  qwik._jsxBranch();
  qwik.useStylesQrl(/* @__PURE__ */ qwik.inlinedQrl(defaultClasses, "SchemaParser_component_useStyles_1bfC7AAj0Qw"));
  if (props.layout.type === exports.TemplateType.HORIZONTAL_LAYOUT) {
    const Template = getTemplate(props.layout.type, props.templates, props.layout["ui:template"]);
    const items = props.layout.elements.map((x, i) => {
      return /* @__PURE__ */ qwik._jsxC(SchemaParser, {
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
        [qwik._IMMUTABLE]: {
          formData: qwik._fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: qwik._fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          overrideScope: qwik._fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope"),
          templates: qwik._fnSignal((p0) => p0.templates, [
            props
          ], "p0.templates")
        }
      }, 3, i);
    });
    return /* @__PURE__ */ qwik._jsxC(Template, {
      flex: false,
      grid: true,
      get layout() {
        return props.layout;
      },
      children: items,
      [qwik._IMMUTABLE]: {
        flex: qwik._IMMUTABLE,
        grid: qwik._IMMUTABLE,
        layout: qwik._fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "PK_0");
  }
  if (props.layout.type === exports.TemplateType.VERTICAL_LAYOUT) {
    const Template = getTemplate(props.layout.type, props.templates, props.layout["ui:template"]);
    const items = props.layout.elements.map((x, i) => {
      return /* @__PURE__ */ qwik._jsxC(SchemaParser, {
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
        [qwik._IMMUTABLE]: {
          formData: qwik._fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: qwik._fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          overrideScope: qwik._fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope"),
          templates: qwik._fnSignal((p0) => p0.templates, [
            props
          ], "p0.templates")
        }
      }, 3, i);
    });
    return /* @__PURE__ */ qwik._jsxC(Template, {
      grid: true,
      get layout() {
        return props.layout;
      },
      children: items,
      [qwik._IMMUTABLE]: {
        grid: qwik._IMMUTABLE,
        layout: qwik._fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout")
      }
    }, 1, "PK_1");
  }
  if (props.layout.type === exports.TemplateType.ARRAY)
    return /* @__PURE__ */ qwik._jsxC(ArrayTemplateMaker, {
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
      [qwik._IMMUTABLE]: {
        formData: qwik._fnSignal((p0) => p0.formData, [
          props
        ], "p0.formData"),
        itemScope: qwik._fnSignal((p0) => p0.itemScope, [
          props
        ], "p0.itemScope"),
        layout: qwik._fnSignal((p0) => p0.layout, [
          props
        ], "p0.layout"),
        overrideScope: qwik._fnSignal((p0) => p0.overrideScope, [
          props
        ], "p0.overrideScope")
      }
    }, 3, "PK_2");
  if (props.layout.type === exports.TemplateType.CONTROL)
    return /* @__PURE__ */ qwik._jsxC(jsxRuntime.Fragment, {
      children: /* @__PURE__ */ qwik._jsxC(ControlTemplateMaker, {
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
        [qwik._IMMUTABLE]: {
          formData: qwik._fnSignal((p0) => p0.formData, [
            props
          ], "p0.formData"),
          itemScope: qwik._fnSignal((p0) => p0.itemScope, [
            props
          ], "p0.itemScope"),
          layout: qwik._fnSignal((p0) => p0.layout, [
            props
          ], "p0.layout"),
          overrideScope: qwik._fnSignal((p0) => p0.overrideScope, [
            props
          ], "p0.overrideScope")
        }
      }, 3, "PK_3")
    }, 1, "PK_4");
  throw new Error(`SchemaParser: Layout Type is invalid at: ${JSON.stringify(props.layout, null, 4)}`);
}, "SchemaParser_component_FDQ3hr5ltMg"));
function QJSONForm({ of: form, action, onSubmit$, responseDuration: duration, keepResponse, shouldActive, shouldTouched, shouldDirty, shouldFocus, reloadDocument, ...formProps }) {
  const { encType } = formProps;
  const options = {
    duration,
    shouldActive,
    shouldTouched,
    shouldDirty,
    shouldFocus
  };
  return /* @__PURE__ */ qwik._jsxS("form", {
    ...formProps,
    action: action?.actionPath,
    children: [
      /* @__PURE__ */ qwik._jsxC(SchemaParser, {
        get layout() {
          return form.uiSchema.layout;
        },
        get templates() {
          return form.uiSchema.templates;
        },
        formData: form,
        [qwik._IMMUTABLE]: {
          layout: qwik._wrapProp(form.uiSchema, "layout"),
          templates: qwik._wrapProp(form.uiSchema, "templates")
        }
      }, 3, "SK_0"),
      /* @__PURE__ */ qwik._jsxQ("button", null, {
        type: "submit"
      }, "Test", 3, null)
    ],
    onSubmit$: /* @__PURE__ */ qwik.inlinedQrl(async (event, element) => {
      const [action2, encType2, form2, keepResponse2, onSubmit$2, options2, reloadDocument2] = qwik.useLexicalScope();
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
    }, "QJSONForm_form_onSubmit_AoSkWNYKq5I", [
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
  }, 0, "SK_1");
}
function useQJSONFormStore(schema, { validate: validate2, validateOn = "submit", revalidateOn = "input", ...options }) {
  return qwik.useStore(() => {
    const [fields] = getInitialStores(options);
    return {
      internal: {
        fields,
        validate: validate2,
        validators: [],
        validateOn,
        revalidateOn
      },
      schema,
      uiSchema: options.uiSchema,
      // FIXME: Set state based on `action`
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
function useQJSONForm(schema, options) {
  const form = useQJSONFormStore(schema, options);
  return [
    form,
    {
      QJSONForm: (props) => QJSONForm({
        of: form,
        action: options.action,
        ...props
      })
    }
  ];
}
function createUiSchema({ templates, widgets, layout }) {
  return {
    layout,
    widgets,
    templates
  };
}
exports.QJSONForm = QJSONForm;
exports.createUiSchema = createUiSchema;
exports.useQJSONForm = useQJSONForm;
exports.useQJSONFormStore = useQJSONFormStore;