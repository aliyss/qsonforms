import { createContextId } from "@builder.io/qwik";

export const FormDataContext = createContextId<any>("FormData");

let formData: any;

export const setFormData = (newFormData: any) => {
  formData = newFormData;
  return formData;
};

export const getFormData = () => formData;
