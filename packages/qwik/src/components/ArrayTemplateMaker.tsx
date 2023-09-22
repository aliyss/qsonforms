import { $, Component, component$, useTask$ } from "@builder.io/qwik";
import {
  ArrayLayout,
  ArrayTemplates,
  ControlTemplateProps,
  ControlTemplates,
  ControlWidgets,
  DefaultArrayTemplates,
  DefaultControlTemplates,
  DefaultControlWidgets,
  DefaultHorizontalTemplates,
  DefaultVerticalTemplates,
  FormStore,
  HorizontalTemplates,
  VerticalTemplates,
} from "../types";
import { resolveSchema } from "../models/schema/utils/resolvers";
import { toDataPathSegments } from "../models/schema/utils/path";
import { getTemplate } from "../models/uiSchema/utils";
import { JSONSchema7Object } from "json-schema";
import { getInitialFieldStore } from "../utils/getInitialFieldStore";
import { SchemaParser } from "./SchemaParser";
import { inferUiSchemaSingle } from "../models/uiSchema";

interface ArrayTemplateMakerProps<
  V extends VerticalTemplates | DefaultVerticalTemplates =
    | VerticalTemplates
    | DefaultVerticalTemplates,
  H extends HorizontalTemplates | DefaultHorizontalTemplates =
    | HorizontalTemplates
    | DefaultHorizontalTemplates,
  A extends ArrayTemplates | DefaultArrayTemplates =
    | ArrayTemplates
    | DefaultArrayTemplates,
  C extends ControlTemplates | DefaultControlTemplates =
    | ControlTemplates
    | DefaultControlTemplates,
  W extends ControlWidgets | DefaultControlWidgets =
    | ControlWidgets
    | DefaultControlWidgets,
> {
  layout: ArrayLayout<V, H, A, C, W>;
  formData: FormStore<any, undefined>;
  overrideScope?: string;
  itemScope?: string;
}

export const ArrayTemplateMaker = component$<ArrayTemplateMakerProps>(
  ({ layout, formData, overrideScope, itemScope }) => {
    let layoutScope = layout.scope;
    let newOverrideScope = overrideScope;
    if (itemScope) {
      layoutScope = layoutScope.replace(/\{scope\}/g, itemScope);
      if (newOverrideScope) {
        newOverrideScope = layout.scope.replace(
          /\{scope\}\/?/g,
          newOverrideScope,
        );
      }
    }

    const subSchema = resolveSchema(
      formData.schema,
      newOverrideScope || layoutScope,
      formData.schema,
    );
    const dataPath = toDataPathSegments(layoutScope);

    const FormTemplate = getTemplate(
      layout.type,
      formData.uiSchema.templates,
      layout["ui:template"],
    ) as Component<ControlTemplateProps>;

    const addItem = $(() => {
      const newItemPath = dataPath.join(".");
      if (!formData.internal.fields[newItemPath]) {
        formData.internal.fields[newItemPath] = getInitialFieldStore(
          dataPath.join("."),
        );
      }
      if (!formData.internal.fields[newItemPath]!.value) {
        formData.internal.fields[newItemPath]!.value = [];
      }
      formData.internal.fields[newItemPath]!.value.push(undefined);
    });

    useTask$(() => {
      if (!formData.internal.fields[dataPath.join(".")]) {
        formData.internal.fields[dataPath.join(".")] = getInitialFieldStore(
          dataPath.join("."),
        );
      }
    });

    return (
      <>
        <FormTemplate
          layout={layout}
          subSchema={subSchema as JSONSchema7Object}
        >
          {(formData.internal.fields[dataPath.join(".")]?.value || []).map(
            (_item: any, i: number) => (
              <>
                <SchemaParser
                  key={dataPath.join(".") + "-" + i}
                  layout={{
                    ...(layout["ui:items"] ||
                      inferUiSchemaSingle(
                        subSchema?.items,
                        layoutScope + `/items/${i}`,
                      )),
                  }}
                  itemScope={layoutScope + `/items/${i}`}
                  overrideScope={(newOverrideScope || layoutScope) + `/items/`}
                  templates={formData.uiSchema.templates}
                  formData={formData}
                />
              </>
            ),
          )}
          <div>
            <button type="button" onClick$={() => addItem()}>
              Add
            </button>
          </div>
        </FormTemplate>
      </>
    );
  },
);
