import { useEffect, useState } from 'react';

export default function useLocalStorage(key, defaultValue = null) {
	const [value, setValue] = useState(() => {
		try {
			const saved = localStorage.getItem(key);
			if (saved !== null) {
				return JSON.parse(saved);
			}

			localStorage.setItem(key, JSON.stringify(defaultValue));
			return defaultValue;
		} catch {
			localStorage.setItem(key, JSON.stringify(defaultValue));
			return defaultValue;
		}
	});

	const clearValue = () => {
		setValue(() => JSON.parse(null));
	};

	useEffect(() => {
		if (value === null) {
			localStorage.removeItem(key);
			return;
		}

		try {
			const rawValue = JSON.stringify(value);
			localStorage.setItem(key, rawValue);
		} catch (error) {
			console.error(
				`The value you are trying to save as ${key} to localStorage is invalid`
			);
			console.error(error);
		}
	}, [value, key]);

	return [value, setValue, clearValue];
}
