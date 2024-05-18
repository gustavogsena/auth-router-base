import 'reflect-metadata';
import { it, expect, describe, beforeAll, afterAll, jest } from '@jest/globals'
import { beforeEach } from 'node:test';
import Container from 'typedi';
import { CryptService } from '@src/util/services/bcrypt.services';


describe('#CryptService Suite Test', () => {
    const cryptService = Container.get(CryptService)

    beforeEach(() => {
        jest.resetAllMocks()
    })

    describe('#compare', () => {
        it('should return false if password doesnt match', async () => {
            // ARRANGE
            const password = 'passwordDificil'
            const hashedPassword = await cryptService.hash('novoPassword')

            // ACT
            const isPasswordEqual = await cryptService.compare(password, hashedPassword)

            // ASSERT
            expect(isPasswordEqual).toBeFalsy()
        })

        it('should return true if passwords match', async () => {
            // ARRANGE
            const password = 'passwordDificil'
            const hashedPassword = await cryptService.hash('passwordDificil')

            // ACT
            const isPasswordEqual = await cryptService.compare(password, hashedPassword)

            // ASSERT
            expect(isPasswordEqual).toBeTruthy()
        })
    })
    describe('#hash', () => {
        it('should return an 10 rounded encrypted password', async () => {
            // ARRANGE
            const password = 'Password'

            // ACT
            const hashedPassword = await cryptService.hash(password)
            const rounds = cryptService.crypto.getRounds(hashedPassword);
            // ASSERT
            expect(rounds).toEqual(10)
        })

        it('should return an encrypted password', async () => {
            // ARRANGE
            const password = 'PassworD'
            // ACT
            const hashedPassword = await cryptService.hash(password)
            const expectedLength = 60 
            // ASSERT
            expect(hashedPassword).toMatch(/^\$2[aby]\$.+$/g)
            expect(hashedPassword).toHaveLength(expectedLength)
        })


    })
})