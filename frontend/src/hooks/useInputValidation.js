import { useState } from "react"; 

export default function useInputValidation(validateValue) {
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isValueValid = validateValue(value);
  const toShowError = !isValueValid && isTouched;

  const valueChangeHandler = (e) => setValue(e.target.value);
  const onBlurHandler = () => setIsTouched(true);
  const reset = () => {
    setValue("");
    setIsTouched(false);
  };

  return {
    value,
    isValueValid,
    toShowError,
    valueChangeHandler,
    onBlurHandler,
    reset,
  };
}
