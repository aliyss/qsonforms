import { component$ } from "@builder.io/qwik";
import { ControlWidgetProps } from "../../types";

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
  ({ initialData, layout, additionalProps }) => {
    return (
      <>
        <input
          value={initialData}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);

export const DefaultBooleanWidget = component$<ControlWidgetProps>(
  ({ initialData, layout, additionalProps }) => {
    return (
      <>
        <input
          type="checkbox"
          checked={initialData}
          value={initialData}
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
  ({ initialData, layout, additionalProps }) => {
    return (
      <>
        <input
          type="number"
          value={initialData}
          {...additionalProps}
          class={`form-control-widget ${
            layout["ui:widget:class"] || "form-control-widget-default"
          }`}
        />
      </>
    );
  },
);
