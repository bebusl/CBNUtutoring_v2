import { useState, useCallback } from "react";

export function useInput(initValue) {
    const [values, setValues] = useState(initValue);

    const onChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((values) => ({ ...values, [name]: value }));
    }, []);

    const onFileChange = useCallback((e) => {
        setValues((values) => ({ ...values, ["file"]: e.taraget.file[0] }));
    }, []);

    const reset = useCallback(() => {
        setValues(initValue);
    }, [initValue]);
    return { values, onChange, onFileChange, reset };
}
//form field 입력받을 때 사용하는 훅.
