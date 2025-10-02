/* eslint-disable no-unused-vars */
"use strict";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

/**
 * RenderInputByComponentType
 * - Accepts className and forwards it to the underlying input/select/textarea.
 * - Calls onChange(fieldName, value).
 */
function RenderInputByComponentType({ controlItem, value, onChange, className = "" }) {
  const types = {
    INPUT: "input",
    SELECT: "select",
    TEXTAREA: "textarea",
  };

  switch (controlItem.componentType) {
    case types.INPUT:
      return (
        <Input
          name={controlItem.name}
          placeholder={controlItem.placeholder}
          id={controlItem.name}
          type={controlItem.type}
          value={value}
          onChange={(e) => onChange(controlItem.name, e.target.value)}
          className={className}
        />
      );

    case types.SELECT:
      return (
        <Select
          onValueChange={(val) => onChange(controlItem.name, val)}
          value={value}
        >
          <SelectTrigger className={`w-full ${className}`}>
            <SelectValue placeholder={controlItem.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {controlItem?.options?.length > 0
              ? controlItem.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.id}>
                    {optionItem.label}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>
      );

    case types.TEXTAREA:
      return (
        <Textarea
          name={controlItem.name}
          placeholder={controlItem.placeholder}
          id={controlItem.name}
          value={value}
          onChange={(e) => onChange(controlItem.name, e.target.value)}
          className={className}
        />
      );

    default:
      return (
        <input
          name={controlItem.name}
          placeholder={controlItem.placeholder}
          id={controlItem.name}
          type={controlItem.type}
          value={value}
          onChange={(e) => onChange(controlItem.name, e.target.value)}
          className={className}
        />
      );
  }
}


function CommonForm({
  formControls = [],
  onSubmit,
  buttonText,
  formData = {},
  setFormData,
  errors = {},
  validators = {},
  setErrors,
}) {
  const [loading, setLoading] = useState(false);

  // handle input change + live validation
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (validators[fieldName]) {
      const errorMsg = validators[fieldName](value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: errorMsg,
      }));
    } else {
      // no validator → clear error
      setErrors((prev) => {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  };


  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Run all validations before submit
    const newErrors = {};
    for (const field of Object.keys(validators)) {
      const errorMsg = validators[field](formData[field]);
      if (errorMsg) newErrors[field] = errorMsg;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error("Form submit error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div key={controlItem.name} className="grid w-full gap-1.5">
            <Label className="mb-0">{controlItem.label}</Label>

            {/* Pass handleChange directly: it will be called as handleChange(name, value) */}
            <RenderInputByComponentType
              controlItem={controlItem}
              value={formData[controlItem.name] ?? ""}
              onChange={handleChange}
              className={errors[controlItem.name] ? "border-red-500" : ""}
            />

            {errors && errors[controlItem.name] && (
              <p className="text-sm text-red-600 mt-1">{errors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* General error - safe because errors default to {} */}
      {errors.general && (
        <p className="text-red-500 text-center text-sm">{errors.general}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
