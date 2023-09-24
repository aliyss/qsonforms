import { component$, useTask$ } from "@builder.io/qwik";
import type { ControlWidgetProps } from "../../types";

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
