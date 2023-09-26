import { $, component$, noSerialize, useTask$ } from "@builder.io/qwik";
import type { ControlWidgetProps, FieldElement } from "../../types";

export const DefaultControlWidget = component$<ControlWidgetProps>(
  ({ layout }) => {
    return (
      <>
        <div
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        >
          Error no Widget found.
        </div>
      </>
    );
  },
);

export const DefaultStringWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    return (
      <>
        <input
          value={field.value}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);

export const DefaultSelectWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    return (
      <>
        <select
          value={field.value}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        >
          <option
            disabled
            selected={
              !field.value ||
              !additionalProps.selectOptions?.includes(field.value)
            }
            value={undefined}
          >
            {!additionalProps.selectOptions?.includes(field.value)
              ? field.value
              : "-- select an option --"}
          </option>
          {additionalProps.selectOptions?.map((v, i) => {
            return (
              <option key={i} value={v} selected={v === field.value}>
                {v}
              </option>
            );
          })}
        </select>
      </>
    );
  },
);

export const DefaultPasswordWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    return (
      <>
        <input
          value={field.value}
          {...additionalProps}
          type={"password"}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);

export const DefaultUniqueItemEnumWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    const checkboxValue = !!field.value;
    const { onInput$, ...props } = additionalProps;
    const inputChange = noSerialize(onInput$);
    const onInput = $((event: Event, element: FieldElement) => {
      if (!checkboxValue) {
        field.value = field.internal.startValue;
      } else {
        field.value = undefined;
      }
      if (inputChange) {
        inputChange(event, element);
      }
    });
    return (
      <>
        <div class={layout["ui:class"] || "default-uniqueitem-enum-widget"}>
          <input
            type="checkbox"
            checked={checkboxValue}
            value={field.value}
            onInput$={(...args) => onInput(...args)}
            {...props}
            class={`form-control-widget ${
              layout["ui:widget:class"] || "form-control-widget-default"
            }`}
          />
          {field.internal.startValue}
        </div>
      </>
    );
  },
);

export const DefaultBooleanWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    useTask$(() => {
      if (!field.value) {
        field.value = false;
      }
    });
    return (
      <>
        <input
          type="checkbox"
          checked={field.value}
          value={field.value}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);

export const DefaultNumberWidget = component$<ControlWidgetProps>(
  ({ field, layout, additionalProps }) => {
    return (
      <>
        <input
          type="number"
          value={field.value}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);
