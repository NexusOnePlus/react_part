import { useState } from "react";

export function useLocalStorage(key, initialValue) {
    const [storedvalue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialvalue;
        } catch {
            return initialValue;
        }
    })
    const setValue = value => {
        try {
            setStoredValue(value)
            window.localStorage.setItem(key, JSON.stringify(value))
        }
        catch (e) {
            console.error("local", e)
        }
    }
    return [storedvalue, setValue]

}