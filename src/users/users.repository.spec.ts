import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import datasource from '../../db/datasource';

let userRepository: Repository<User>;
let connection: DataSource;

const createMinimalUser = (emailSuffix: string) => ({
  email: `test${emailSuffix}@example.com`,
  password: 'securePassword123',
});

beforeAll(async () => {
  connection = await datasource.initialize();
  userRepository = connection.getRepository(User);
});

afterAll(async () => {
  await connection.destroy();
});

afterEach(async () => {
  await userRepository.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
});

describe('User Repository Basic Operations', () => {
  it('должен корректно сохранить нового пользователя', async () => {
    const userData = createMinimalUser('save');

    const newUser = userRepository.create(userData);
    const savedUser = await userRepository.save(newUser);

    expect(savedUser).toBeDefined();
    expect(savedUser.id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);

    const foundUser = await userRepository.findOneBy({ id: savedUser.id });
    expect(foundUser).toBeDefined();
    expect(foundUser!.email).toBe(userData.email);
  });

  it('должен найти пользователя по email', async () => {
    const userData = createMinimalUser('find');
    await userRepository.save(userRepository.create(userData));

    const foundUser = await userRepository.findOneBy({ email: userData.email });

    expect(foundUser).toBeDefined();
    expect(foundUser!.email).toBe(userData.email);
  });

  it('должен корректно обновить email пользователя', async () => {
    const initialData = createMinimalUser('update');
    const user = await userRepository.save(userRepository.create(initialData));
    const newEmail = 'updated.email@test.com';

    user.email = newEmail;
    const updatedUser = await userRepository.save(user);

    expect(updatedUser.email).toBe(newEmail);
    const userInDb = await userRepository.findOneBy({ id: user.id });
    expect(userInDb!.email).toBe(newEmail);
  });

  it('должен корректно удалить пользователя из БД', async () => {
    const initialData = createMinimalUser('delete');
    const user = await userRepository.save(userRepository.create(initialData));

    const userBeforeDelete = await userRepository.findOneBy({ id: user.id });
    expect(userBeforeDelete).toBeDefined();

    await userRepository.remove(user);

    const userAfterDelete = await userRepository.findOneBy({ id: user.id });
    expect(userAfterDelete).toBeNull();
  });
});
