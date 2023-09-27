import 'jest'
import { User, getUser } from "../../src/data/user"

describe ('test User class', () => {
  const username = "testusername";
  const name = "Test User";
  const company = "Acme Corp";
  const user = new User(username, name, company);

  test('Confirm toItem fields', () => {
    const userToItem = user.toItem();
    expect(userToItem).toHaveProperty('username');
  });

  test('Confirm PK and SK format', () => {
    expect(user.pk).toBe(`USER#${username}`);
    expect(user.sk).toBe(`USER#${username}`);
  });
});