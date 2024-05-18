import 'reflect-metadata';
import { it, expect, describe, beforeAll, beforeEach, afterAll, jest } from '@jest/globals'
import { Role, User } from '@prisma/client'
import { faker } from '@faker-js/faker';
import Container from 'typedi'
import { UserRepository } from '@src/user/user.repository'
import { CryptService } from '@src/util/services/bcrypt.services';
import { PrismaClient } from '@src/util/services/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


describe('#userRepository Suite Test', () => {
    const prismaClient = Container.get(PrismaClient)
    const cryptService = Container.get(CryptService)
    const userRepository = Container.get(UserRepository)

    type FakeUser = User | User[]

    let fakeUser: FakeUser;

    beforeEach(() => {
        jest.resetAllMocks()
    })

    const generateUser = (n: number = 0, fields: { [key in keyof User]?: any } = {}, extraProperty: any = {}): FakeUser => {

        if (n > 0) {
            const fakeUsers = []
            for (let i = 0; i < n; i++) {
                const fakeUser: User = {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    role: faker.helpers.enumValue(Role),
                    isActive: faker.datatype.boolean(0.5),
                    createdAt: faker.date.recent({ days: 9 }),
                    updatedAt: faker.date.recent({ days: 3 })
                }

                Object.assign(fakeUser, fields, extraProperty)
                Object.keys(fields).forEach(key => {
                    if (!fields[key as keyof User]) {
                        delete fakeUser[key as keyof User]
                    }
                })
                fakeUsers.push(fakeUser)
            }

            return fakeUsers
        }

        const fakeUser: User = {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.enumValue(Role),
            isActive: faker.datatype.boolean(0.5),
            createdAt: faker.date.recent({ days: 9 }),
            updatedAt: faker.date.recent({ days: 3 })
        }

        Object.assign(fakeUser, fields, extraProperty)
        Object.keys(fields).forEach(key => {
            if (!fields[key as keyof User]) {
                delete fakeUser[key as keyof User]
            }
        })

        return fakeUser
    }

    describe('#getAllUsers', () => {
        beforeAll(() => {
            const numberOfUsers = 3;
            fakeUser = generateUser(numberOfUsers, { password: false }) as FakeUser;
        })

        it('should return all users in database', async () => {
            const limit = 3;
            const mockedData = fakeUser as User[]
            jest
                .spyOn(
                    prismaClient.user,
                    "findMany"
                ).mockResolvedValue(mockedData)

            const users = await userRepository.getAllUsers({ limit, offset: 0 })
            expect(users).toEqual(mockedData)
            expect(prismaClient.user.findMany).toHaveBeenCalledWith({
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    isActive: true,
                    password: false
                }
            })
        })

        it('should return only active users', async () => {

            const limit = 3;
            const offset = 0;
            const isActive = true;

            const mockedData: User[] = (fakeUser as User[]).filter((user) => {
                return user.isActive === isActive
            }).filter((_, idx) => {
                return idx < offset + limit
            }) as User[]


            jest
                .spyOn(
                    prismaClient.user,
                    "findMany"
                ).mockResolvedValue(mockedData)

            const user = await userRepository.getAllUsers({ isActive, limit, offset })

            expect(user).toStrictEqual(mockedData)
            expect(prismaClient.user.findMany).toHaveBeenCalledWith({
                where: { isActive },
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    isActive: true,
                    password: false
                }
            })
        })

        it('should return values from offset to limit', async () => {
            const limit = 3;
            const offset = 3;
            const isActive = true;

            const mockedUsers: User[] = (fakeUser as User[]).filter((profile) => {
                return profile.isActive === isActive
            }) as User[]

            const mockedData = mockedUsers.filter((_, idx) => {
                return idx < offset + limit
            }) as User[]


            jest
                .spyOn(
                    prismaClient.user,
                    "findMany"
                ).mockResolvedValue(mockedData)

            const profiles = await userRepository.getAllUsers({ isActive, limit, offset })

            expect(profiles).toStrictEqual(mockedData)
            expect(prismaClient.user.findMany).toHaveBeenCalledWith({
                where: { isActive },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    isActive: true,
                    password: false
                }
            })
        })

    })

    describe('#getUserById', () => {
        let userId: string;

        beforeAll(() => {
            fakeUser = generateUser(3, { password: false }) as User[];
        })

        it('should return the user with the same userId', async () => {
            // ARRANGE           
            const mockedData: User = fakeUser as User

            jest
                .spyOn(
                    prismaClient.user,
                    "findUniqueOrThrow"
                ).mockResolvedValue(mockedData)

            // ACT
            const user = await userRepository.getUserById({ userId })

            // ASSERT
            expect(user).toStrictEqual(mockedData)
            expect(user?.id).toStrictEqual(userId)
            expect(prismaClient.user.findUniqueOrThrow).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    isActive: true,
                    password: true
                },
                where: {
                    id: userId
                }
            })
        })

    })

    describe('#getUserByEmail', () => {
        let email: string = 'email@teste.com';

        beforeAll(() => {
            fakeUser = generateUser(0, { password: false, email }) as User;
        })

        it('should return the user with the same email', async () => {
            // ARRANGE           
            const mockedData: User = fakeUser as User

            jest
                .spyOn(
                    prismaClient.user,
                    "findUniqueOrThrow"
                ).mockResolvedValue(mockedData)

            // ACT
            const user = await userRepository.getUserByEmail({ email })

            // ASSERT
            expect(user).toStrictEqual(mockedData)
            expect(user.email).toStrictEqual(email)
            expect(prismaClient.user.findUniqueOrThrow).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    isActive: true,
                    password: true
                },
                where: {
                    email
                }
            })
        })

    })

    describe("#createUser", () => {
        let userId: string;
        let name: string;
        let email: string;
        let password: string;
        let role: Role;

        beforeAll(() => {
            userId = faker.string.uuid()

            fakeUser = generateUser(0, { id: userId, password: false, isActive: false }) as User;

            name = fakeUser.name;
            email = fakeUser.email;
            password = faker.internet.password();
            role = fakeUser.role;

        })

        it('should return the created account', async () => {
            // ARRANGE
            const mockedAccount = fakeUser as User
            const mockedData = mockedAccount
            const hashedPassword = await cryptService.hash(password);

            jest
                .spyOn(
                    prismaClient.user,
                    "create"
                ).mockResolvedValue(mockedData)
            jest
                .spyOn(
                    cryptService,
                    'hash'
                ).mockResolvedValue(hashedPassword)
            // ACT

            const user = await userRepository.createUser({ name, email, role, password, passwordConfirm: password })
            const expectedOptions = {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                },
                data: {
                    name,
                    password: hashedPassword,
                    email,
                    role
                }
            }

            // ASSERT
            expect(user).toStrictEqual(mockedData)
            expect(user?.id).toStrictEqual(userId)
            expect(user).not.toHaveProperty('password')
            expect(prismaClient.user.create).toHaveBeenCalledWith(expectedOptions)

        })

    })
})