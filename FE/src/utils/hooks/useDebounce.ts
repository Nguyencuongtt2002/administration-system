// Libs
import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number): T => {
  //#region Declare State
  const [debounceValue, setDebounceValue] = useState<T>(value);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  //#endregion Implement Hook

  return debounceValue;
};

export default useDebounce;
