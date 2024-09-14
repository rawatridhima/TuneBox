import { child, get, ref, set, update } from "firebase/database";
import { database } from "../Firebase";
import { uid } from "uid";
// import { uid } from "react-uid";

export default class UserService {
  // create a record
  static async create(entity) {
    try {
      const id = uid();
      const data = await set(ref(database, `users /${id}`), {
        ...entity,
        id,
        timeStamp: Date.now(),
      });
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  // read one or more records
  static async read(id = "") {
    try {
      const snapshot = await get(child(ref(database), `users /${id}`));
      if (snapshot.exists()) return snapshot.val();
      return null;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  //update only one record.
  static async update(id, entity) {
    try {
      const data = await update(ref(database, `users /${id}`), entity);
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  // extra methods
  static async getUserByEmail(email) {
    const res = Object.values((await this.read()) || []);
    const arr = [];
    res.forEach((x, i) => {
      if (x.email == email) {
        arr.push(x);
      }
    });
    return arr;
  }
}
