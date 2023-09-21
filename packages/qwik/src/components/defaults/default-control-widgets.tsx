import { component$ } from "@builder.io/qwik";
import { ControlWidgetProps } from "../../types";

export const DefaultControlWidget = component$<ControlWidgetProps>(() => {
  return (
    <>
      <div>Error no Widget found.</div>
    </>
  );
});

export const DefaultStringWidget = component$<ControlWidgetProps>(
  ({ initialData, additionalProps }) => {
    return (
      <>
        <input value={initialData} {...additionalProps} />
      </>
    );
  },
);

export const DefaultBooleanWidget = component$<ControlWidgetProps>(
  ({ initialData, additionalProps }) => {
    return (
      <>
        <input
          type="checkbox"
          checked={initialData}
          value={initialData}
          {...additionalProps}
        />
      </>
    );
  },
);

export const DefaultNumberWidget = component$<ControlWidgetProps>(
  ({ initialData, additionalProps }) => {
    return (
      <>
        <input type="number" value={initialData} {...additionalProps} />
      </>
    );
  },
);
