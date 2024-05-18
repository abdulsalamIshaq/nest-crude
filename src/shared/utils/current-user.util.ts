import { User, UserDocument } from '../../modules/user/models/user.model';

type UserProperties = keyof UserDocument;

export default class CurrentUser {
  static user: User; // Define user as a static property

  static set(user: User): void {
    // Assign user to the static property
    CurrentUser.user = user;
  }

  static get<T>(key?: UserProperties): T | User {
    // return user if key is undeined
    if (!key) {
      return CurrentUser.user;
    }

    // Ensure user is defined and the key exists in user
    if (!CurrentUser.user || !(key in CurrentUser.user)) {
      throw new Error(`Property ${key} does not exist in User object`);
    }

    // Return the value for the key, cast to the specified type
    return CurrentUser.user[key] as T;
  }
}
