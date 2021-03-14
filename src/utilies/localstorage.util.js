import AsyncStorage from '@react-native-async-storage/async-storage';

module.exports = {
    storeData: async (key, value) => {
        return new Promise(async (done, reject) => {
            try {
                const jsonValue = typeof value === "string" ? value : JSON.stringify(value)
                AsyncStorage.setItem(key, jsonValue);
                done(value)
                return value;
            } catch (e) {
                reject(e)
                return null;
            }
        })

    },
    getData: async (key) => {
        return new Promise(async (done, reject) => {
            try {
                let value = await AsyncStorage.getItem(key);
                if (value) done(JSON.parse(value))
                else reject()
                return value;
            } catch (e) {
                reject(e);
                return null;
            }
        });
    },
    deleteData: async (key) => {
        return new Promise(async (done, reject) => {
            try {
                await AsyncStorage.removeItem(key, error => {
                    if (error) reject(error); else done()
                });
                done()
            } catch (e) {
                reject(e);
            }
        });
    }
}