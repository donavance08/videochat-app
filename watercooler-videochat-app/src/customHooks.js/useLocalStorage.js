export default function useLocalStorage(name) {
	const getLocalStorage = async () => {
		try {
			const localStore = await localStorage.getItem(name);
			if (localStore != null) {
				return JSON.parse(localStore);
			}

			return null;
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	const setLocalStorage = (payload) => {
		localStorage.setItem(name, payload);
	};

	const deleteFromLocalStorage = () => {
		localStorage.removeItem(name);
	};
}
